"use server";

import { type ApiCtx } from "@/server/api";
import type { User } from "./types";

export type CanvasApiCtx = ApiCtx & {
  user: {
    canvas: {
      id: number;
      data: User;
      url: string;
      token: string;
    };
  };
};

export async function canvas($ctx: ApiCtx) {
  const ctx = await genCtx($ctx);

  return {
    courses: {
      list: await (await import("./courses/list")).default(ctx),
      listWithPeriodData: await (
        await import("./courses/list-with-period-data")
      ).default(ctx),
      getWithSchedule: await (
        await import("./courses/get-with-schedule")
      ).default(ctx),
      externalTools: {
        retrieve: await (
          await import("./courses/external-tools/retrieve")
        ).default(ctx),
      },
      sidebar: await (await import("./courses/sidebar")).default(ctx),
      syllabus: await (await import("./courses/syllabus")).default(ctx),
      frontPage: await (await import("./courses/front-page")).default(ctx),
      people: await (await import("./courses/people")).default(ctx),
      page: await (await import("./courses/page")).default(ctx),
      assignments: {
        get: await (await import("./courses/assignments/get")).default(ctx),
        submissions: {
          submit: {
            files: await (
              await import("./courses/assignments/submissions/files")
            ).default(ctx),
            text: await (
              await import("./courses/assignments/submissions/text")
            ).default(ctx),
            url: await (
              await import("./courses/assignments/submissions/url")
            ).default(ctx),
          },
        },
      },
      grades: await (await import("./courses/grades")).default(ctx),
      modules: {
        list: await (await import("./courses/modules/list")).default(ctx),
        get: await (await import("./courses/modules/get")).default(ctx),
      },
    },
    chats: {
      inbox: {
        get: await (await import("./chats/inbox/get")).default(ctx),
        list: await (await import("./chats/inbox/list")).default(ctx),
        reply: await (await import("./chats/inbox/reply")).default(ctx),
        compose: await (await import("./chats/inbox/compose")).default(ctx),
      },
      list: await (await import("./chats/list")).default(ctx),
    },
    todo: {
      mini: await (await import("./todo/mini")).default(ctx),
      markComplete: await (await import("./todo/mark-completed")).default(ctx),
      getNote: await (await import("./todo/get-note")).default(ctx),
      create: await (await import("./todo/create")).default(ctx),
      delete: await (await import("./todo/delete")).default(ctx),
      edit: await (await import("./todo/edit")).default(ctx),
      list: await (await import("./todo/list")).default(ctx),
    },
    getCtx: async () => ctx,
    verifyToken: await (await import("./verify-token")).default(ctx),
  };
}

async function genCtx(ctx: ApiCtx): Promise<CanvasApiCtx> {
  if (!ctx?.user) {
    throw new Error("User context is required for Canvas API");
  }

  const { schools } = await import("@/server/db/schema");
  const { eq } = await import("drizzle-orm");
  const { createDecipheriv } = await import("crypto");

  const db = ctx.db;

  const schoolId = ctx.user.settings.school_id ?? "";

  const school = schoolId
    ? (
        await db
          .select({ canvasURL: schools.canvasURL })
          .from(schools)
          .where(eq(schools.id, schoolId ?? ""))
      ).at(0)
    : undefined;

  let token;

  const encryptedToken = ctx.user.settings.canvas_token ?? "";

  if (!encryptedToken || !school?.canvasURL) {
    return {
      ...ctx,
      user: {
        ...ctx.user,
        canvas: {
          id: -1,
          data: {} as User,
          url: "",
          token: token ?? "",
        },
      },
    } as CanvasApiCtx;
  }

  const key = process.env.AUTH_SECRET?.substring(0, 32) ?? "";
  const iv = process.env.AUTH_SECRET?.substring(33, 33 + 16) ?? "";

  if (key?.length != 32)
    throw new Error(`Invalid key length. Expected 32, but got ${key?.length}`);
  if (iv?.length != 16)
    throw new Error(`Invalid IV length. Expected 16, but got ${iv?.length}`);

  try {
    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key, "utf8"),
      Buffer.from(iv, "utf8"),
    );
    token =
      decipher.update(encryptedToken, "base64", "utf8") +
      decipher.final("utf8");
  } catch (err) {
    console.error("Failed to decrypt Canvas token:", err);
    token = "";
  }

  const url = new URL("/api/v1/users/self", school?.canvasURL ?? "");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = (await response.json()) as User;
  const canvasId = data?.id;

  return {
    ...ctx,
    user: {
      ...ctx.user,
      canvas: {
        id: canvasId ?? -1,
        data: data,
        url: school?.canvasURL ?? "",
        token: token ?? "",
      },
    },
  } as CanvasApiCtx;
}
