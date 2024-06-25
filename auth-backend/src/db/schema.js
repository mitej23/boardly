import { text, varchar, timestamp, uuid, pgTable, primaryKey } from 'drizzle-orm/pg-core';

// Define the User table schema
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', 255).notNull(),
  email: varchar('email', 255).notNull().unique(),
  password: text('password'),
  refreshToken: text('refresh_token'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users_boards = pgTable('users_boards', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.boardId] }),
  };
});

export const boards = pgTable('boards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export const shareable_links = pgTable('shareable_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }).notNull(),
  link: varchar('link', 255).notNull().unique(), // You may generate a unique link string
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'), // Optional: if you want to set an expiration for the link
});