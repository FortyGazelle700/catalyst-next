import WelcomeEmail from "@/emails/welcome";
import { api } from "@/server/api";

export async function GET() {
  await (
    await api({
      userEmail: "dsemchyshyn@bluevalleyk12.net",
    })
  ).catalyst.account.email.send({
    subject: "Welcome to Catalyst - Your Journey Begins Here!",
    EmailContent: <WelcomeEmail name="Drake" />,
  });

  return new Response("Sending!");
}
