import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// D&D Points Bot specific schemas
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  points: integer("points").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  discordId: true,
  username: true,
  points: true,
});

export const pointHistory = pgTable("point_history", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  addedBy: text("added_by").notNull(),
});

export const insertPointHistorySchema = createInsertSchema(pointHistory).pick({
  playerId: true,
  amount: true,
  reason: true,
  addedBy: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertPointHistory = z.infer<typeof insertPointHistorySchema>;
export type PointHistory = typeof pointHistory.$inferSelect;
