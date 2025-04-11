import { auth } from "@/server/auth";

import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { after, NextResponse } from "next/server";

export const POST = auth(async (req) => {
  const session = req.auth;
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      token: process.env.BLOB_TOKEN,
      onBeforeGenerateToken: async () => {
        if (!session?.user?.id) throw new Error("User not authenticated");

        return {
          tokenPayload: JSON.stringify({
            userId: session?.user?.id,
          }),
          maximumSizeInBytes: 500 * 1024 * 1024, // 500mb
          validUntil: Date.now() + 5 * 60 * 1000,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("blob upload completed", blob, tokenPayload);

        try {
        } catch (error) {
          throw new Error("Could not update user");
        }
      },
    });

    after(async () => {
      setTimeout(async () => {
        await del((jsonResponse as unknown as { url: string }).url, {
          token: process.env.BLOB_TOKEN,
        });
      }, 1000 * 60 * 5 /* 5m */);
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
});
