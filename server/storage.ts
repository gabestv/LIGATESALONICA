import { users, type User, type InsertUser } from "@shared/schema";
import { type Player, type InsertPlayer, type PointHistory } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations (from original interface)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player operations
  getAllPlayers(): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  getPlayerByDiscordId(discordId: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  
  // Points operations
  addPoints(playerId: number, amount: number, reason: string, addedBy: string): Promise<Player>;
  resetPoints(playerId: number, addedBy: string): Promise<Player>;
  setPoints(playerId: number, points: number, addedBy: string): Promise<Player>;
  resetAllPoints(addedBy: string): Promise<number>;
  
  // History operations
  getPointHistory(playerId?: number): Promise<PointHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private players: Map<number, Player>;
  private pointHistory: Map<number, PointHistory>;
  private userIdCounter: number;
  private playerIdCounter: number;
  private historyIdCounter: number;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.pointHistory = new Map();
    this.userIdCounter = 1;
    this.playerIdCounter = 1;
    this.historyIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Player operations
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }
  
  async getPlayerById(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }
  
  async getPlayerByDiscordId(discordId: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(
      (player) => player.discordId === discordId,
    );
  }
  
  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = this.playerIdCounter++;
    const now = new Date();
    const player: Player = { 
      ...insertPlayer, 
      id, 
      points: insertPlayer.points || 0,
      lastUpdated: now 
    };
    this.players.set(id, player);
    return player;
  }
  
  // Points operations
  async addPoints(playerId: number, amount: number, reason: string, addedBy: string): Promise<Player> {
    const player = await this.getPlayerById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }
    
    const now = new Date();
    const updatedPlayer: Player = {
      ...player,
      points: player.points + amount,
      lastUpdated: now
    };
    
    this.players.set(playerId, updatedPlayer);
    
    // Record in history
    const historyId = this.historyIdCounter++;
    const historyEntry: PointHistory = {
      id: historyId,
      playerId,
      amount,
      reason,
      timestamp: now,
      addedBy
    };
    
    this.pointHistory.set(historyId, historyEntry);
    
    return updatedPlayer;
  }
  
  async resetPoints(playerId: number, addedBy: string): Promise<Player> {
    const player = await this.getPlayerById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }
    
    const now = new Date();
    const updatedPlayer: Player = {
      ...player,
      points: 0,
      lastUpdated: now
    };
    
    this.players.set(playerId, updatedPlayer);
    
    // Record in history
    const historyId = this.historyIdCounter++;
    const historyEntry: PointHistory = {
      id: historyId,
      playerId,
      amount: -player.points, // Negative amount to show reset
      reason: "Points reset",
      timestamp: now,
      addedBy
    };
    
    this.pointHistory.set(historyId, historyEntry);
    
    return updatedPlayer;
  }
  
  async setPoints(playerId: number, points: number, addedBy: string): Promise<Player> {
    const player = await this.getPlayerById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }
    
    const pointDifference = points - player.points;
    const now = new Date();
    const updatedPlayer: Player = {
      ...player,
      points,
      lastUpdated: now
    };
    
    this.players.set(playerId, updatedPlayer);
    
    // Record in history
    const historyId = this.historyIdCounter++;
    const historyEntry: PointHistory = {
      id: historyId,
      playerId,
      amount: pointDifference,
      reason: "Points manually set",
      timestamp: now,
      addedBy
    };
    
    this.pointHistory.set(historyId, historyEntry);
    
    return updatedPlayer;
  }
  
  async resetAllPoints(addedBy: string): Promise<number> {
    const players = await this.getAllPlayers();
    
    // Reset each player's points
    for (const player of players) {
      await this.resetPoints(player.id, addedBy);
    }
    
    return players.length;
  }
  
  // History operations
  async getPointHistory(playerId?: number): Promise<PointHistory[]> {
    const allHistory = Array.from(this.pointHistory.values());
    
    if (playerId) {
      return allHistory.filter(entry => entry.playerId === playerId);
    }
    
    return allHistory;
  }
}

export const storage = new MemStorage();
