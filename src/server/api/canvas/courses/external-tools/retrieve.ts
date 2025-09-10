"use server";

import type { CanvasApiCtx } from "../..";
import type { CanvasErrors, ContextExternalTool } from "../../types";

export type FrontPageInput = {
  courseId: number;
  externalURL: URL | string;
};

export default async function getAssignment(ctx: CanvasApiCtx) {
  return async (input: FrontPageInput) => {
    const externalTool = async () => {
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
        `/api/v1/courses/${input.courseId}/external_tools/sessionless_launch`,
        ctx.user.canvas.url,
      );
      url.searchParams.append("url", String(input.externalURL));
      // url.searchParams.append("launch_type", "assessment");
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as ContextExternalTool | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: undefined,
          errors: data.errors,
        };
      }
      let finalURL = data.url;
      {
        const puppeteer = await import("puppeteer");
        const browser = await puppeteer.launch({ headless: true });
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
      return {
        success: true,
        data: finalURL ? { url: finalURL } : undefined,
        errors: [],
      };
    };

    return await externalTool();
  };
}
