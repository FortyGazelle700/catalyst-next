"use client";

import {
  PrettyState,
  SubmissionTypeWithIcon,
} from "@/components/catalyst/pretty-state";
import { RadialChart } from "@/components/catalyst/radial-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { GradesResponse } from "@/server/api/canvas/courses/grades";
import {
  AlertCircle,
  CalendarIcon,
  CircleSlash,
  Dot,
  Group,
  Info,
  Minus,
  MoreHorizontal,
  Percent,
  Slash,
  Undo,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function GradesClientPage({
  course,
  grades,
}: {
  course: number;
  grades?: GradesResponse;
}) {
  const [assignments, setAssignments] = useState(grades?.assignments ?? []);
  const [gradeGroups, setGradeGroups] = useState(grades?.groups ?? []);
  const [scoreOverrides, setScoreOverrides] = useState<
    Record<number, string | undefined>
  >({});
  const [totalOverrides, setTotalOverrides] = useState<
    Record<number, string | undefined>
  >({});

  const [calculatedWhatIfScore, setCalculatedWhatIfScore] = useState<number>(0);

  useEffect(() => {
    const groups: (undefined | number)[] = [];
    let weightsAdded = 0;
    let calculatedScore = 0;
    assignments.forEach((grade) => {
      if ((scoreOverrides[grade.id] ?? grade.submission?.score ?? -1) == -1)
        return;
      groups[grade.assignment_group_id] ??= 0;
      groups[grade.assignment_group_id]! += Number(
        scoreOverrides[grade.id] ?? grade.submission?.score ?? 0
      );
    });
    gradeGroups.forEach((group) => {
      const pointsScored = groups[group.id]!;
      const totalPoints = assignments
        .filter((assignment) => assignment.assignment_group_id == group.id)
        .filter(
          (assignment) =>
            (scoreOverrides[assignment.id] ??
              assignment.submission?.score ??
              -1) != -1
        )
        .reduce(
          (prev, assignment) => prev + (assignment.points_possible ?? 0),
          0
        );
      groups[group.id] =
        totalPoints == 0 ? undefined : pointsScored / totalPoints;
    });
    gradeGroups.forEach((group) => {
      if (groups[group.id] == undefined) return;
      weightsAdded += group.group_weight;
      calculatedScore += groups[group.id]! * group.group_weight;
    });
    setCalculatedWhatIfScore((calculatedScore * 100) / weightsAdded);
  }, [gradeGroups, grades, scoreOverrides, totalOverrides]);

  return (
    <div className="flex w-full h-full @container">
      <div className="flex w-full h-full items-stretch @4xl:flex-row flex-col-reverse overflow-auto @4xl:overflow-hidden">
        <div className="flex-1 @4xl:overflow-auto overflow-x-auto min-h-max @4xl:min-h-full p-16">
          <h1 className="h1 mb-2">Grades</h1>
          <div className="flex flex-col gap-4">
            <div className="sticky -top-12 z-10 -mx-4 flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
              <div className="flex-1 px-2">Name</div>
              <div className="w-[10ch] px-2 text-right">score</div>
              <div className="w-[2ch]" />
              <div className="w-[10ch] px-2 text-right">out of</div>
              <div className="w-2" />
              <div className="w-10" />
            </div>
            <div className="sticky -top-16 -my-8 h-8 w-full bg-background" />
            <div className="mt-2 flex flex-col">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-col items-stretch gap-2 border-b py-2 md:flex-row"
                >
                  <Button
                    variant="ghost"
                    className="flex h-auto flex-1 flex-col items-start gap-1 overflow-hidden"
                    href={`/app/courses/${course}/assignments/${assignment.id}`}
                  >
                    <div className="max-w-full truncate font-bold">
                      {assignment.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {gradeGroups.find(
                        (group) => group.id == assignment.assignment_group_id
                      )?.name ?? "N/A"}{" "}
                      (
                      {gradeGroups.find(
                        (group) => group.id == assignment.assignment_group_id
                      )?.group_weight ?? "N/A"}
                      %)
                    </div>
                    <div>
                      {"submission_types" in assignment &&
                        assignment?.submission_types && (
                          <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <PrettyState
                                state={
                                  assignment.submission?.workflow_state ?? ""
                                }
                              />
                            </span>
                            <Minus />
                            {assignment?.due_at ? (
                              <span className="flex items-center gap-1">
                                <CalendarIcon />
                                {new Date(
                                  assignment?.due_at ?? ""
                                ).toLocaleString()}
                              </span>
                            ) : (
                              <>No due date set</>
                            )}
                            <Minus />
                            {assignment?.submission_types.map((type) => (
                              <span
                                className="flex items-center gap-1"
                                key={type}
                              >
                                <SubmissionTypeWithIcon submission={type} />
                              </span>
                            ))}
                          </span>
                        )}
                    </div>
                  </Button>
                  <div className="flex h-full items-center justify-end gap-2">
                    <div className="flex h-auto w-[10ch] items-center justify-end gap-1 p-2 text-right">
                      {(scoreOverrides[assignment?.id] ?? "NO") == "" ||
                      (scoreOverrides[assignment?.id] ??
                        assignment.submission?.score ??
                        -1) != (assignment.submission?.score ?? -1) ? (
                        <>
                          <span>
                            {scoreOverrides[assignment?.id] == ""
                              ? "N/A"
                              : scoreOverrides[assignment?.id]}
                          </span>
                          <span
                            className="text-muted-foreground line-through transition-colors"
                            key={`score-${assignment.id}`}
                          >
                            {assignment.submission?.score
                              ? Number(assignment.submission?.score.toFixed(2))
                              : "N/A"}
                          </span>
                        </>
                      ) : (
                        <span
                          className="transition-colors"
                          key={`score-${assignment.id}`}
                        >
                          {assignment.submission?.score
                            ? Number(assignment.submission?.score.toFixed(2))
                            : "N/A"}
                        </span>
                      )}
                    </div>
                    <div className="grid w-[2ch] place-items-center text-right text-muted-foreground">
                      <Slash />
                    </div>
                    <div className="h-auto w-[10ch] justify-end p-2 text-right">
                      {((totalOverrides[assignment?.id] ?? "") != "" &&
                        (totalOverrides[assignment?.id] ??
                          assignment.points_possible ??
                          -1) != assignment.points_possible) ??
                      -1 ? (
                        <>
                          <span>
                            {totalOverrides[assignment?.id] == ""
                              ? "N/A"
                              : totalOverrides[assignment?.id]}
                          </span>
                          <span
                            className="text-muted-foreground line-through transition-colors"
                            key={`score-${assignment.id}`}
                          >
                            {assignment.points_possible
                              ? Number(assignment.points_possible.toFixed(2))
                              : "N/A"}
                          </span>
                        </>
                      ) : (
                        <span
                          className="transition-colors"
                          key={`score-${assignment.id}`}
                        >
                          {assignment.points_possible
                            ? Number(assignment.points_possible.toFixed(2))
                            : "N/A"}
                        </span>
                      )}
                    </div>
                    <div className="w-2" />
                    <div className="grid w-10 place-items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[40ch]" align="end">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                              <span className="w-[25ch]">What-If Score</span>
                              <Input
                                className="min-w-[8ch] flex-1 text-right"
                                value={
                                  scoreOverrides[assignment?.id] ??
                                  assignment?.submission?.score ??
                                  ""
                                }
                                onChange={(val) => {
                                  setScoreOverrides((prev) => ({
                                    ...prev,
                                    [assignment.id]: (
                                      val.target.value ??
                                      prev[assignment.id] ??
                                      0
                                    ).replace(new RegExp("[^0-9.]", "g"), ""),
                                  }));
                                }}
                                placeholder="N/A"
                                inputmode="numeric"
                              />
                              <span className="mr-2 text-xs text-muted-foreground">
                                pts
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0"
                                onClick={() => {
                                  setScoreOverrides((prev) => ({
                                    ...prev,
                                    [assignment.id]: undefined,
                                  }));
                                }}
                              >
                                <Undo />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0"
                                onClick={() => {
                                  setScoreOverrides((prev) => ({
                                    ...prev,
                                    [assignment.id]: "",
                                  }));
                                }}
                              >
                                <CircleSlash />
                              </Button>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-[25ch]">What-If Out Of</span>
                              <Input
                                className="min-w-[8ch] flex-1 text-right"
                                value={
                                  totalOverrides[assignment?.id] ??
                                  assignment?.points_possible ??
                                  -1
                                }
                                onChange={(val) => {
                                  setTotalOverrides((prev) => ({
                                    ...prev,
                                    [assignment.id]: (
                                      val.target.value ??
                                      prev[assignment.id] ??
                                      0
                                    ).replace(new RegExp("[^0-9.]", "g"), ""),
                                  }));
                                }}
                                placeholder={String(assignment.points_possible)}
                                inputmode="numeric"
                              />
                              <span className="mr-2 text-xs text-muted-foreground">
                                pts
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0"
                                onClick={() => {
                                  setTotalOverrides((prev) => ({
                                    ...prev,
                                    [assignment.id]: undefined,
                                  }));
                                }}
                              >
                                <Undo />
                              </Button>
                              <div className="w-12" />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <GradesSidebar
          course={course}
          grades={grades}
          assignments={assignments}
          gradeGroups={gradeGroups}
          scoreOverrides={scoreOverrides}
          totalOverrides={totalOverrides}
          setAssignments={setAssignments}
          setGradeGroups={setGradeGroups}
          calculatedWhatIfScore={calculatedWhatIfScore}
        />
      </div>
    </div>
  );
}

function GradesSidebar({
  course,
  grades,
  scoreOverrides,
  totalOverrides,
  assignments,
  gradeGroups,
  setAssignments,
  setGradeGroups,
  calculatedWhatIfScore,
}: {
  course: number;
  grades?: GradesResponse;
  assignments: GradesResponse["assignments"];
  gradeGroups: GradesResponse["groups"];
  scoreOverrides: Record<number, string | undefined>;
  totalOverrides: Record<number, string | undefined>;
  setAssignments: (assignments: GradesResponse["assignments"]) => void;
  setGradeGroups: (gradeGroups: GradesResponse["groups"]) => void;
  calculatedWhatIfScore: number;
}) {
  return (
    <>
      <Sidebar
        collapsible="none"
        className="rounded-xs m-2 min-h-max @4xl:h-[calc(100%-var(--spacing)*4)] overflow-auto scrollbar-auto w-[calc(100%-1rem)] @4xl:w-[20rem]"
      >
        <SidebarHeader>
          <h1 className="font-bold text-2xl flex items-center gap-1">
            <Percent /> Grades
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Info /> Overview
            </SidebarGroupLabel>
            <div className="text-destructive-foreground text-xs flex gap-1 items-center px-2">
              <AlertCircle className="size-3 flex-shrink-0" /> Submissions may
              not work as intended. Please verify that your submission submit
              correctly.
            </div>
            <h2 className="font-bold text-2xl flex items-center gap-2">
              <RadialChart percentage={calculatedWhatIfScore} />{" "}
              {calculatedWhatIfScore.toFixed(2)}%
            </h2>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Group /> Groups
            </SidebarGroupLabel>
            {gradeGroups.map((group) => {
              const allAssignments = assignments.filter(
                (assignment) => assignment.assignment_group_id == group.id
              );
              const gradedAssignments = allAssignments.filter(
                (assignment) => (assignment.submission?.score ?? -1) != -1
              );
              const isOverridden = allAssignments.some(
                (assignment) =>
                  scoreOverrides[assignment?.id] != undefined &&
                  scoreOverrides[assignment?.id] != assignment.submission?.score
              );
              const score = allAssignments
                .filter(
                  (assignment) =>
                    scoreOverrides[assignment?.id] != "" &&
                    (assignment.submission?.score ?? -1) != -1
                )
                .reduce(
                  (prev, assignment) =>
                    prev +
                    Number(
                      scoreOverrides[assignment?.id] ??
                        assignment.submission?.score ??
                        0
                    ),
                  0
                );
              const outOf = allAssignments
                .filter(
                  (assignment) =>
                    scoreOverrides[assignment?.id] != "" &&
                    (assignment.submission?.score ?? -1) != -1
                )
                .reduce(
                  (prev, assignment) =>
                    prev +
                    Number(
                      totalOverrides[assignment?.id] ??
                        assignment.points_possible ??
                        0
                    ),
                  0
                );
              return (
                <div key={group.id} className="border-t p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-bold">{group.name}</div>
                    <div className="text-right">
                      {group.group_weight ?? "N/A"}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-muted-foreground text-xs">
                      {allAssignments.length} assignments{" "}
                      {gradedAssignments.length != allAssignments.length && (
                        <>({gradedAssignments.length} graded)</>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-right text-xs">
                      {Math.round(score * 100) / 100}/
                      {Math.round(outOf * 100) / 100} <Dot />{" "}
                      {((score / outOf) * 100).toFixed(2) == "NaN"
                        ? "N/A"
                        : ((score / outOf) * 100).toFixed(2)}
                      % {isOverridden && "*"}
                    </div>
                  </div>
                </div>
              );
            })}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
