"use server";

import { type ApiCtx } from "../..";

export default async function createSchool(ctx: ApiCtx) {
  return async (data: {
    name: string;
    district: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    canvasUrl: string;
  }) => {
    const { schools, schoolPermissions } = await import("@/server/db/schema");
    const { and, eq } = await import("drizzle-orm");

    if (!ctx.user.get?.id) {
      return {
        success: false,
        data: [],
        errors: [{ message: "Unauthorized" }],
      };
    }

    const existingSchool = (
      await ctx.db
        .select()
        .from(schoolPermissions)
        .where(
          and(
            eq(schoolPermissions.userId, ctx.user.get.id),
            eq(schoolPermissions.role, "owner")
          )
        )
        .limit(1)
    )[0];

    if (existingSchool) {
      await ctx.db
        .update(schools)
        .set({
          name: data.name,
          district: data.district,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          canvasURL: data.canvasUrl,
          isPublic: false,
        })
        .where(eq(schools.id, existingSchool.schoolId));
      return {
        success: true,
        data: [],
        errors: [] as {
          message: string;
        }[],
      };
    }

    const school = await ctx.db
      .insert(schools)
      .values({
        name: data.name,
        district: data.district,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        canvasURL: data.canvasUrl,
        isPublic: false,
      })
      .returning()
      .then((res) => res[0]);

    if (!school) {
      return {
        success: false,
        data: [],
        errors: [{ message: "Failed to create school" }],
      };
    }

    await ctx.db.insert(schoolPermissions).values({
      role: "owner",
      userId: ctx.user.get.id,
      schoolId: school.id,
    });

    return {
      success: true,
      data: [],
      errors: [] as {
        message: string;
      }[],
    };
  };
}
