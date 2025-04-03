"use server";

import { ApiCtx } from "..";

export async function catalyst(ctx: ApiCtx) {
  return {
    schools: {
      list: await (await import("./schools/list")).default(ctx),
      periods: {
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
        provide: await (await import("./support/feedback/provide")).default(ctx),
      }
    }
  };
}
