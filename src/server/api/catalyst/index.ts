"use server";

import { type ApiCtx } from "..";

export async function catalyst(ctx: ApiCtx) {
  return {
    realtime: await import("./realtime").then((mod) => mod.default(ctx)),
    schools: {
      members: await (await import("./schools/members")).default(ctx),
      find: await (await import("./schools/find")).default(ctx),
      get: await (await import("./schools/get")).default(ctx),
      getPermissions: await (
        await import("./schools/get-permissions")
      ).default(ctx),
      create: await (await import("./schools/create")).default(ctx),
      list: await (await import("./schools/list")).default(ctx),
      delete: await (await import("./schools/delete")).default(ctx),
      periods: {
        set: await (await import("./schools/periods/set")).default(ctx),
        list: await (await import("./schools/periods/list")).default(ctx),
      },
      schedules: {
        set: await (await import("./schools/schedules/set")).default(ctx),
        list: await (await import("./schools/schedules/list")).default(ctx),
        dates: {
          schedule: {
            list: await (
              await import("./schools/schedules/dates/schedule/list")
            ).default(ctx),
            set: await (
              await import("./schools/schedules/dates/schedule/set")
            ).default(ctx),
          },
          list: {
            list: await (
              await import("./schools/schedules/dates/list/list")
            ).default(ctx),
            set: await (
              await import("./schools/schedules/dates/list/set")
            ).default(ctx),
          },
        },
        details: await (
          await import("./schools/schedules/details")
        ).default(ctx),
        detailedList: await (
          await import("./schools/schedules/detailedList")
        ).default(ctx),
      },
    },
    account: {
      delete: await (await import("./account/delete")).default(ctx),
      sessions: {
        list: await (await import("./account/sessions/list")).default(ctx),
        revoke: await (await import("./account/sessions/revoke")).default(ctx),
      },
      settings: {
        set: await (await import("./account/settings/set")).default(ctx),
        get: await (await import("./account/settings/get")).default(ctx),
        setMany: await (
          await import("./account/settings/set-many")
        ).default(ctx),
        list: await (await import("./account/settings/list")).default(ctx),
        listPeriods: await (
          await import("./account/settings/list-periods")
        ).default(ctx),
        setPeriods: await (
          await import("./account/settings/set-periods")
        ).default(ctx),
      },
    },
    support: {
      feedback: {
        provide: await (
          await import("./support/feedback/provide")
        ).default(ctx),
      },
    },
    getCtx: async () => {
      return ctx;
    },
  };
}
