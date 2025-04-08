import { Metadata } from "next";
import SettingsClientRenderer from "./page.client";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function InboxPage() {
  return (
    <>
      <SettingsClientRenderer />
    </>
  );
}
