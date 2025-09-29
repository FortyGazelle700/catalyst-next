import { api } from "@/server/api";
import { redirect } from "next/navigation";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ course: string; quiz: string }>;
}) {
  const ctx = await (await api({})).canvas.getCtx();

  redirect(
    new URL(
      `/courses/${(await params).course}/quizzes/${(await params).quiz}/take`,
      ctx.user.canvas.url,
    ).toString(),
  );
}
