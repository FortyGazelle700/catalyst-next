"use server";

import type { CanvasApiCtx } from "../..";
import type {
  Assignment,
  CanvasErrors,
  ContentDetails,
  DiscussionTopic,
  Module,
} from "../../types";

export type ModuleInput = {
  courseId: number;
  useCache?: boolean;
};

export default async function getModules(ctx: CanvasApiCtx) {
  return async (input: ModuleInput) => {
    const { unstable_cache } = await import("next/cache");
    const moduleList = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: [],
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }

      const modules = async () => {
        const url = new URL(
          `/api/v1/courses/${input.courseId}/modules`,
          ctx.user.canvas.url,
        );
        url.searchParams.append("include[]", "items");
        url.searchParams.append("include[]", "content_details");
        const query = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        if (!query.ok)
          return {
            success: false,
            data: [],
            errors: [
              {
                message: "Failed to fetch modules",
              },
            ],
          };
        let data = ((await query.json()) ?? []) as Module[] | CanvasErrors;
        if ("errors" in data) {
          return {
            success: false,
            data: [],
            errors: data.errors,
          };
        }
        data = (await Promise.all(
          data.map(async (module) => ({
            ...module,
            items: await Promise.all(
              module.items?.map(async (item) => {
                if (item.type == "Assignment") {
                  const assignmentURL = new URL(
                    `/api/v1/courses/${input.courseId}/assignments/${item.content_id}`,
                    ctx.user.canvas.url,
                  );
                  assignmentURL.searchParams.append("include[]", "submission");
                  const assignmentQuery = await fetch(assignmentURL, {
                    headers: {
                      Authorization: `Bearer ${ctx.user.canvas.token}`,
                    },
                  });
                  if (!assignmentQuery.ok) {
                    return item;
                  }
                  const assignmentData =
                    (await assignmentQuery.json()) as Assignment;
                  return {
                    ...item,
                    html_url: item.html_url.replace(
                      new URL(ctx.user.canvas.url).origin,
                      `${
                        process.env.PUBLISH_URL ?? "http://localhost:3000"
                      }/app/`,
                    ),
                    content_details: {
                      ...item.content_details,
                      ...assignmentData,
                      html_url: assignmentData.html_url.replace(
                        new URL(ctx.user.canvas.url).origin,
                        `${
                          process.env.PUBLISH_URL ?? "http://localhost:3000"
                        }/app/`,
                      ),
                    },
                  };
                } else if (item.type == "File") {
                  const fileURL = new URL(
                    `/api/v1/courses/${input.courseId}/files/${item.content_id}`,
                    ctx.user.canvas.url,
                  );
                  const fileQuery = await fetch(fileURL, {
                    headers: {
                      Authorization: `Bearer ${ctx.user.canvas.token}`,
                    },
                  });
                  if (!fileQuery.ok) {
                    return item;
                  }
                  const fileData = (await fileQuery.json()) as File;
                  return {
                    ...item,
                    html_url: item.url.replace(
                      new URL(ctx.user.canvas.url).origin,
                      `${
                        process.env.PUBLISH_URL ?? "http://localhost:3000"
                      }/app/`,
                    ),
                    content_details: {
                      ...item.content_details,
                      ...fileData,
                    },
                  };
                } else if (item.type == "Discussion") {
                  const assignmentURL = new URL(
                    `/api/v1/courses/${input.courseId}/discussion_topics/${item.content_id}`,
                    ctx.user.canvas.url,
                  );
                  assignmentURL.searchParams.append("include[]", "submission");
                  const assignmentQuery = await fetch(assignmentURL, {
                    headers: {
                      Authorization: `Bearer ${ctx.user.canvas.token}`,
                    },
                  });
                  const discussionData =
                    (await assignmentQuery.json()) as DiscussionTopic;
                  return {
                    ...item,
                    html_url: discussionData.html_url.replace(
                      new URL(ctx.user.canvas.url).origin,
                      `${
                        process.env.PUBLISH_URL ?? "http://localhost:3000"
                      }/app/`,
                    ),
                    content_details: {
                      ...item.content_details,
                      ...discussionData,
                      html_url: discussionData.html_url.replace(
                        new URL(ctx.user.canvas.url).origin,
                        `${
                          process.env.PUBLISH_URL ?? "http://localhost:3000"
                        }/app/`,
                      ),
                    },
                  };
                }
                return {
                  ...item,
                  content_details: item.content_details as ContentDetails,
                  html_url: item.html_url?.replace(
                    new URL(ctx.user.canvas.url).origin,
                    `${process.env.PUBLISH_URL ?? "http://localhost:3000"}/app/`,
                  ),
                };
              }) ?? [],
            ),
          })),
        )) as Module[];

        return {
          success: true,
          data: data,
          errors: [],
        };
      };

      const assignments = async () => {
        const url = new URL(
          `/api/v1/courses/${input.courseId}/assignments`,
          ctx.user.canvas.url,
        );
        url.searchParams.append("per_page", "1000");
        url.searchParams.append("include[]", "submission");
        const data = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        if (!data.ok) return [];
        return (await data.json()) as Assignment[];
      };

      const moduleList = await modules();

      if (!moduleList.success) {
        return {
          success: false,
          data: [],
          errors: moduleList.errors,
        };
      }

      const data = moduleList.data as Module[] | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: [],
          errors: data.errors,
        };
      }

      const unassignedModule = {
        id: -1,
        workflow_state: "active",
        position: 100000000,
        name: "Unassigned Assignments",
        unlock_at: "",
        require_sequential_progress: false,
        prerequisite_module_ids: [],
        items_count: 0,
        items_url: `/api/v1/courses/${input.courseId}/modules/-1/items`,
        items: [],
        state: "published",
        completed_at: null,
        publish_final_grade: null,
        published: true,
      } as Module;

      (await assignments()).forEach((assignment) => {
        if (
          data?.some((module) =>
            module.items?.some((item) => item.content_id == assignment.id),
          )
        )
          return;
        unassignedModule.items!.push({
          id: assignment.id,
          module_id: -1,
          position: unassignedModule.items!.length,
          title: assignment.name,
          indent: 0,
          type: "assignment",
          content_id: assignment.course_id,
          html_url: assignment.html_url.replace(
            new URL(ctx.user.canvas.url).origin,
            `${process.env.PUBLISH_URL ?? "http://localhost:3000"}/app/`,
          ),
          url: assignment.html_url,
          page_url: assignment.html_url,
          external_url: "",
          new_tab: false,
          completion_requirement: null,
          content_details: assignment as ContentDetails & Assignment,
          published: true,
        });
      });

      if (unassignedModule.items?.length) {
        data.push(unassignedModule);
      }
      data.sort((a, b) => a.position - b.position);
      data.forEach((module) => {
        module.items?.sort((a, b) => a.position - b.position);
      });
      data.forEach((module) => {
        module.items?.forEach((item) => {
          item.content_details = item.content_details as ContentDetails;
          item.content_details.html_url =
            item.content_details.html_url?.replace(
              new URL(ctx.user.canvas.url).origin,
              `${process.env.PUBLISH_URL ?? "http://localhost:3000"}/app/`,
            );
          item.html_url = item.html_url?.replace(
            new URL(ctx.user.canvas.url).origin,
            `${process.env.PUBLISH_URL ?? "http://localhost:3000"}/app/`,
          );
        });
      });

      return {
        success: true,
        data: data,
        errors: [],
      };
    };

    if (input?.useCache ?? true) {
      return await unstable_cache(
        moduleList,
        [
          `user_${ctx.user.get?.id}:course:modules`,
          `user_${ctx.user.get?.id}:course:modules@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:modules`,
            `user_${ctx.user.get?.id}:course:modules@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        },
      )();
    }
    return await moduleList();
  };
}
