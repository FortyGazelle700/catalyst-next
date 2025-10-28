import type { Metadata } from "next";
import { CoursesClient } from "./page.client";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore the available courses",
};

export default function CoursePage() {
  return <CoursesClient />;
}
