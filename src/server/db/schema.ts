import { relations, sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable as table,
  primaryKey,
  text,
  timestamp,
  varchar,
  pgEnum as varenum,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const users = table("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 32 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  realtimeSecret: varchar("realtime_secret", { length: 256 }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const proUsers = table("pro_user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = table(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = table(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    lastAccessed: timestamp("last_accessed", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    ip: varchar("ip", { length: 45 }),
    userAgent: varchar("user_agent", { length: 256 }),
    country: varchar("country", { length: 64 }),
    region: varchar("region", { length: 64 }),
    city: varchar("city", { length: 64 }),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = table(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

////////////////////////////////////////

export const userRelationState = varenum("relation_state_enum", [
  "requested",
  "friends",
  "denied",
  "blocked",
]);
export const periodType = varenum("period_type_enum", [
  "single",
  "course",
  "filler",
]);
export const permissionRole = varenum("permission_role_enum", [
  "owner",
  "admin",
]);

export const settings = table(
  "setting",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    value: text("value"),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (setting) => ({
    userIdIdx: index("setting_user_id_idx").on(setting.userId),
    keyIdx: index("setting_key_idx").on(setting.key),
    // compoundKey: primaryKey({
    //   columns: [setting.userId, setting.key],
    // }),
  }),
);

export const settingsToUserRelation = relations(settings, ({ one }) => ({
  user: one(users, { fields: [settings.userId], references: [users.id] }),
}));

export const userToSettingsRelation = relations(users, ({ many }) => ({
  settings: many(settings),
}));

export const schools = table(
  "school",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 32 }),
    district: varchar("district", { length: 32 }),
    address: text("address"),
    city: varchar("city", { length: 32 }),
    state: varchar("state", { length: 2 }),
    zip: varchar("zip", { length: 10 }),
    lat: doublePrecision("lat"),
    long: doublePrecision("long"),
    canvasURL: varchar("canvas_url", { length: 255 }),
    isPublic: boolean("is_public"),
    observeDST: boolean("observe_dst").default(false),
    timezone: varchar("timezone", { length: 64 }).default("America/New_York"),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (school) => ({
    nameIdx: index("school_name_idx").on(school.name),
    districtIdx: index("school_district_idx").on(school.district),
  }),
);

export const schoolPermissions = table(
  "school_permission",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 })
      .notNull()
      .references(() => schools.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 }).notNull(),
    role: varchar("role", { length: 32 }).notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (schoolPermission) => ({
    schoolIdIdx: index("school_permission_school_id_idx").on(
      schoolPermission.schoolId,
    ),
    userIdIdx: index("school_permission_user_id_idx").on(
      schoolPermission.userId,
    ),
  }),
);

export const periods = table(
  "period",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    periodId: varchar("period_id", { length: 255 })
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    optionId: varchar("option_id", { length: 255 })
      .notNull()
      .unique()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 }).notNull(),
    periodName: varchar("periodName", { length: 32 }).notNull(),
    optionName: varchar("optionName", { length: 32 }).notNull(),
    type: periodType("period_type"),
    periodOrder: integer("period_order"),
    optionOrder: integer("option_order"),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (period) => ({
    periodIdIdx: index("period_period_id_idx").on(period.periodId),
    optionIdIdx: index("period_option_id_idx").on(period.optionId),
    schoolIdIdx: index("period_school_id_idx").on(period.schoolId),
  }),
);

export const schedules = table("schedule", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  schoolId: varchar("school_id", { length: 255 }),
  name: varchar("name", { length: 32 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const periodTimes = table(
  "period_time",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 }).notNull(),
    optionId: varchar("option_id", { length: 255 }).notNull(),
    order: integer("order").notNull(),
    scheduleId: varchar("schedule_id", { length: 255 }).notNull(),
    start: varchar("start").notNull(),
    end: varchar("end").notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (periodTime) => ({
    optionIdIdx: index("period_time_option_id_idx").on(periodTime.optionId),
    scheduleIdIdx: index("period_time_schedule_id_idx").on(
      periodTime.scheduleId,
    ),
  }),
);

export const periodTimeToScheduleRelation = relations(
  periodTimes,
  ({ one }) => ({
    schedule: one(schedules, {
      fields: [periodTimes.scheduleId],
      references: [schedules.id],
    }),
  }),
);

export const periodTimeToPeriodRelation = relations(periodTimes, ({ one }) => ({
  period: one(periods, {
    fields: [periodTimes.optionId],
    references: [periods.optionId],
  }),
}));

export const scheduleValues = table(
  "schedule_value",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).notNull(),
    periodId: varchar("period_id", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (scheduleValue) => ({
    userIdIdx: index("schedule_value_user_id_idx").on(scheduleValue.userId),
    periodIdIdx: index("schedule_value_period_id_idx").on(
      scheduleValue.periodId,
    ),
  }),
);

export const scheduleDates = table(
  "schedule_date",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 }).notNull(),
    scheduleId: varchar("schedule_id", { length: 255 }).notNull(),
    date: timestamp("date", {
      mode: "date",
    }).notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (scheduleDate) => ({
    schoolIdIdx: index("schedule_date_school_id_idx").on(scheduleDate.schoolId),
  }),
);

