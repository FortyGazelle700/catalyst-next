"use server";

import PostHogClient from "@/server/posthog";
import type { CanvasApiCtx } from "../../..";
import type { Submission } from "../../../types";

export type FrontPageInput = {
  courseId: number;
  assignmentId: number;
  body: string;
};

export default async function createTextSubmission(ctx: CanvasApiCtx) {
  return async (input: FrontPageInput) => {
    const posthog = PostHogClient();
    posthog.capture({
      distinctId: ctx.user.get?.id ?? "",
      event: "canvas_submission",
      properties: {
        submission_type: "text",
        course_id: input.courseId,
        assignment_id: input.assignmentId,
      },
    });
    const submit = async () => {
      const url = new URL(
        `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions`,
        ctx.user.canvas.url,
      );
      const data = new FormData();
      data.append("submission[submission_type]", "online_text_entry");
      data.append("submission[body]", input.body);
      const query = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
        body: data,
      });
      const submission = (await query.json()) as Submission;

      return {
        success: true,
        data: submission,
        errors: [],
      };
    };

    return await submit();
  };
}
