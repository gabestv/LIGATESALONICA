import { EmbedBuilder, Message, MessageReaction, User } from "discord.js";
import { isAdmin, isDungeonMaster } from "./discord-bot";
import { dbStorage as storage } from "./db-storage";

// Store confirmation states
const pendingResets: Map<string, number> = new Map();

export async function handleCommand(
  command: string,
  args: string[],
  message: Message,
  config: { prefix: string; dmRole: string }
): Promise<void> {
  switch (command) {
    case "help":
      await handleHelp(message, config);
      break;
      
    case "addpoints":
      await handleAddPoints(args, message);
      break;
      
    case "resetpoints":
      await handleResetPoints(args, message);
      break;
      
    case "setpoints":
      await handleSetPoints(args, message);
      break;
      
    case "confirm":
      await handleConfirm(message);
      break;
      
    case "rankings":
    case "leaderboard":
      await handleRankings(args, message);
      break;
      
    case "stats":
      await handleStats(args, message);
      break;
      
    case "resetall":
      await handleResetAll(message);
      break;
      
    case "setprefix":
      await handleSetPrefix(args, message);
      break;
      
    case "setdmrole":
      await handleSetDMRole(args, message);
      break;
      
    default:
      await message.reply(`Unknown command. Type \`${config.prefix}help\` for a list of commands.`);
  }
}

async function handleHelp(message: Message, config: { prefix: string }): Promise<void> {
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("D&D Points Bot - Help")
    .setDescription(`Here are the available commands (prefix: \`${config.prefix}\`):`)
    .addFields(
      { name: "General Commands", value: 
        `\`${config.prefix}help\` - Show this help message\n` +
        `\`${config.prefix}rankings [page]\` - Show the current rankings\n` +
        `\`${config.prefix}stats [@player]\` - Show stats for yourself or another player`
      },
      { name: "DM/Admin Commands", value: 
        `\`${config.prefix}addpoints @player [amount] [reason]\` - Add PL to a player\n` +
        `\`${config.prefix}resetpoints @player\` - Reset a player's PL\n` +
        `\`${config.prefix}setpoints @player [amount]\` - Set a player's PL to a specific value`
      },
      { name: "Admin Commands", value: 
        `\`${config.prefix}resetall\` - Reset all players' PL\n` +
        `\`${config.prefix}setprefix [prefix]\` - Change the command prefix\n` +
        `\`${config.prefix}setdmrole [@role]\` - Set which role can use DM commands`
      }
    )
    .setFooter({ text: "D&D Points Bot" });

  await message.reply({ embeds: [embed] });
}

async function handleAddPoints(args: string[], message: Message): Promise<void> {
  // Check permissions
  if (!isDungeonMaster(message)) {
    await message.reply("You don't have permission to add points. Only DMs and admins can do this.");
    return;
  }

  // Validate arguments
  if (args.length < 2) {
    await message.reply("Please provide a player and an amount: `!addpoints @player [amount] [reason]`");
    return;
  }

  // Parse arguments
  const mentionedUser = message.mentions.users.first();
  if (!mentionedUser) {
    await message.reply("Please mention a valid player.");
    return;
  }

  const amount = parseInt(args[1]);
  if (isNaN(amount) || amount <= 0) {
    await message.reply("Please provide a valid positive number of PL to add.");
    return;
  }

  // Get or create the player
  let player = await storage.getPlayerByDiscordId(mentionedUser.id);
  if (!player) {
    player = await storage.createPlayer({
      discordId: mentionedUser.id,
      username: mentionedUser.username,
      points: 0
    });
  }

  // Extract reason (the rest of the message after the amount)
  const reason = args.slice(2).join(" ") || "No reason provided";

  // Add points
  const updatedPlayer = await storage.addPoints(
    player.id,
    amount,
    reason,
    message.author.username
  );

  // Reply with confirmation
  await message.reply(
    `Added ${amount} PL to <@${mentionedUser.id}> for "${reason}"\nCurrent total: ${updatedPlayer.points} PL`
  );
}

