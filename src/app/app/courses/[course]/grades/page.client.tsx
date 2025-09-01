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
import { type GradesResponse } from "@/server/api/canvas/courses/grades";
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
        scoreOverrides[grade.id] ?? grade.submission?.score ?? 0,
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
              -1) != -1,
        )
        .reduce(
          (prev, assignment) => prev + (assignment.points_possible ?? 0),
          0,
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
  }, [assignments, gradeGroups, grades, scoreOverrides, totalOverrides]);

  return (
    <div className="@container flex h-full w-full">
      <div className="flex h-full w-full flex-col-reverse items-stretch overflow-auto @4xl:flex-row @4xl:overflow-hidden">
        <div className="min-h-max flex-1 overflow-x-auto p-16 @4xl:min-h-full @4xl:overflow-auto">
          <h1 className="h1 mb-2">Grades</h1>
          <div className="@container flex flex-col gap-4">
            <div className="bg-secondary sticky -top-12 z-10 -mx-4 flex items-center gap-2 rounded-lg px-4 py-2">
              <div className="flex-1 px-2">Name</div>
              <div className="w-[10ch] px-2 text-right">score</div>
              <div className="w-[2ch]" />
              <div className="w-[10ch] px-2 text-right">out of</div>
              <div className="w-2" />
              <div className="w-10" />
            </div>
            <div className="bg-background sticky -top-16 -my-8 h-8 w-full" />
            <div className="mt-2 flex flex-col">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-col items-stretch gap-2 border-b py-2 @3xl:flex-row"
                >
                  <Button
                    variant="ghost"
                    className="flex h-auto flex-1 flex-col items-start gap-1 overflow-hidden"
                    href={`/app/courses/${course}/assignments/${assignment.id}`}
                  >
                    <div className="max-w-full truncate font-bold">
                      {assignment.name}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      {gradeGroups.find(
                        (group) => group.id == assignment.assignment_group_id,
                      )?.name ?? "N/A"}{" "}
                      (
                      {gradeGroups.find(
                        (group) => group.id == assignment.assignment_group_id,
                      )?.group_weight ?? "N/A"}
                      %)
                    </div>
                    <div>
                      {"submission_types" in assignment &&
                        assignment?.submission_types && (
                          <span className="text-muted-foreground flex items-center gap-2 text-xs">
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
                                  assignment?.due_at ?? "",
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
                            {scoreOverrides[assignment?.id] == "" ? (
                              <Minus />
                            ) : (
                              scoreOverrides[assignment?.id]
                            )}
                          </span>
                          <span
                            className="text-muted-foreground line-through transition-colors"
                            key={`score-${assignment.id}`}
                          >
                            {Number.isNaN(
                              assignment.submission?.score ?? Number.NaN,
                            ) ? (
                              <Minus />
                            ) : (
                              Number(assignment.submission?.score.toFixed(2))
                            )}
                          </span>
                        </>
                      ) : (
                        <span
                          className="transition-colors"
                          key={`score-${assignment.id}`}
                        >
                          {Number.isNaN(
                            assignment.submission?.score ?? Number.NaN,
                          ) ? (
                            <Minus />
                          ) : (
                            Number(assignment.submission?.score?.toFixed(2))
                          )}
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground grid w-[2ch] place-items-center text-right">
                      <Slash />
                    </div>
                    <div className="h-auto w-[10ch] justify-end p-2 text-right">
                      {(((totalOverrides[assignment?.id] ?? "") != "" &&
                        (totalOverrides[assignment?.id] ??
                          assignment.points_possible ??
                          -1) != assignment.points_possible) ??
                      -1) ? (
                        <>
                          <span>
                            {totalOverrides[assignment?.id] == ""
                              ? "0"
                              : totalOverrides[assignment?.id]}
                          </span>
                          <span
                            className="text-muted-foreground line-through transition-colors"
                            key={`score-${assignment.id}`}
                          >
                            {Number.isNaN(
                              assignment.points_possible ?? Number.NaN,
                            )
                              ? "0"
                              : Number(assignment.points_possible.toFixed(2))}
                          </span>
                        </>
                      ) : (
                        <span
                          className="transition-colors"
                          key={`score-${assignment.id}`}
                        >
                          {Number.isNaN(
                            assignment.points_possible ?? Number.NaN,
                          )
                            ? "0"
                            : Number(assignment.points_possible.toFixed(2))}
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
                                inputMode="numeric"
                              />
                              <span className="text-muted-foreground mr-2 text-xs">
                                pts
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0"
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
                                className="shrink-0"
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
                                inputMode="numeric"
                              />
                              <span className="text-muted-foreground mr-2 text-xs">
                                pts
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0"
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
  course: _c,
  grades: _g,
  scoreOverrides,
  totalOverrides,
  assignments,
  gradeGroups,
  setAssignments: _sA,
  setGradeGroups: _sG,
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
        className="scrollbar-auto m-2 min-h-max w-[calc(100%-1rem)] overflow-auto rounded-xs @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:w-[20rem]"
      >
        <SidebarHeader className="p-4">
          <h1 className="flex items-center gap-1 text-2xl font-bold">
            <Percent /> Grades
          </h1>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel>
              <Info /> Overview
            </SidebarGroupLabel>
            <div className="text-destructive-foreground bg-destructive/30 my-2 flex items-center gap-2 rounded-sm px-3 py-2 text-xs">
              <AlertCircle className="size-4 shrink-0" /> Submissions may not
              work as intended. Please verify that your submission submit
              correctly.
            </div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <RadialChart
                percentage={
                  Number.isNaN(calculatedWhatIfScore)
                    ? -1
                    : calculatedWhatIfScore
                }
              />
              {Number.isNaN(calculatedWhatIfScore)
                ? "0"
                : calculatedWhatIfScore.toFixed(2)}
              %
            </h2>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Group /> Groups
            </SidebarGroupLabel>
            {gradeGroups.map((group) => {
              const allAssignments = assignments.filter(
                (assignment) => assignment.assignment_group_id == group.id,
              );
              const gradedAssignments = allAssignments.filter(
                (assignment) => (assignment.submission?.score ?? -1) != -1,
              );
              const isOverridden = allAssignments.some(
                (assignment) =>
                  scoreOverrides[assignment?.id] != undefined &&
                  scoreOverrides[assignment?.id] !=
                    assignment.submission?.score,
              );
              const score = allAssignments
                .filter(
                  (assignment) =>
                    scoreOverrides[assignment?.id] != "" &&
                    (assignment.submission?.score ?? -1) != -1,
                )
                .reduce(
                  (prev, assignment) =>
                    prev +
                    Number(
                      scoreOverrides[assignment?.id] ??
                        assignment.submission?.score ??
                        0,
                    ),
                  0,
                );
              const outOf = allAssignments
                .filter(
                  (assignment) =>
                    scoreOverrides[assignment?.id] != "" &&
                    (assignment.submission?.score ?? -1) != -1,
                )
                .reduce(
                  (prev, assignment) =>
                    prev +
                    Number(
                      totalOverrides[assignment?.id] ??
                        assignment.points_possible ??
                        0,
                    ),
                  0,
                );
              return (
                <div key={group.id} className="border-t p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-bold">{group.name}</div>
                    <div className="text-right">
                      {group.group_weight ?? "0"}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground flex-1 text-xs">
                      {allAssignments.length} assignments{" "}
                      {gradedAssignments.length != allAssignments.length && (
                        <>({gradedAssignments.length} graded)</>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-right text-xs">
                      {Math.round(score * 100) / 100}/
                      {Math.round(outOf * 100) / 100} <Dot />{" "}
                      {Number.isNaN((score / outOf) * 100)
                        ? "0"
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
