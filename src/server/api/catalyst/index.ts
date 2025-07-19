"use server";

import { type ApiCtx } from "..";

export async function catalyst(ctx: ApiCtx) {
  return {
    schools: {
      find: await (await import("./schools/find")).default(ctx),
      get: await (await import("./schools/get")).default(ctx),
      create: await (await import("./schools/create")).default(ctx),
      list: await (await import("./schools/list")).default(ctx),
      delete: await (await import("./schools/delete")).default(ctx),
      periods: {
        set: await (await import("./schools/periods/set")).default(ctx),
        list: await (await import("./schools/periods/list")).default(ctx),
      },
    },
    settings: {
      set: await (await import("./settings/set")).default(ctx),
      setMany: await (await import("./settings/set-many")).default(ctx),
      list: await (await import("./settings/list")).default(ctx),
      setPeriods: await (await import("./settings/set-periods")).default(ctx),
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
