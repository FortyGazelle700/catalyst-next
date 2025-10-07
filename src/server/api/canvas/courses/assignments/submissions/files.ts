"use server";

import PostHogClient from "@/server/posthog";
import type { CanvasApiCtx } from "../../..";
import type { Submission } from "../../../types";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type FrontPageInput = {
  courseId: number;
  assignmentId: number;
  files: {
    url: string;
    file: File;
  }[];
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
        data.append("url", file.url);
        data.append("name", file.file.name);
        data.append("size", file.file.size.toString());
        data.append("content_type", file.file.type);

        const fileURL = new URL(
          `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions/self/files`,
          ctx.user.canvas.url,
        );
        fileURL.searchParams.append("locale", "en");
        const res = await fetch(fileURL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
          body: data,
        });
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
          uploadData.append("target_url", file.url);
          uploadData.append("filename", file.file.name);
          uploadData.append("content_type", file.file.type);
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
          const s3 = new S3Client({
            region: process.env.S3_REGION!,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: true,
          });
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET!,
              Key: file.file.name,
            }),
          );
        } catch (err) {
          console.error(err);
        }
      }
      const submitURL = new URL(
        `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions`,
        ctx.user.canvas.url,
      );
      submitURL.searchParams.append(
        "submission[submission_type]",
        "online_upload",
      );
      fileIds.forEach((id) =>
        submitURL.searchParams.append("submission[file_ids][]", String(id)),
      );
      submitURL.searchParams.append("locale", "en");
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