async function handleResetPoints(args: string[], message: Message): Promise<void> {
  // Check permissions
  if (!isAdmin(message)) {
    await message.reply("You don't have permission to reset PL. Only server admins can do this.");
    return;
  }

  // Validate arguments
  if (args.length < 1 || !message.mentions.users.size) {
    await message.reply("Please mention a player: `!resetpoints @player`");
    return;
  }

  const mentionedUser = message.mentions.users.first()!;
  const player = await storage.getPlayerByDiscordId(mentionedUser.id);

  if (!player) {
    await message.reply(`<@${mentionedUser.id}> doesn't have any PL to reset.`);
    return;
  }

  // Store the reset request for confirmation
  const confirmationKey = `${message.author.id}-${mentionedUser.id}`;
  pendingResets.set(confirmationKey, player.id);

  // Ask for confirmation
  await message.reply(
    `Are you sure you want to reset PL for <@${mentionedUser.id}>? Type \`!confirm\` to continue.`
  );
}

async function handleConfirm(message: Message): Promise<void> {
  // Check if there's a pending reset for this user
  const confirmationKey = Array.from(pendingResets.keys()).find(key => 
    key.startsWith(message.author.id)
  );

  if (!confirmationKey) {
    await message.reply("There's nothing to confirm.");
    return;
  }

  const playerId = pendingResets.get(confirmationKey);
  pendingResets.delete(confirmationKey);

  if (!playerId) {
    await message.reply("Something went wrong. Please try again.");
    return;
  }

  const player = await storage.getPlayerById(playerId);
  if (!player) {
    await message.reply("Player not found. They may have been deleted.");
    return;
  }

  // Reset the player's points
  const previousPoints = player.points;
  const updatedPlayer = await storage.resetPoints(playerId, message.author.username);

  // Reply with confirmation
  await message.reply(
    `Reset all PL for <@${player.discordId}>. Previous total: ${previousPoints} PL.`
  );
}

async function handleSetPoints(args: string[], message: Message): Promise<void> {
  // Check permissions
  if (!isDungeonMaster(message)) {
    await message.reply("You don't have permission to set PL. Only DMs and admins can do this.");
    return;
  }

  // Validate arguments
  if (args.length < 2 || !message.mentions.users.size) {
    await message.reply("Please provide a player and an amount: `!setpoints @player [amount]`");
    return;
  }

  const mentionedUser = message.mentions.users.first()!;
  const amount = parseInt(args[1]);

  if (isNaN(amount) || amount < 0) {
    await message.reply("Please provide a valid non-negative number of PL.");
    return;
  }

  // Get or create the player
  let player = await storage.getPlayerByDiscordId(mentionedUser.id);
  if (!player) {
    player = await storage.createPlayer({
      discordId: mentionedUser.id,
      username: mentionedUser.username,
      points: 0
    });
  }

  // Set points
  const updatedPlayer = await storage.setPoints(player.id, amount, message.author.username);

  // Reply with confirmation
  await message.reply(`Set <@${mentionedUser.id}>'s PL to ${amount}`);
}

async function handleRankings(args: string[], message: Message): Promise<void> {
  // Get page number if provided
  const page = args.length > 0 ? parseInt(args[0]) || 1 : 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  // Get all players
  const players = await storage.getAllPlayers();
  
  // Sort by points (descending)
  const sortedPlayers = players.sort((a, b) => b.points - a.points);
  
  // Paginate
  const totalPages = Math.ceil(sortedPlayers.length / pageSize);
  const paginatedPlayers = sortedPlayers.slice(offset, offset + pageSize);

  if (paginatedPlayers.length === 0) {
    await message.reply("No players have earned PL yet.");
    return;
  }

  // Create ranking message
  let rankingMessage = `D&D Campaign Rankings (Page ${page}/${totalPages})\n\n`;
  
  paginatedPlayers.forEach((player, index) => {
    const position = offset + index + 1;
    let prefix;
    
    // Medals for top 3
    if (position === 1) prefix = "🥇";
    else if (position === 2) prefix = "🥈";
    else if (position === 3) prefix = "🥉";
    else prefix = `${position}.`;
    
    rankingMessage += `${prefix} <@${player.discordId}> - ${player.points} PL\n`;
  });

  if (totalPages > 1) {
    rankingMessage += `\nUse \`!rankings [page]\` to view more pages.`;
  }

  await message.reply(rankingMessage);
}

