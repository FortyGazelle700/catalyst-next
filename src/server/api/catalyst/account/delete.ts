import { sql } from "drizzle-orm";
import { type ApiCtx } from "../..";
import { scheduleValues } from "@/server/db/schema";

export default async function list(ctx: ApiCtx) {
  return async () => {
    if (!ctx.user.get?.id) {
      throw new Error("User not found");
    }

    const {
      accounts,
      chats,
      chatMessages,
      feedback,
      notifications,
      periods,
      periodTimes,
      schedules,
      scheduleDates,
      schools,
      schoolPermissions,
      sessions,
      settings,
      users,
      userRelationships,
    } = await import("@/server/db/schema");
    const { or, eq } = await import("drizzle-orm");

    const userId = ctx.user.get.id;
    const perms = await ctx.db
      .select()
      .from(schoolPermissions)
      .where(eq(schoolPermissions.userId, userId));
    for (const perm of perms) {
      if (perm.role == "owner") {
        const permsForSchool = await ctx.db
          .select()
          .from(schoolPermissions)
          .where(eq(schoolPermissions.schoolId, perm.schoolId));
        if (permsForSchool.length == 1 || permsForSchool.length == 0) {
          await ctx.db.delete(schools).where(eq(schools.id, perm.schoolId));
          await ctx.db
            .delete(periods)
            .where(eq(periods.schoolId, perm.schoolId));
          await ctx.db
            .delete(periodTimes)
            .where(eq(periodTimes.schoolId, perm.schoolId));
          await ctx.db
            .delete(schedules)
            .where(eq(schedules.schoolId, perm.schoolId));
          await ctx.db
            .delete(scheduleDates)
            .where(eq(scheduleDates.schoolId, perm.schoolId));
        } else {
          await ctx.db
            .update(schoolPermissions)
            .set({ role: "owner" })
            .where(eq(schoolPermissions.id, permsForSchool[0]!.id));
        }
      }
    }
    await ctx.db.transaction(async (trx) => {
      await trx.delete(accounts).where(eq(accounts.userId, userId));
      await trx
        .update(chats)
        .set({
          members: sql`
            (
              SELECT jsonb_agg(elem)
              FROM jsonb_array_elements(${chats.members}) AS elem
              WHERE elem->>'userId' != ${userId}
            )
          `,
        })
        .where(
          sql`${chats.members} @> ${sql.raw(`'[{"userId": "${userId}"}]'::jsonb`)}`,
        );
      await trx.delete(chatMessages).where(eq(chatMessages.userId, userId));
      await trx.delete(feedback).where(eq(feedback.userId, userId));
      await trx.delete(notifications).where(eq(notifications.userId, userId));
      await trx
        .delete(schoolPermissions)
        .where(eq(schoolPermissions.userId, userId));
      await trx.delete(scheduleValues).where(eq(scheduleValues.userId, userId));
      await trx.delete(sessions).where(eq(sessions.userId, userId));
      await trx.delete(settings).where(eq(settings.userId, userId));
      await trx.delete(users).where(eq(users.id, userId));
      await trx
        .delete(userRelationships)
        .where(
          or(
            eq(userRelationships.userId, userId),
            eq(userRelationships.relatedUserId, userId),
          ),
        );
    });

    return {
      success: true,
      data: userId,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
