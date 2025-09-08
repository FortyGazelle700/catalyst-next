"use server";

import type { CanvasApiCtx } from "..";
import type { periods, periodTimes } from "@/server/db/schema";
import type { Course } from "../types";
import type { InferSelectModel } from "drizzle-orm";

export type CurrentScheduleWithCoursesInput = {
  date?: Date; // Optional date, defaults to today
  useCache?: boolean;
};

export type SchedulePeriodWithCourse = {
  period: InferSelectModel<typeof periods>;
  time: InferSelectModel<typeof periodTimes> & {
    startTime: string;
    endTime: string;
  };
  option?:
    | {
        type: "course";
        data: Course | undefined;
      }
    | {
        type: "single_select";
        data: boolean;
      };
};

export type CurrentScheduleWithCoursesOutput = {
  date: Date;
  periods: SchedulePeriodWithCourse[];
};

export default async function currentScheduleWithCourses(ctx: CanvasApiCtx) {
  return async (input: CurrentScheduleWithCoursesInput = {}) => {
    const { unstable_cache } = await import("next/cache");
    const courseList = (await import("./list")).default;

    const getCurrentScheduleWithCourses = async (): Promise<{
      success: boolean;
      data: CurrentScheduleWithCoursesOutput | null;
      errors: {
        message: string;
      }[];
    }> => {
      const { periods, periodTimes, scheduleDates, scheduleValues, settings } =
        await import("@/server/db/schema");
      const { eq, and } = await import("drizzle-orm");

      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: null,
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }

      // Use provided date or default to today
      const targetDate = input.date ?? new Date();
      const dateString = new Date(targetDate.toDateString() + " 00:00:00 UTC");

      // Get user settings to find school ID
      const userSettings = await ctx.db
        .select()
        .from(settings)
        .where(eq(settings.userId, ctx.user.get?.id ?? ""));

      const schoolId =
        userSettings.find((val) => val.key == "school_id")?.value ?? "";

      if (!schoolId) {
        return {
          success: false,
          data: null,
          errors: [
            {
              message: "School ID not found in user settings",
            },
          ],
        };
      }

      // Get the current day's schedule
      const currentSchedule = await ctx.db
        .select()
        .from(scheduleDates)
        .where(
          and(
            eq(scheduleDates.schoolId, schoolId),
            eq(scheduleDates.date, dateString),
          ),
        );

      if (!currentSchedule.length) {
        return {
          success: false,
          data: null,
          errors: [
            {
              message: `No schedule found for date: ${targetDate.toDateString()}`,
            },
          ],
        };
      }

      // Get all periods for this school
      const schoolPeriods = await ctx.db
        .select()
        .from(periods)
        .where(eq(periods.schoolId, schoolId));

      // Get the period times for the current schedule
      const periodTimesList = await ctx.db
        .select()
        .from(periodTimes)
        .where(
          eq(periodTimes.scheduleId, currentSchedule[0]?.scheduleId ?? ""),
        );

      // Get user's period assignments (which course is in which period)
      // Note: scheduleValues.periodId should match periods.optionId based on your original function
      const periodValues = await ctx.db
        .select()
        .from(scheduleValues)
        .where(eq(scheduleValues.userId, ctx.user.get?.id ?? ""));

      const coursesResult = await (
        await courseList(ctx)
      )({
        enrollmentState: "active",
        limit: 100,
        offset: 1,
      });

      if (!coursesResult.success) {
        return {
          success: false,
          data: null,
          errors: coursesResult.errors,
        };
      }

      // Build the schedule by combining period times with courses
      const scheduleWithCourses: SchedulePeriodWithCourse[] = periodTimesList
        // .filter(
        //   (pt, idx) =>
        //     idx == periodTimesList.findIndex((p) => p.optionId == pt.optionId),
        // )
        .map((periodTime) => {
          const period = schoolPeriods.find(
            (p) => p.optionId == periodTime.optionId,
          );

          if (!period) return null;

          // Find what's assigned to this period for this user
          // Based on your original function, scheduleValues.periodId matches periods.optionId
          const periodAssignment = periodValues.find(
            (pv) => pv.periodId == periodTime.optionId,
          );

          let option: SchedulePeriodWithCourse["option"] = undefined;

          const assignmentValue = periodAssignment?.value;
          const numericValue = Number(assignmentValue);

          if (period.type == "course") {
            const course = coursesResult.data?.find(
              (c) => c.id == numericValue,
            );
            option = {
              type: "course",
              data: course,
            };
          } else if (period.type == "single") {
            option = {
              type: "single_select",
              data: !!periodValues.find(
                (pv) => pv.value == periodTime.optionId,
              ),
            };
          }

          return {
            period,
            time: {
              ...periodTime,
              startTime: `${periodTime.start.split(":")[0]}:${periodTime.start.split(":")[1]}`,
              endTime: `${periodTime.end.split(":")[0]}:${periodTime.end.split(":")[1]}`,
            },
            option,
          };
        })
        .filter((item) => item !== null)
        .sort((a, b) => {
          // Sort by period order first, then by start time if order is the same
          const orderDiff =
            (a.period.periodOrder ?? 0) - (b.period.periodOrder ?? 0);
          if (orderDiff !== 0) return orderDiff;

          return a.time.start.localeCompare(b.time.start);
        });

      return {
        success: true,
        data: {
          date: targetDate,
          periods: scheduleWithCourses,
        },
        errors: [],
      };
    };

    if (input?.useCache ?? true) {
      const dateKey = input.date
        ? input.date.toISOString().split("T")[0]
        : "today";
      return await unstable_cache(
        getCurrentScheduleWithCourses,
        [ctx.user.get?.id ?? "", dateKey ?? "", String(new Date().getDate())],
        {
          revalidate: 300, // 5 minutes cache
          tags: [
            `user_${ctx.user.get?.id}:schedule:current_with_courses`,
            `user_${ctx.user.get?.id}:course:list_with_data`,
          ],
        },
      )();
    }

    return await getCurrentScheduleWithCourses();
  };
}
