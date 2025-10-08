import Fuse from "fuse.js";
import type { Course } from "@/server/api/canvas/types";
import type { GradesResponse } from "@/server/api/canvas/courses/grades";

export interface SearchResult {
  id: string;
  type: "course" | "assignment" | "page" | "event" | "navigation";
  title: string;
  subtitle: string;
  url: string;
  icon: string;
  metadata?: {
    course?: Course;
    assignment?: GradesResponse["assignments"][0];
    points?: string;
    dueDate?: string;
    classification?: string;
    pageUrl?: string;
  };
}

export interface SearchData {
  courses: Course[];
  grades: Record<number, GradesResponse>;
  pages?: Array<{
    id: string;
    title: string;
    url: string;
    courseId?: number;
    body?: string;
  }>;
  sidebarLinks?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    url: string;
    icon?: string;
    courseId?: number;
  }>;
}

export interface SearchableItem {
  id: string;
  type: "course" | "assignment" | "page" | "navigation";
  title: string;
  subtitle: string;
  content: string;
  url: string;
  icon: string;
  metadata?: SearchResult["metadata"];
}

// Fuse.js configuration for optimal search results
const fuseOptions = {
  keys: [
    { name: "title", weight: 0.7 },
    { name: "content", weight: 0.3 },
    { name: "subtitle", weight: 0.2 },
  ],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true,
};

function createSearchableItems(data: SearchData): SearchableItem[] {
  const items: SearchableItem[] = [];

  // Add navigation items first for better search priority
  const navigationItems = [
    {
      id: "nav-dashboard",
      type: "navigation" as const,
      title: "Dashboard",
      subtitle: "Overview and quick access",
      content: "dashboard home overview main page",
      url: "/app",
      icon: "LayoutDashboard",
    },
    {
      id: "nav-social",
      type: "navigation" as const,
      title: "Social",
      subtitle: "Messages and conversations",
      content: "social messages conversations chat inbox",
      url: "/app/social",
      icon: "MessageCircle",
    },
    {
      id: "nav-schools",
      type: "navigation" as const,
      title: "Schools",
      subtitle: "School information and settings",
      content: "schools school information settings",
      url: "/app/schools",
      icon: "Building2",
    },
    {
      id: "nav-schedule",
      type: "navigation" as const,
      title: "Schedule",
      subtitle: "View your class schedule",
      content: "schedule classes timetable calendar periods",
      url: "/app/schedule",
      icon: "Calendar",
    },
    {
      id: "nav-schedule-now",
      type: "navigation" as const,
      title: "Jump to Now",
      subtitle: "Current schedule and period",
      content: "schedule now current period today class",
      url: "/app/schedule/now",
      icon: "Clock",
    },
    {
      id: "nav-settings",
      type: "navigation" as const,
      title: "Settings",
      subtitle: "Account and app preferences",
      content: "settings preferences account profile configuration",
      url: "/app/settings",
      icon: "Settings",
    },
  ];

  items.push(...navigationItems);

  // Add sidebar links
  if (data.sidebarLinks) {
    data.sidebarLinks.forEach((link) => {
      const course = link.courseId
        ? data.courses.find((c) => c.id === link.courseId)
        : undefined;
      items.push({
        id: `sidebar-${link.id}`,
        type: "navigation",
        title: link.title,
        subtitle:
          link.subtitle ??
          (course
            ? `${course.classification ?? ""} — ${course.name}`
            : "Sidebar Link"),
        content: `${link.title} ${link.subtitle ?? ""} sidebar ${course?.name ?? ""}`,
        url: link.url,
        icon: link.icon ?? "Sidebar",
        metadata: {
          course,
          classification: course?.classification,
        },
      });
    });
  }
  // Add courses
  data.courses.forEach((course) => {
    const classification = course.classification
      ? ` ${course.classification}`
      : "";
    items.push({
      id: `course-${course.id}`,
      type: "course",
      title: `${course.classification ?? "No Classification"} — ${course.name}`,
      subtitle: `${course.course_code}${classification}`,
      content: `${course.name} ${course.course_code} ${course.classification ?? ""} course`,
      url: `/app/courses/${course.id}`,
      icon: "BookOpen",
      metadata: {
        course,
        classification: course.classification,
      },
    });
  });

  // Add assignments
  Object.entries(data.grades).forEach(([courseIdStr, gradeData]) => {
    const courseId = parseInt(courseIdStr);
    const course = data.courses.find((c) => c.id === courseId);

    if (!course || !gradeData?.assignments) return;

    gradeData.assignments.forEach((assignment) => {
      // Add assignment
      const dueDate = assignment.due_at
        ? new Date(assignment.due_at).toLocaleDateString()
        : "";
      items.push({
        id: `assignment-${assignment.id}`,
        type: "assignment",
        title: assignment.name,
        subtitle: `${course.classification} — ${course.name} • ${assignment.points_possible ?? 0} pts${dueDate ? ` • Due ${dueDate}` : ""}`,
        content: `${assignment.name} ${assignment.description ?? ""} assignment ${course.name}`,
        url: `/app/courses/${courseId}/assignments/${assignment.id}`,
        icon: "FileText",
        metadata: {
          course,
          assignment,
          points: assignment.points_possible?.toString(),
          dueDate: assignment.due_at ?? undefined,
          classification: course.classification,
        },
      });
    });
  });

  // Add pages
  if (data.pages) {
    data.pages.forEach((page) => {
      const course = page.courseId
        ? data.courses.find((c) => c.id === page.courseId)
        : undefined;
      const pageContent = page.body
        ? page.body.replace(/<[^>]*>/g, " ").substring(0, 200)
        : "";

      items.push({
        id: `page-${page.id}`,
        type: "page",
        title: page.title,
        subtitle: course
          ? `${course.classification} — ${course.name}`
          : "Site Page",
        content: `${page.title} ${pageContent} page ${course?.name ?? ""}`,
        url: page.url,
        icon: "FileText",
        metadata: {
          course,
          classification: course?.classification,
          pageUrl: page.url,
        },
      });
    });
  }

  return items;
}

