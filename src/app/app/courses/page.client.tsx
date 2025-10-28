"use client";

import { useContext } from "react";
import { CoursesContext } from "../layout.providers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, BookOpen } from "lucide-react";
import Link from "next/link";

export function CoursesClient() {
  const courses = useContext(CoursesContext);

  const getWorkflowBadge = (state: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "outline" | "destructive";
        label: string;
      }
    > = {
      available: { variant: "default", label: "Active" },
      completed: { variant: "secondary", label: "Completed" },
      unpublished: { variant: "outline", label: "Unpublished" },
    };
    return variants[state] ?? { variant: "outline", label: state };
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground mt-2">
          Browse and manage your enrolled courses
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const badge = getWorkflowBadge(course.workflow_state);
          const enrollment = course.enrollments?.[0];

          return (
            <Link href={`/app/courses/${course.id}`} key={course.id}>
              <Card className="group h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="group-hover:text-primary line-clamp-2 text-lg transition-colors">
                        {course.name}
                      </CardTitle>
                      <CardDescription className="mt-1.5">
                        {course.course_code}
                      </CardDescription>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {course.term && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{course.term.name}</span>
                    </div>
                  )}

                  {course.total_students > 0 && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{course.total_students} students</span>
                    </div>
                  )}

                  {enrollment?.role && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4" />
                      <span className="capitalize">
                        {enrollment.role == "StudentEnrollment"
                          ? "Student"
                          : enrollment.role}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="py-12 text-center">
          <BookOpen className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-2">
            You are not enrolled in any courses yet.
          </p>
        </div>
      )}
    </div>
  );
}
