"use server";

import PostHogClient from "@/server/posthog";
import type { CanvasApiCtx } from "../../..";
import type { CanvasErrors, Submission } from "../../../types";

export type FrontPageInput = {
  courseId: number;
  assignmentId: number;
  files: File[];
};

export default async function createFileSubmission(ctx: CanvasApiCtx) {
  return async (input: FrontPageInput) => {
    const posthog = PostHogClient();
    posthog.capture({
      distinctId: ctx.user.get?.id ?? "",
      event: "canvas_submission",
      properties: {
        submission_type: "file",
        course_id: input.courseId,
        assignment_id: input.assignmentId,
      },
    });
    const submit = async () => {
      const { del, put } = await import("@vercel/blob");
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
      const fileIds: number[] = [];
      for (const file of input.files) {
        const data = new FormData();
        const blob = await put(`uploads/${file.name}`, file, {
          access: "public",
          token: process.env.BLOB_TOKEN,
        });
        data.append("url", blob.url);
        data.append("name", file.name);
        data.append("size", file.size.toString());
        data.append("content_type", file.type);

        const res = await fetch(
          new URL(
            `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions/self/files`,
            ctx.user.canvas.url
          ),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
            },
            body: data,
          }
        );
        if (!res.ok) {
          // console.error(
          //   "Error Uploading to Assignment",
          //   res.status,
          //   res.statusText,
          //   await res.json()
          // );
          return {
            success: false,
            data: undefined,
            errors: [
              {
                message: "Error marking file for submission",
              },
            ],
          };
        }
        const response = (await res.json()) as
          | {
              upload_url: string;
              upload_params: Record<string, string>;
              id: undefined;
            }
          | { upload_url: undefined; id: number };
        if (response?.upload_url) {
          const uploadData = new FormData();
          uploadData.append("target_url", blob.url);
          uploadData.append("filename", file.name);
          uploadData.append("content_type", file.type);
          const upload = await fetch(response.upload_url, {
            method: "POST",
            body: uploadData,
          });
          if (!upload.ok)
            return {
              success: false,
              data: undefined,
              errors: [
                {
                  message: "Error uploading file",
                },
              ],
            };
          const uploadResponse = (await upload.json()) as {
            id: number;
          };
          fileIds.push(uploadResponse?.id);
        } else {
          fileIds.push(response?.id ?? 0);
        }
        try {
          await del(blob.url);
        } catch (err) {
          console.error(err);
        }
      }
      const submitURL = new URL(
        `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions`,
        ctx.user.canvas.url
      );
      submitURL.searchParams.append(
        "submission[submission_type]",
        "online_upload"
      );
      fileIds.forEach((id) =>
        submitURL.searchParams.append("submission[file_ids][]", String(id))
      );
      const response = await fetch(submitURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          data: undefined,
          errors: [
            {
              message: "Error submitting assignment",
            },
          ],
        };
      }

      const submission = (await response.json()) as Submission;
      return {
        success: true,
        data: submission,
        errors: [],
      };
    };

    return await submit();
  };
}
