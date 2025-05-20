import { Client, GatewayIntentBits, Events } from "discord.js";
import { handleCommand } from "./discord-commands";
import { dbStorage as storage } from "./db-storage";
import { log } from "./vite";

// Default configuration
let config = {
  prefix: "!",
  dmRole: "Dungeon Master",
  adminOnly: false,
};

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// Initialize bot and connect to Discord
export async function setupDiscordBot(): Promise<void> {
  // Use environment variable for bot token
  const token = process.env.DISCORD_BOT_TOKEN;
  
  if (!token) {
    log("WARNING: No Discord bot token provided. Bot will not connect to Discord.", "discord");
    return;
  }

  try {
    // Only continue with bot setup if a valid token is provided
    if (token && token !== "your_discord_bot_token_here") {
      // Register event handlers
      client.once(Events.ClientReady, c => {
        log(`Bot logged in as ${c.user.tag}`, "discord");
      });

      client.on(Events.MessageCreate, async message => {
        // Ignore bots and messages that don't start with the prefix
        if (message.author.bot || !message.content.startsWith(config.prefix)) return;

        // Extract command name and arguments
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        try {
          // Process the command
          await handleCommand(commandName, args, message, config);
        } catch (error) {
          console.error("Error handling command:", error);
          await message.reply("An error occurred while processing your command.");
        }
      });

      // Login to Discord
      await client.login(token);
      
      log("Discord bot started successfully", "discord");
    } else {
      log("No valid Discord bot token provided. Bot will not connect to Discord.", "discord");
    }
  } catch (error) {
    log(`Failed to start Discord bot: ${error}`, "discord");
    // Don't throw the error, just log it to prevent the entire app from failing
  }
}

// Utility function to check if a user has admin permissions
export function isAdmin(message: any): boolean {
  return message.member && message.member.permissions.has("Administrator");
}

// Check if a user has DM role
export function isDungeonMaster(message: any): boolean {
  const dmRole = message.guild?.roles.cache.find((r: any) => r.name === config.dmRole);
  return message.member && (
    message.member.permissions.has("Administrator") || 
    (dmRole && message.member.roles.cache.has(dmRole.id))
  );
}

// Update bot configuration
export function updateConfig(newConfig: Partial<typeof config>): void {
  config = { ...config, ...newConfig };
}

// Get the current bot configuration
export function getConfig(): typeof config {
  return { ...config };
}

// Export the client for use in other files
export { client };
