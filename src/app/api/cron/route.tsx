import { Temporal } from "@js-temporal/polyfill";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  periodTimes,
  schools,
  scheduleDates,
  scheduleDatesSchedule,
  users,
} from "@/server/db/schema";
import { and, eq, lt } from "drizzle-orm";
import { api } from "@/server/api";
import SubmissionAlertEmail from "@/emails/submission-alert";

const sql =
  global.db ??
  postgres(process.env.DATABASE_URL!, {
    max: 1,
    ssl: "require",
  });

global.db ??= drizzle(sql as unknown as postgres.Sql<Record<string, unknown>>);

export async function POST(req: Request) {
  if (
    ((await req.json()) as { secret: string })?.secret !=
    process.env.CRON_SECRET
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  const dayOfWeek = Temporal.Now.zonedDateTimeISO("UTC").dayOfWeek;
  const hour = Temporal.Now.zonedDateTimeISO("UTC").hour;
  const minute = Temporal.Now.zonedDateTimeISO("UTC").minute;
  const offset = dstOffset();
  await sendNotifications();
  if (dayOfWeek == 7 && offset != 0 && hour == 4 && minute > 2 && minute < 9) {
    await makeScheduleChanges(offset);
  }
  if (hour == 4 && dayOfWeek == 6 && minute > 2 && minute < 9) {
    await makeScheduledScheduleDaysHappen();
  }
  return new Response(
    JSON.stringify({
      success: true,
      data: { message: "Success!" },
      errors: [],
    }),
    { status: 200 },
  );
}

function dstOffset(
  dateStr = Temporal.Now.plainDateISO(),
  tz = "America/New_York",
) {
  const today = Temporal.PlainDate.from(dateStr);
  const tomorrow = today.add({ days: 1 });

  const nowOffset = Temporal.ZonedDateTime.from(
    `${today.toString()}T00:00[${tz}]`,
  ).offsetNanoseconds;
  const tomorrowOffset = Temporal.ZonedDateTime.from(
    `${tomorrow.toString()}T00:00[${tz}]`,
  ).offsetNanoseconds;

  return (nowOffset - tomorrowOffset) / 1e9 / 60 / 60;
}

async function makeScheduleChanges(offset: number) {
  const db = global.db;
  const schoolsToUpdate = await db
    .select()
    .from(schools)
    .where(eq(schools.observeDST, true));

  const periodsToUpdate: { id: string; start: string; end: string }[] = [];

  for (const school of schoolsToUpdate) {
    const periods = await db
      .select()
      .from(periodTimes)
      .where(eq(periodTimes.schoolId, school.id));
    periodsToUpdate.push(...periods);
  }

  await db.transaction(async (trx) => {
    for (const period of periodsToUpdate) {
      const start = Temporal.PlainTime.from(period.start);
      const end = Temporal.PlainTime.from(period.end);

      const newStart = start.add({ hours: offset });
      const newEnd = end.add({ hours: offset });

      await trx
        .update(periodTimes)
        .set({
          start: newStart.toString(),
          end: newEnd.toString(),
        })
        .where(eq(periodTimes.id, period.id));
    }
  });
}

async function makeScheduledScheduleDaysHappen() {
  const db = global.db;
  const tz = "America/New_York";

  await db
    .delete(scheduleDates)
    .where(
      lt(
        scheduleDates.date,
        new Date(Temporal.Now.zonedDateTimeISO(tz).toPlainDate().toString()),
      ),
    );

  const schoolsToUpdate = await db.select().from(schools);

  for (const school of schoolsToUpdate) {
    const schedule = await db
      .select()
      .from(scheduleDatesSchedule)
      .where(eq(scheduleDatesSchedule.schoolId, school.id));

    for (const item of schedule) {
      if (item?.scheduleId == "") continue;

      const today = Temporal.Now.zonedDateTimeISO(tz).toPlainDate();
      const templateDate = today.add({ days: 2 + item.repeat });
      const date = new Date(templateDate.toString());
      date.setUTCHours(0, 0, 0, 0);

      const existing = await db
        .select()
        .from(scheduleDates)
        .where(
          and(
            eq(scheduleDates.schoolId, school.id),
            eq(scheduleDates.date, date),
          ),
        );

      if (existing.length == 0) {
        await db.insert(scheduleDates).values({
          schoolId: school.id,
          date: date,
          scheduleId: item.scheduleId,
        });
      }
    }
  }
}

async function sendNotifications() {
  const userList = await global.db.select().from(users);

  for (const user of userList) {
    const userApi = await api({ userId: user.id });
    if (!userApi) continue;
    if ((await userApi.catalyst.account.isPro()).data == false) continue;
    const { data: settings } = await userApi.catalyst.account.settings.list();
    if (settings.email_notifications == "true") {
      const jsonAlerts = JSON.parse(settings.submission_alerts ?? "[]") as {
        minutes: number;
        hours: number;
      }[];
      if (jsonAlerts.length == 0) continue;

      const { data: courseList } = await userApi.canvas.courses.list({
        limit: 500,
        offset: 0,
      });

      const alerts = jsonAlerts
        .map((alert) => alert.hours * 60 + alert.minutes)
        .map((m) => m * 60 * 1000)
        .map((ms) => [ms - 1 * 60 * 1000, ms + 4 * 60 * 1000])
        .map(
          ([start, end]) =>
            [
              Temporal.Now.instant().add({ milliseconds: start })
                .epochMilliseconds,
              Temporal.Now.instant().add({ milliseconds: end })
                .epochMilliseconds,
            ] as const,
        );

      const { data: todo } = await userApi.canvas.todo.mini({
        days: 2,
        useCache: false,
      });

      if (!todo) continue;

      // Get assignment overrides for additional checking
      const { assignmentOverrides } = await import("@/server/db/schema");
      const userOverrides = await global.db
        .select()
        .from(assignmentOverrides)
        .where(eq(assignmentOverrides.userId, user.id));

      const itemsToAlert = todo.filter((item) => {
        // Check for database assignment override with custom due date
        const dbOverride = userOverrides.find(
          (override) =>
            override.assignmentId === String(item.plannable.id) &&
            override.courseId ===
              String(item.course_id ?? item.plannable.course_id),
        );

        // Use override due date if available, otherwise use original
        const dueDate =
          dbOverride?.dueAt ??
          new Date(item.plannable.due_at ?? item.plannable_date ?? "");
        const itemTime = dueDate.getTime();

        const isInAlertWindow = alerts.some(
          ([start, end]) => itemTime >= start && itemTime <= end,
        );

        if (!isInAlertWindow) return false;

        // Check if assignment is already submitted or graded
        const isSubmitted =
          item.plannable.content_details?.submission?.workflow_state ===
            "submitted" ||
          item.plannable.content_details?.submission?.workflow_state ===
            "graded";

        // Check if assignment is marked complete via planner override
        const isMarkedComplete =
          item.planner_override?.marked_complete === true;

        // Check for database assignment override completion
        const isOverrideComplete = dbOverride?.markedComplete === true;

        // For on-paper assignments, only alert if not marked complete
        const isOnPaperAndNotComplete =
          item.plannable.content_details?.submission_types.includes(
            "on_paper",
          ) &&
          !isMarkedComplete &&
          !isOverrideComplete;

        // Alert if: not submitted AND not marked complete (via planner or database override) AND (not on-paper OR on-paper but not marked complete)
        return (
          !isSubmitted &&
          !isMarkedComplete &&
          !isOverrideComplete &&
          (!item.plannable.content_details?.submission_types.includes(
            "on_paper",
          ) ||
            isOnPaperAndNotComplete)
        );
      });

      if (itemsToAlert.length == 0) continue;

      await userApi.catalyst.account.email.send({
        subject: `${itemsToAlert.length} assignment${itemsToAlert.length > 1 ? "s" : ""} due soon!`,
        EmailContent: (
          <SubmissionAlertEmail
            assignmentsDue={itemsToAlert.map((item) => {
              // Get the database override for this item
              const dbOverride = userOverrides.find(
                (override) =>
                  override.assignmentId === String(item.plannable.id) &&
                  override.courseId ===
                    String(item.course_id ?? item.plannable.course_id),
              );

              // Use override due date if available, otherwise use original
              const dueDate =
                dbOverride?.dueAt ??
                new Date(item.plannable.due_at ?? item.plannable_date ?? "");

              return {
                name: item.plannable.title,
                courseLabel:
                  courseList.find((c) => c.id == item.course?.id)
                    ?.classification ?? "Unclassified",
                courseName:
                  item.course?.name ??
                  courseList.find((c) => c.id == item.course?.id)
                    ?.original_name ??
                  courseList.find((c) => c.id == item.course?.id)?.name ??
                  "Course Name",
                dueDate: dueDate.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "America/Chicago",
                }),
                dueIn: (() => {
                  const now = Temporal.Now.plainDateTimeISO("UTC");
                  const due = Temporal.PlainDateTime.from(
                    dueDate.toISOString().split("Z")[0]!,
                  );
                  const diff = due.since(now);

                  if (diff.days > 0) {
                    return `${diff.days} day${diff.days > 1 ? "s" : ""}${
                      diff.hours > 0
                        ? `, ${diff.hours} hr${diff.hours > 1 ? "s" : ""}`
                        : ""
                    }`;
                  } else if (diff.hours > 0) {
                    return `${diff.hours} hr${diff.hours > 1 ? "s" : ""}${
                      diff.minutes > 0
                        ? `, ${diff.minutes} min${diff.minutes > 1 ? "s" : ""}`
                        : ""
                    }`;
                  } else if (diff.minutes > 0) {
                    return `${diff.minutes} min${diff.minutes > 1 ? "s" : ""}`;
                  } else {
                    return "less than a minute";
                  }
                })(),
                url: `https://catalyst.bluefla.me/app/courses/${item.course?.id}/assignments/${item.plannable.id}`,
                submissionTypes:
                  item.plannable.content_details.submission_types,
              };
            })}
            name={settings.f_name ?? user.name?.split(" ")[0]}
          />
        ),
      });
    }
  }
}
