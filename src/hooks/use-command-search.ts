"use client";

import { useState, useEffect, useMemo } from "react";
import type { Course } from "@/server/api/canvas/types";
import type { GradesResponse } from "@/server/api/canvas/courses/grades";
import type { SearchData, SearchResult } from "@/lib/command-search";
import { searchAll, getDefaultOptions } from "@/lib/command-search";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: { message: string }[];
}

interface UseCommandSearchResult {
  loading: boolean;
  error: string | null;
  results: SearchResult[];
  defaultOptions: SearchResult[];
  search: (query: string) => void;
}

export function useCommandSearch(): UseCommandSearchResult {
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Record<number, GradesResponse>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/courses/list");
        if (!response.ok) throw new Error("Failed to load courses");

        const data = (await response.json()) as ApiResponse<Course[]>;
        if (!data.success) throw new Error("Failed to load courses");

        const courseList = data.data ?? [];
        setCourses(courseList);

        // Load grades for each course
        const gradePromises = courseList.map(async (course: Course) => {
          try {
            const gradeResponse = await fetch(
              `/api/courses/${course.id}/grades`,
            );
            if (gradeResponse.ok) {
              const gradeData =
                (await gradeResponse.json()) as ApiResponse<GradesResponse>;
              if (gradeData.success && gradeData.data) {
                return { courseId: course.id, grades: gradeData.data };
              }
            }
          } catch (err) {
            console.warn(`Failed to load grades for course ${course.id}:`, err);
          }
          return null;
        });

        const gradeResults = await Promise.all(gradePromises);
        const gradesMap: Record<number, GradesResponse> = {};

        gradeResults.forEach((result) => {
          if (result) {
            gradesMap[result.courseId] = result.grades;
          }
        });

        setGrades(gradesMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    void loadCourses();
  }, []);

  const searchData: SearchData = useMemo(
    () => ({
      courses,
      grades,
    }),
    [courses, grades],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchAll(query, searchData);
  }, [query, searchData]);

  const defaultOptions = useMemo(() => {
    return getDefaultOptions(searchData);
  }, [searchData]);

  return {
    loading,
    error,
    results,
    defaultOptions,
    search: setQuery,
  };
}
