import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const ParamsSchema = z.object({
  course: z.string().optional(),
  assignment: z.string().optional(),
});

export const POST = auth(async (req, ctx) => {
  const paramsParseResult = ParamsSchema.safeParse(await ctx.params);
  if (!paramsParseResult.success) {
    console.error(paramsParseResult.error);
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }
  const { course, assignment } = paramsParseResult.data;

  const s3 = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  });

  const formData: { files: File[] } = { files: [] };

  console.log("server submit files", formData);

  for (const [key, value] of (await req.formData()).entries() as unknown as [
    string,
    FormDataEntryValue,
  ][]) {
    if (key === "files") {
      const file = value as File;
      formData.files.push(file);
    }
  }

  const fileURLS: string[] = [];
  const uploadedFiles: { key: string; presignedUrl: string }[] = [];

  for (const file of formData.files) {
    const fileId = `${randomUUID()}.${file.name.split(".").pop() ?? "png"}`;

    try {
      // Convert to Uint8Array instead of Buffer for better compatibility
      const fileBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(fileBuffer);

      // Upload to S3
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: fileId,
          Body: fileData,
          ContentType: file.type,
          ContentLength: file.size,
        }),
      );

      // Generate presigned URL for the uploaded file
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: fileId,
      });

      const presignedUrl = await getSignedUrl(s3, getObjectCommand, {
        expiresIn: 3600, // URL expires in 1 hour
      });

      uploadedFiles.push({
        key: fileId,
        presignedUrl: presignedUrl,
      });

      fileURLS.push(presignedUrl);
    } catch (error) {
      console.error("S3 upload failed:", error);
      return Response.json({ error: "File upload failed" }, { status: 500 });
    }
  }

  if (!Array.isArray(fileURLS) || fileURLS.length === 0) {
    return Response.json({ error: "No files uploaded" }, { status: 400 });
  }

  // Create File objects from presigned URLs for submission
  const files = await Promise.all(
    fileURLS.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const blob = await response.blob();
        const filename = url.split("/").pop()?.split("?")[0] ?? "file";
        const file = new File([blob], filename, {
          type: blob.type,
        });
        return { url, file };
      } catch (error) {
        console.error("Error fetching file from presigned URL:", error);
        throw error;
      }
    }),
  );

  try {
    const response = await (
      await api({
        session: req.auth,
      })
    ).canvas.courses.assignments.submissions.submit.files({
      courseId: Number(course),
      assignmentId: Number(assignment),
      files: files,
    });

    return Response.json(
      {
        ...response,
        uploadedFiles: uploadedFiles, // Include file info with presigned URLs
      },
      {
        status: response.success ? 200 : 400,
      },
    );
  } catch (error) {
    console.error("Canvas submission failed:", error);
    return Response.json({ error: "Submission failed" }, { status: 500 });
  }
});

export async function createPresignedUploadUrl(
  bucketName: string,
  objectKey: string,
  contentType: string,
  expiresIn = 3600,
) {
  const s3 = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: contentType,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error creating presigned upload URL:", error);
    throw error;
  }
}

// Generate presigned URL for downloads
export async function createPresignedDownloadUrl(
  bucketName: string,
  objectKey: string,
  expiresIn = 3600,
) {
  const s3 = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  });

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error creating presigned download URL:", error);
    throw error;
  }
}