export function searchAll(query: string, data: SearchData): SearchResult[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery || trimmedQuery.length < 2) return [];

  const searchableItems = createSearchableItems(data);
  const fuse = new Fuse(searchableItems, fuseOptions);

  const results = fuse.search(trimmedQuery);

  return results
    .map((result) => ({
      ...result.item,
      type: result.item.type as SearchResult["type"],
    }))
    .slice(0, 20);
}

export function getDefaultOptions(data: SearchData): SearchResult[] {
  const defaultOptions: SearchResult[] = [];

  // Add quick navigation links
  const quickLinks: SearchResult[] = [
    {
      id: "nav-dashboard",
      type: "navigation",
      title: "Dashboard",
      subtitle: "Overview and quick access",
      url: "/app",
      icon: "LayoutDashboard",
    },
    {
      id: "nav-social",
      type: "navigation",
      title: "Social",
      subtitle: "Messages and conversations",
      url: "/app/social",
      icon: "MessageCircle",
    },
    {
      id: "nav-schools",
      type: "navigation",
      title: "Schools",
      subtitle: "School information and settings",
      url: "/app/schools",
      icon: "Building2",
    },
    {
      id: "nav-schedule",
      type: "navigation",
      title: "Schedule",
      subtitle: "View your class schedule",
      url: "/app/schedule",
      icon: "Calendar",
    },
    {
      id: "nav-schedule-now",
      type: "navigation",
      title: "Schedule Now",
      subtitle: "Current schedule and period",
      url: "/app/schedule",
      icon: "Clock",
    },
    {
      id: "nav-settings",
      type: "navigation",
      title: "Settings",
      subtitle: "Account and app preferences",
      url: "/app/settings",
      icon: "Settings",
    },
  ];

  defaultOptions.push(...quickLinks);

  // Add sidebar links (up to 6)
  if (data.sidebarLinks) {
    data.sidebarLinks.slice(0, 6).forEach((link) => {
      const course = link.courseId
        ? data.courses.find((c) => c.id === link.courseId)
        : undefined;
      defaultOptions.push({
        id: `default-sidebar-${link.id}`,
        type: "navigation",
        title: link.title,
        subtitle:
          link.subtitle ??
          (course ? `${course.name} • Sidebar` : "Sidebar Link"),
        url: link.url,
        icon: link.icon ?? "Sidebar",
        metadata: {
          course,
          classification: course?.classification,
        },
      });
    });
  }
  // Add recent courses (up to 6)
  data.courses.slice(0, 6).forEach((course) => {
    const classification = course.classification
      ? ` • ${course.classification}`
      : "";
    defaultOptions.push({
      id: `default-course-${course.id}`,
      type: "course",
      title: course.name,
      subtitle: `${course.course_code}${classification}`,
      url: `/app/courses/${course.id}`,
      icon: "BookOpen",
      metadata: {
        course,
        classification: course.classification,
      },
    });
  });

  // Add upcoming assignments (due within 7 days)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcomingAssignments: SearchResult[] = [];

  Object.entries(data.grades).forEach(([courseIdStr, gradeData]) => {
    const courseId = parseInt(courseIdStr);
    const course = data.courses.find((c) => c.id === courseId);

    if (!course || !gradeData?.assignments) return;

    gradeData.assignments.forEach((assignment) => {
      if (assignment.due_at) {
        const dueDate = new Date(assignment.due_at);
        if (dueDate > now && dueDate <= nextWeek) {
          upcomingAssignments.push({
            id: `upcoming-${assignment.id}`,
            type: "event",
            title: assignment.name,
            subtitle: `Due ${dueDate.toLocaleDateString()} • ${course.name}`,
            url: `/app/courses/${courseId}/assignments/${assignment.id}`,
            icon: "Calendar",
            metadata: {
              course,
              assignment,
              dueDate: assignment.due_at,
              classification: course.classification,
            },
          });
        }
      }
    });
  });

  // Sort upcoming assignments by due date
  upcomingAssignments.sort((a, b) => {
    const dateA = a.metadata?.dueDate
      ? new Date(a.metadata.dueDate)
      : new Date();
    const dateB = b.metadata?.dueDate
      ? new Date(b.metadata.dueDate)
      : new Date();
    return dateA.getTime() - dateB.getTime();
  });

  // Add up to 4 upcoming assignments
  defaultOptions.push(...upcomingAssignments.slice(0, 4));

  // Add recent pages (up to 3)
  if (data.pages) {
    data.pages.slice(0, 3).forEach((page) => {
      const course = page.courseId
        ? data.courses.find((c) => c.id === page.courseId)
        : undefined;
      defaultOptions.push({
        id: `default-page-${page.id}`,
        type: "page",
        title: page.title,
        subtitle: course ? `${course.name} • Page` : "Site Page",
        url: page.url,
        icon: "FileText",
        metadata: {
          course,
          classification: course?.classification,
          pageUrl: page.url,
        },
      });
    });
  }

  return defaultOptions;
}
