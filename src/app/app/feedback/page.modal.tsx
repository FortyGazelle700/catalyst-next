"use client";

import { api } from "@/server/api";
import { FeedbackRenderer } from "./client.page";

export default function FeedbackModalPage({ email }: { email: string }) {
  return <FeedbackRenderer email={email} />;
}
