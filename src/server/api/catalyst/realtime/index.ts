import type { ApiCtx } from "../..";

export default async function realtime(ctx: ApiCtx) {
  const Pusher = (await import("pusher")).default;
  const crypto = (await import("crypto")).default;

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ?? "",
    key: process.env.PUSHER_APP_KEY ?? "",
    host: process.env.NEXT_PUBLIC_PUSHER_HOST ?? "",
    secret: process.env.PUSHER_APP_KEY_SECRET ?? "",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
  });

  function encrypt(plaintext: string) {
    const key = crypto
      .createHash("sha256")
      .update(String(ctx.user.get!.realtimeSecret!))
      .digest();
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return {
      ciphertext: encrypted.toString("base64"),
      iv: iv.toString("base64"),
      tag: tag.toString("base64"),
    };
  }

  return {
    socket: async () => {
      return {
        success: true,
        data: pusher,
        errors: [],
      };
    },
    encrypt: (plaintext: string) => encrypt(plaintext),
    sendToUser: async (
      userId: string,
      event: string,
      data: Record<string, unknown> | string,
    ) => {
      await pusher.sendToUser(userId, event, JSON.stringify(data));
      return { success: true, data: data, errors: [] };
    },
    sendToUserEncrypted: async (
      userId: string,
      event: string,
      plaintext: Record<string, unknown> | string,
    ) => {
      const encrypted = encrypt(JSON.stringify(plaintext));
      await pusher.sendToUser(userId, event, encrypted);
      return { success: true, data: encrypted, errors: [] };
    },
  };
}
