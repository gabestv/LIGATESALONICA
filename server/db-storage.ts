import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, players, pointHistory } from "@shared/schema";
import { type User, type InsertUser } from "@shared/schema";
import { type Player, type InsertPlayer, type PointHistory } from "@shared/schema";
import { eq } from "drizzle-orm";
import { IStorage } from "./storage";

// Initialize Postgres client
const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Player operations
  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id)).limit(1);
    return result[0];
  }

  async getPlayerByDiscordId(discordId: string): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.discordId, discordId)).limit(1);
    return result[0];
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const values = {
      ...insertPlayer,
      points: insertPlayer.points ?? 0,
    };
    const result = await db.insert(players).values(values).returning();
    return result[0];
  }

  // Points operations
  async addPoints(playerId: number, amount: number, reason: string, addedBy: string): Promise<Player> {
    // First get the player
    const player = await this.getPlayerById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    // Update player's points
    const now = new Date();
    const updatedPlayer = await db
      .update(players)
      .set({ points: player.points + amount, lastUpdated: now })
      .where(eq(players.id, playerId))
      .returning();

    // Record in history
    await db.insert(pointHistory).values({
      playerId,
      amount,
      reason,
      timestamp: now,
      addedBy
    });

    return updatedPlayer[0];
  }

  async resetPoints(playerId: number, addedBy: string): Promise<Player> {
    // First get the player
    const player = await this.getPlayerById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    // Update player's points
    const now = new Date();
    const updatedPlayer = await db
      .update(players)
      .set({ points: 0, lastUpdated: now })
      .where(eq(players.id, playerId))
      .returning();

    // Record in history
    await db.insert(pointHistory).values({
      playerId,
      amount: -player.points, // Negative amount to show reset
      reason: "Points reset",
      timestamp: now,
      addedBy
    });

    return updatedPlayer[0];
  }

  async setPoints(playerId: number, points: number, addedBy: string): Promise<Player> {
    // First get the player
    const player = await this.getPlayerById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    const pointDifference = points - player.points;
    const now = new Date();
    
    // Update player's points
    const updatedPlayer = await db
      .update(players)
      .set({ points, lastUpdated: now })
      .where(eq(players.id, playerId))
      .returning();

    // Record in history
    await db.insert(pointHistory).values({
      playerId,
      amount: pointDifference,
      reason: "Points manually set",
      timestamp: now,
      addedBy
    });

    return updatedPlayer[0];
  }

  async resetAllPoints(addedBy: string): Promise<number> {
    const allPlayers = await this.getAllPlayers();
    
    // Reset points for each player
    for (const player of allPlayers) {
      await this.resetPoints(player.id, addedBy);
    }
    
    return allPlayers.length;
  }

  // History operations
  async getPointHistory(playerId?: number): Promise<PointHistory[]> {
    if (playerId) {
      return await db
        .select()
        .from(pointHistory)
        .where(eq(pointHistory.playerId, playerId));
    }
    
    return await db.select().from(pointHistory);
  }
}

// Export an instance of DbStorage
export const dbStorage = new DbStorage();