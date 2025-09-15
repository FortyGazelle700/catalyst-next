"use server";

import { type ApiCtx } from "@/server/api";

export default async function sendEmail(ctx: ApiCtx) {
  return async ({
    subject,
    EmailContent,
  }: {
    subject: string;
    EmailContent: React.JSX.Element;
  }) => {
    const nodemailer = await import("nodemailer");
    const { render } = await import("@react-email/components");

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST ?? "",
      port: Number(process.env.MAIL_PORT ?? "587"),
      secure: false,
      auth: {
        user: process.env.MAIL_USER ?? "",
        pass: process.env.MAIL_PASS ?? "",
      },
    });

    await transporter.sendMail({
      from: `Catalyst <${process.env.MAIL_FROM ?? ""}>`,
      to: ctx?.user.get?.email ?? "",
      subject: subject,
      html: await render(EmailContent),
    });

    transporter.close();

    return async () => {
      return {
        success: true,
        data: ctx.user.isPro ?? false,
        errors: [] as {
          message: string;
        }[],
      };
    };
  };
}