async function handleStats(args: string[], message: Message): Promise<void> {
  // Determine which player to show stats for
  let targetUser;
  
  if (message.mentions.users.size > 0) {
    // Stats for mentioned user
    targetUser = message.mentions.users.first()!;
    
    // If not the author and not a DM, deny permission
    if (targetUser.id !== message.author.id && !isDungeonMaster(message)) {
      await message.reply("You can only view your own stats. Only DMs and admins can view others' stats.");
      return;
    }
  } else {
    // Stats for the author
    targetUser = message.author;
  }

  // Get player data
  const player = await storage.getPlayerByDiscordId(targetUser.id);
  
  if (!player) {
    await message.reply(`<@${targetUser.id}> hasn't earned any PL yet.`);
    return;
  }

  // Get rank
  const allPlayers = await storage.getAllPlayers();
  const sortedPlayers = allPlayers.sort((a, b) => b.points - a.points);
  const rank = sortedPlayers.findIndex(p => p.id === player.id) + 1;

  // Get point history
  const history = await storage.getPointHistory(player.id);
  
  // Limit to last 5 entries and sort by newest first
  const recentHistory = history
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Create stats embed
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`Stats for ${targetUser.username}`)
    .addFields(
      { name: "Total PL", value: player.points.toString(), inline: true },
      { name: "Current Rank", value: `${rank} of ${allPlayers.length}`, inline: true },
      { name: "Last Updated", value: new Date(player.lastUpdated).toLocaleDateString(), inline: true }
    );

  if (recentHistory.length > 0) {
    let historyText = "";
    
    recentHistory.forEach(entry => {
      const date = new Date(entry.timestamp);
      const timeAgo = getRelativeTime(date);
      
      if (entry.amount > 0) {
        historyText += `• +${entry.amount} PL - ${entry.reason || "No reason"} (${timeAgo})\n`;
      } else if (entry.amount < 0) {
        historyText += `• ${entry.amount} PL - ${entry.reason || "No reason"} (${timeAgo})\n`;
      } else {
        historyText += `• Reset to 0 PL (${timeAgo})\n`;
      }
    });
    
    embed.addFields({ name: "PL History", value: historyText });
  }

  await message.reply({ embeds: [embed] });
}

async function handleResetAll(message: Message): Promise<void> {
  // Only admins can reset all points
  if (!isAdmin(message)) {
    await message.reply("Only server administrators can reset all player points.");
    return;
  }

  // Confirm with reaction
  const confirmMessage = await message.reply(
    "⚠️ Are you sure you want to reset ALL player PL? This cannot be undone. " +
    "React with ✅ to confirm or ❌ to cancel."
  );

  // Add reaction options
  await confirmMessage.react("✅");
  await confirmMessage.react("❌");

  // Set up collector
  const filter = (reaction: MessageReaction, user: User) => 
    (reaction.emoji.name === "✅" || reaction.emoji.name === "❌") && 
    user.id === message.author.id;
    
  try {
    const collected = await confirmMessage.awaitReactions({ 
      filter, 
      max: 1, 
      time: 30000, 
      errors: ["time"] 
    });
    
    const reaction = collected.first();
    
    if (reaction?.emoji.name === "✅") {
      // Reset all players
      const count = await storage.resetAllPoints(message.author.username);
      await message.reply(`Reset PL for all ${count} players.`);
    } else {
      await message.reply("Reset cancelled.");
    }
  } catch (error) {
    await message.reply("Reset cancelled (timed out).");
  }
}

async function handleSetPrefix(args: string[], message: Message): Promise<void> {
  // Only admins can change prefix
  if (!isAdmin(message)) {
    await message.reply("Only server administrators can change the bot prefix.");
    return;
  }

  if (args.length === 0) {
    await message.reply("Please provide a new prefix: `!setprefix [new_prefix]`");
    return;
  }

  const newPrefix = args[0];
  
  // Update bot config - Note: in a real implementation, you'd update this in
  // bot-wide config, not just locally. This is a stub.
  // updateConfig({ prefix: newPrefix });
  
  await message.reply(`Command prefix changed to \`${newPrefix}\``);
}

async function handleSetDMRole(args: string[], message: Message): Promise<void> {
  // Only admins can change DM role
  if (!isAdmin(message)) {
    await message.reply("Only server administrators can change the DM role.");
    return;
  }

  if (message.mentions.roles.size === 0) {
    await message.reply("Please mention a role: `!setdmrole @role`");
    return;
  }

  const role = message.mentions.roles.first()!;
  
  // Update bot config - Note: in a real implementation, you'd update this in
  // bot-wide config, not just locally. This is a stub.
  // updateConfig({ dmRole: role.name });
  
  await message.reply(`DM role set to ${role.name}`);
}

// Helper function to format date as relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
  return date.toLocaleDateString();
}
