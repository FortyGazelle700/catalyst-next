import { Temporal } from "@js-temporal/polyfill";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  periodTimes,
  schools,
  scheduleDates,
  scheduleDatesSchedule,
} from "@/server/db/schema";
import { and, eq, lt } from "drizzle-orm";

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
  const dayOfWeek = Temporal.Now.zonedDateTimeISO("America/New_York").dayOfWeek;
  const hour = Temporal.Now.zonedDateTimeISO("America/New_York").hour;
  const offset = dstOffset();
  if (dayOfWeek == 7 && offset != 0 && hour == 4) {
    await makeScheduleChanges(offset);
  }
  if (hour == 4 && dayOfWeek == 6) {
    await makeScheduledScheduleDaysHappen();
  }
  return new Response("Success!");
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

  await db
    .delete(scheduleDates)
    .where(
      lt(scheduleDates.date, new Date(Temporal.Now.plainDateISO().toString())),
    );

  const schoolsToUpdate = await db.select().from(schools);

  for (const school of schoolsToUpdate) {
    const schedule = await db
      .select()
      .from(scheduleDatesSchedule)
      .where(eq(scheduleDatesSchedule.schoolId, school.id));

    for (const item of schedule) {
      if (item?.scheduleId == "") continue;

      const templateDate = Temporal.PlainDate.from(
        Temporal.Now.plainDateISO(),
      ).add({ days: 3 + item.repeat });
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
