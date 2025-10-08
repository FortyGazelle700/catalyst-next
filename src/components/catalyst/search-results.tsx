"use client";

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  Trophy,
  Calendar,
  Clock,
  Hash,
  LayoutDashboard,
  MessageCircle,
  Building2,
  Settings,
} from "lucide-react";
import type { SearchResult } from "@/lib/command-search";

interface CommandSearchResultsProps {
  results: SearchResult[];
  defaultOptions: SearchResult[];
  loading: boolean;
  query: string;
  onSelect?: () => void;
}

const iconMap = {
  BookOpen,
  FileText,
  Trophy,
  Calendar,
  Clock,
  Hash,
  LayoutDashboard,
  MessageCircle,
  Building2,
  Settings,
};

export function CommandSearchResults({
  results,
  defaultOptions,
  loading,
  query,
  onSelect,
}: CommandSearchResultsProps) {
  const router = useRouter();

  const handleSelect = (result: SearchResult) => {
    router.push(result.url);
    onSelect?.();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <div className="text-muted-foreground text-sm">
          Loading courses and assignments...
        </div>
      </div>
    );
  }

  // Show default options when no query
  const displayResults = query.trim() ? results : defaultOptions;

  if (displayResults.length === 0) {
    if (query.trim()) {
      return (
        <CommandEmpty>
          <div className="flex flex-col items-center py-6">
            <div className="mb-2 text-sm">No results found</div>
            <div className="text-muted-foreground max-w-sm text-center text-xs">
              Try searching for course names, assignments, grades, or pages like
              Dashboard, Social, Settings
            </div>
          </div>
        </CommandEmpty>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center px-4 py-12">
          <div className="text-muted-foreground text-sm">
            No courses or assignments available
          </div>
        </div>
      );
    }
  }

  // Group results by type
  const navigationResults = displayResults.filter(
    (r) => r.type === "navigation",
  );
  const courseResults = displayResults.filter((r) => r.type === "course");
  const assignmentResults = displayResults.filter(
    (r) => r.type === "assignment",
  );
  const eventResults = displayResults.filter((r) => r.type == "event");

  return (
    <>
      {navigationResults.length > 0 && (
        <CommandGroup heading={query.trim() ? "Navigation" : "Quick Links"}>
          {navigationResults.map((result) => {
            const Icon = iconMap[result.icon as keyof typeof iconMap] || Hash;
            return (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-3 py-3"
              >
                <Icon className="h-4 w-4 text-gray-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{result.title}</div>
                  <div className="text-muted-foreground truncate text-xs">
                    {result.subtitle}
                  </div>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}
      {courseResults.length > 0 && (
        <CommandGroup heading={query.trim() ? "Courses" : "Your Courses"}>
          {courseResults.map((result) => {
            const Icon =
              iconMap[result.icon as keyof typeof iconMap] || BookOpen;
            return (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-3 py-3"
              >
                <Icon className="h-4 w-4 text-blue-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{result.title}</div>
                  <div className="text-muted-foreground truncate text-xs">
                    {result.subtitle}
                  </div>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}

      {assignmentResults.length > 0 && (
        <CommandGroup heading="Assignments">
          {assignmentResults.map((result) => {
            const Icon =
              iconMap[result.icon as keyof typeof iconMap] || FileText;
            return (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-3 py-3"
              >
                <Icon className="h-4 w-4 text-green-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{result.title}</div>
                  <div className="text-muted-foreground truncate text-xs">
                    {result.subtitle}
                  </div>
                  {result.metadata?.assignment?.due_at && (
                    <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {new Date(
                        result.metadata.assignment.due_at,
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}

      {eventResults.length > 0 && (
        <CommandGroup
          heading={query.trim() ? "Upcoming Events" : "Due This Week"}
        >
          {eventResults.map((result) => {
            const Icon =
              iconMap[result.icon as keyof typeof iconMap] || Calendar;

            return (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-3 py-3"
              >
                <Icon className="h-4 w-4 text-purple-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{result.title}</div>
                  <div className="text-muted-foreground truncate text-xs">
                    {result.subtitle}
                  </div>
                  {result.metadata?.classification && (
                    <div className="text-muted-foreground mt-1 text-xs">
                      {result.metadata.classification}
                    </div>
                  )}
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}
    </>
  );
}
