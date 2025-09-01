import { type Metadata } from "next";
import NowClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Now",
};

export default function NowPage() {
  return <NowClientPage />;
}
