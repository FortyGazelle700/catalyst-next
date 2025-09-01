import { type Metadata } from "next";
import SettingsClientRenderer from "./page.client";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function InboxPage() {
  return (
    <div className="h-full flex-1 overflow-hidden">
      <SettingsClientRenderer />
    </div>
  );
}
