"use client";

import { toast } from "sonner";
import { useRealtime } from "./layout.providers";
import { useEffect, useState } from "react";
import type Pusher from "pusher-js";

async function deriveKey(secretString: string) {
  const enc = new TextEncoder().encode(secretString);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

async function decryptAES(
  ciphertextB64: string,
  ivB64: string,
  tagB64: string,
  secretString: string,
) {
  const ciphertext = Uint8Array.from(atob(ciphertextB64), (c) =>
    c.charCodeAt(0),
  );
  const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
  const tag = Uint8Array.from(atob(tagB64), (c) => c.charCodeAt(0));

  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);

  const key = await deriveKey(secretString);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    combined,
  );

  return new TextDecoder().decode(plaintext);
}

function manageRealtime(
  realtime: Pusher | null,
  channelId: string,
  realtimeSecret: string,
) {
  if (!realtime || !channelId || !realtimeSecret) {
    return () => {
      /**/
    };
  }

  realtime.bind(
    "notification",
    async (data: { ciphertext: string; iv: string; tag: string }) => {
      try {
        const plaintext = await decryptAES(
          data.ciphertext,
          data.iv,
          data.tag,
          realtimeSecret,
        );
        const message = JSON.parse(plaintext) as { message: string };
        console.info("Decrypted notification:", message);
      } catch (e) {
        console.error("Decryption failed", e);
      }
    },
  );

  return () => {
    if (realtime) {
      realtime.disconnect();
    }
  };
}

export default function RealtimeManager() {
  const realtime = useRealtime();

  const [channelId, setChannelId] = useState("");
  const [realtimeSecret, setRealtimeSecret] = useState("");

  useEffect(() => {
    (async () => {
      const req = await fetch("/api/catalyst/realtime");
      if (!req.ok) {
        toast.error("Failed to fetch realtime channel information.");
        return;
      }
      const data = (await req.json()) as {
        success: boolean;
        data: { channelId: string; realtimeSecret: string };
        errors: { message: string }[];
      };
      if (!data.success) {
        toast.error("Failed to fetch realtime channel information.");
        return;
      }
      setChannelId(data.data.channelId);
      setRealtimeSecret(data.data.realtimeSecret);
    })().catch(console.error);
  });

  useEffect(() => {
    return manageRealtime(realtime, channelId, realtimeSecret);
  }, [realtime, channelId, realtimeSecret]);

  return null;
}
