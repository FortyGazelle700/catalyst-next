"use server";

import type { CanvasApiCtx } from "..";
import type { periods, periodTimes } from "@/server/db/schema";
import type { Course, Submission } from "../types";
import type { InferSelectModel } from "drizzle-orm";

export type CourseListWithPeriodDataInput = {
  enrollmentState?: "active" | "invited_or_pending" | "completed";
  limit: number;
  offset: number;
  sorted?: boolean;
  useCache?: boolean;
};

export type CourseListWithPeriodDataOutput = (Course & {
  data: {
    missingAssignments: number;
  };
  period?: InferSelectModel<typeof periods>;
  time?: InferSelectModel<typeof periodTimes> & {
    startTime: string;
    endTime: string;
  };
})[];

export default async function courseListWithPeriodData(ctx: CanvasApiCtx) {
  return async (input: CourseListWithPeriodDataInput) => {
    const { unstable_cache } = await import("next/cache");

    const courseListWithPeriodData = async (): Promise<{
      success: boolean;
      data: CourseListWithPeriodDataOutput;
      errors: {
        message: string;
      }[];
      nextCursor: number;
    }> => {
      const { periods, periodTimes, scheduleDates, scheduleValues, settings } =
        await import("@/server/db/schema");
      const { eq, and } = await import("drizzle-orm");
      const courseList = (await import("./list")).default;
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: [] as CourseListWithPeriodDataOutput,
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
          nextCursor: 0,
        };
      }
      const { data } = await (await courseList(ctx))(input);
      const periodValues = await ctx.db
        .select()
        .from(scheduleValues)
        .where(eq(scheduleValues.userId, ctx.user.get?.id ?? ""));

      const userSettings = await ctx.db
        .select()
        .from(settings)
        .where(eq(settings.userId, ctx.user.get?.id ?? ""));

      const schoolPeriods = await ctx.db
        .select()
        .from(periods)
        .where(
          eq(
            periods.schoolId,
            userSettings.find((val) => val.key == "school_id")?.value ?? ""
          )
        );

      const currentSchedule = await ctx.db
        .select()
        .from(scheduleDates)
        .where(
          and(
            eq(
              scheduleDates.schoolId,
              userSettings.find((val) => val.key == "school_id")?.value ?? ""
            ),
            eq(
              scheduleDates.date,
              new Date(new Date().toDateString() + " 00:00:00 UTC")
            )
          )
        );

      const schedule = await ctx.db
        .select()
        .from(periodTimes)
        .where(
          eq(
            periodTimes.scheduleId,
            currentSchedule.find((val) => val.id == currentSchedule[0]?.id)
              ?.scheduleId ?? ""
          )
        );

      const updatedCourses = await Promise.all(
        data?.map(async (course) => {
          let missingAssignments;

          try {
            const assignmentURL = new URL(
              `/api/v1/courses/${course.id}/students/submissions`,
              ctx.user.canvas.url
            );

            assignmentURL.searchParams.set("per_page", "100");
            assignmentURL.searchParams.append("include[]", "assignment");

            const assignmentsQuery = await fetch(assignmentURL, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });

            const submissionData =
              (await assignmentsQuery.json()) as Submission[];

            const missing = submissionData.filter(
              (assignment) =>
                (assignment.missing &&
                  (assignment.score ?? 0) == 0 &&
                  (assignment.assignment?.points_possible ?? 0) != 0) ||
                (!assignment.excused &&
                  assignment.score == 0 &&
                  (assignment.assignment?.points_possible ?? 0) != 0)
            );

            missingAssignments = missing.length;
          } catch (err) {
            // something doesn't work
          }

          const time = schedule.find(
            (time) =>
              time.optionId ==
              periodValues.find((val) => Number(val.value) == course.id)
                ?.periodId
          );

          return {
            ...course,
            data: {
              missingAssignments: missingAssignments ?? 0,
            },
            period: schoolPeriods.find(
              (period) =>
                period.periodId ==
                periodValues.find((val) => Number(val.value) == course.id)
                  ?.periodId
            ),
            time: time
              ? {
                  ...time,
                  startTime: `${Number(time?.start.split(":")[0])-1}:${time?.start.split(":")[1]}`,
                  endTime: `${Number(time?.end.split(":")[0])-1}:${time?.end.split(":")[1]}`,
                }
              : undefined,
          };
        })
      );
      const updatedCoursesSorted = updatedCourses.sort((a, b) =>
        (a.period?.periodOrder ?? 100000) > (b.period?.periodOrder ?? 100000)
          ? 1
          : -1
      );

      return {
        success: true,
        data: updatedCoursesSorted satisfies CourseListWithPeriodDataOutput,
        errors: [],
        nextCursor: Number(input?.offset ?? 0) + Number(input?.limit ?? 10),
      };
    };

    if (input?.useCache ?? true) {
      return await unstable_cache(
        courseListWithPeriodData,
        [
          "canvas",
          "courses",
          ...Object.entries(input)
            .map(([k, v]) => `${k}=${v}`)
            .sort((a, b) => a.localeCompare(b)),
        ],
        {
          revalidate: 60,
        }
      )();
    }
    return await courseListWithPeriodData();
  };
}
