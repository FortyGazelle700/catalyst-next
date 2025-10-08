"use server";

import type { CanvasApiCtx } from "../..";
import type {
  Assignment,
  CanvasErrors,
  ExternalToolTagAttributes,
} from "../../types";

export type FrontPageInput = {
  courseId: number;
  assignmentId: number;
  useCache?: boolean;
};

export default async function getAssignment(ctx: CanvasApiCtx) {
  return async (input: FrontPageInput) => {
    const { unstable_cache } = await import("next/cache");
    const { and, eq } = await import("drizzle-orm");
    const { assignmentOverrides } = await import("@/server/db/schema");
    const assignment = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: undefined,
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }
      const url = new URL(
        `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}`,
        ctx.user.canvas.url,
      );
      url.searchParams.append("include[]", "submission");
      url.searchParams.append("include[]", "score_statistics");
      url.searchParams.append("locale", "en");
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as Assignment | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: undefined,
          errors: data.errors,
        };
      }
      if (data.submission_types.includes("external_tool")) {
        const externalURL = new URL(
          `/api/v1/courses/${input.courseId}/external_tools/sessionless_launch`,
          ctx.user.canvas.url,
        );
        externalURL.searchParams.append(
          "assignment_id",
          String(input.assignmentId),
        );
        externalURL.searchParams.append("launch_type", "assessment");
        externalURL.searchParams.append("locale", "en");
        const externalResponse = await fetch(externalURL, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        data.external_tool_tag_attributes =
          (await externalResponse.json()) as ExternalToolTagAttributes;
        let finalURL = data.external_tool_tag_attributes.url;
        {
          const puppeteer = await import("puppeteer");
          const browser = await puppeteer.launch({
            headless: "shell", // especially important in Nixpacks
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          });
          try {
            const page = await browser.newPage();
            const response = await page.goto(finalURL, {
              waitUntil: "networkidle2",
            });
            finalURL = response?.url() ?? finalURL;
          } catch (e) {
            console.error("Error retrieving final URL:", e);
          } finally {
            await browser.close();
          }
        }
        data.external_tool_tag_attributes.url = finalURL;
      }
      const additionalData = await ctx.db
        .select()
        .from(assignmentOverrides)
        .where(
          and(
            eq(assignmentOverrides.userId, ctx.user.get?.id ?? ""),
            eq(assignmentOverrides.assignmentId, String(input.assignmentId)),
            eq(assignmentOverrides.courseId, String(input.courseId)),
          ),
        );

      return {
        success: true,
        data: {
          ...data,
          data: {
            due_at: additionalData?.[0]?.dueAt?.toISOString() ?? data.due_at,
            duration: additionalData?.[0]?.duration ?? null,
            status: additionalData?.[0]?.status ?? null,
          },
        },
        errors: [],
      };
    };

    if (input?.useCache ?? true) {
      return await unstable_cache(
        assignment,
        [
          ctx.user.get?.id ?? "",
          [
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(","),
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:assignment`,
            `user_${ctx.user.get?.id}:course:assignment@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        },
      )();
    }
    return await assignment();
  };
}
