import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbStorage as storage } from "./db-storage";
import { setupDiscordBot } from "./discord-bot";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup Discord Bot (this will connect to Discord and start listening)
  await setupDiscordBot();

  // API Routes
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Failed to retrieve players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const player = await storage.getPlayerById(id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      console.error("Error fetching player:", error);
      res.status(500).json({ message: "Failed to retrieve player" });
    }
  });

  app.get("/api/point-history", async (req, res) => {
    try {
      const playerId = req.query.playerId ? parseInt(req.query.playerId as string) : undefined;
      const history = await storage.getPointHistory(playerId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching point history:", error);
      res.status(500).json({ message: "Failed to retrieve point history" });
    }
  });

  app.post("/api/players", async (req, res) => {
    const schema = z.object({
      discordId: z.string(),
      username: z.string(),
      points: z.number().optional()
    });

    try {
      const validatedData = schema.parse(req.body);
      
      // Check if player already exists
      const existingPlayer = await storage.getPlayerByDiscordId(validatedData.discordId);
      if (existingPlayer) {
        return res.status(409).json({ message: "Player already exists" });
      }
      
      const newPlayer = await storage.createPlayer({
        discordId: validatedData.discordId,
        username: validatedData.username,
        points: validatedData.points || 0
      });
      
      res.status(201).json(newPlayer);
    } catch (error) {
      console.error("Error creating player:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid player data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create player" });
    }
  });

  app.post("/api/points/add", async (req, res) => {
    const schema = z.object({
      playerId: z.number(),
      amount: z.number().positive(),
      reason: z.string().optional(),
      addedBy: z.string()
    });

    try {
      const validatedData = schema.parse(req.body);
      
      // Check if player exists
      const player = await storage.getPlayerById(validatedData.playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Add points
      const updatedPlayer = await storage.addPoints(
        validatedData.playerId,
        validatedData.amount,
        validatedData.reason || "",
        validatedData.addedBy
      );
      
      res.json(updatedPlayer);
    } catch (error) {
      console.error("Error adding points:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid points data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add points" });
    }
  });

  app.post("/api/points/reset", async (req, res) => {
    const schema = z.object({
      playerId: z.number(),
      addedBy: z.string()
    });

    try {
      const validatedData = schema.parse(req.body);
      
      // Check if player exists
      const player = await storage.getPlayerById(validatedData.playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Reset points
      const updatedPlayer = await storage.resetPoints(
        validatedData.playerId, 
        validatedData.addedBy
      );
      
      res.json(updatedPlayer);
    } catch (error) {
      console.error("Error resetting points:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reset data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to reset points" });
    }
  });

  app.post("/api/points/set", async (req, res) => {
    const schema = z.object({
      playerId: z.number(),
      points: z.number().nonnegative(),
      addedBy: z.string()
    });

    try {
      const validatedData = schema.parse(req.body);
      
      // Check if player exists
      const player = await storage.getPlayerById(validatedData.playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Set points
      const updatedPlayer = await storage.setPoints(
        validatedData.playerId,
        validatedData.points,
        validatedData.addedBy
      );
      
      res.json(updatedPlayer);
    } catch (error) {
      console.error("Error setting points:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid points data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to set points" });
    }
  });

  return httpServer;
}