export const scheduleDatesSchedule = table(
  "schedule_date_schedules",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 }).notNull(),
    scheduleId: varchar("schedule_id", { length: 255 }).notNull(),
    repeat: integer("repeat").notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (scheduleDate) => ({
    schoolIdIdx: index("schedule_date_schedules_school_id_idx").on(
      scheduleDate.schoolId,
    ),
  }),
);

export const scheduleDateToScheduleRelation = relations(
  scheduleDates,
  ({ one }) => ({
    schedule: one(schedules, {
      fields: [scheduleDates.scheduleId],
      references: [schedules.id],
    }),
  }),
);

export const notifications = table(
  "notification",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).notNull(),
    data: jsonb("data"),
    dismissed: boolean("dismissed").notNull().default(false),
    sentAt: timestamp("sent_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (notification) => ({
    userIdIdx: index("notification_user_id_idx").on(notification.userId),
  }),
);

export const ipData = table("cache_ip_data", {
  ip: varchar("ip", { length: 512 }).notNull().primaryKey(),
  data: jsonb("data"),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const courseClassification = table("cache_course_classification", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  key: varchar("key", { length: 255 }).notNull(),
  value: varchar("value"),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  saveToDataset: boolean("save_to_dataset").notNull().default(false),
});

export const assignmentOverrides = table("assignment_override", {
  id: varchar("id", { length: 255 })
    .notNull()
    .unique()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 }).notNull(),
  courseId: varchar("course_id", { length: 255 }).notNull(),
  assignmentId: varchar("assignment_id", { length: 255 }).notNull(),
  dueAt: timestamp("due_at", { mode: "date" }),
  userDescription: jsonb("user_description").$type<{
    description: string;
    links: { label: string; href: string }[];
  }>(),
  duration: integer("duration").notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  markedComplete: boolean("marked_complete").notNull().default(false),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const userRelationships = table(
  "user_relationship",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).notNull(),
    relatedUserId: varchar("related_user_id", { length: 255 }).notNull(),
    defaultChatId: varchar("default_chat_id", { length: 255 }),
    state: userRelationState("relation_state").notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (userRelationship) => ({
    userIdIdx: index("user_relationship_user_id_idx").on(
      userRelationship.userId,
    ),
    relatedUserIdIdx: index("user_relationship_related_user_id_idx").on(
      userRelationship.relatedUserId,
    ),
  }),
);

export const chats = table(
  "chat",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }),
    members: jsonb("members")
      .notNull()
      .$type<{ data: Array<{ userId: string }> }>(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (chat) => ({
    nameIdx: index("chat_name_idx").on(chat.name),
  }),
);

export const chatMessages = table(
  "chat_message",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    chatId: varchar("chat_id", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    message: text("message").notNull(),
    sentAt: timestamp("sent_at", { mode: "date" }).notNull(),
    attachments: jsonb("attachments")
      .notNull()
      .$type<Array<{ type: string; id: string }>>()
      .default([]),
    reactions: jsonb("reactions")
      .notNull()
      .$type<Array<{ userId: string; reaction: string }>>()
      .default([]),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (chatMessage) => ({
    chatIdIdx: index("chat_message_chat_id_idx").on(chatMessage.chatId),
    userIdIdx: index("chat_message_user_id_idx").on(chatMessage.userId),
  }),
);

export const feedback = table("feedback", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  importance: varchar("importance", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  pathname: varchar("pathname", { length: 255 }).notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  markedComplete: boolean("marked_complete").notNull().default(false),
});
