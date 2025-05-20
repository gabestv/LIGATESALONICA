import { dbStorage } from "../server/db-storage";

async function addSampleData() {
  try {
    console.log("Adding sample D&D players and PL history...");
    
    // Add sample players
    const players = [
      { discordId: "123456789012345678", username: "Gandalf", points: 25 },
      { discordId: "223456789012345678", username: "Aragorn", points: 20 },
      { discordId: "323456789012345678", username: "Legolas", points: 18 },
      { discordId: "423456789012345678", username: "Gimli", points: 16 },
      { discordId: "523456789012345678", username: "Frodo", points: 14 },
      { discordId: "623456789012345678", username: "Samwise", points: 12 },
      { discordId: "723456789012345678", username: "Boromir", points: 10 },
      { discordId: "823456789012345678", username: "Pippin", points: 8 },
      { discordId: "923456789012345678", username: "Merry", points: 7 },
      { discordId: "023456789012345678", username: "Sauron", points: 0 }
    ];
    
    // Create players
    const createdPlayers: Array<{ id: number; username: string }> = [];
    
    for (const player of players) {
      try {
        const existingPlayer = await dbStorage.getPlayerByDiscordId(player.discordId);
        
        if (!existingPlayer) {
          const newPlayer = await dbStorage.createPlayer(player);
          console.log(`Created player: ${newPlayer.username}`);
          createdPlayers.push({ id: newPlayer.id, username: newPlayer.username });
        } else {
          console.log(`Player ${player.username} already exists`);
          createdPlayers.push({ id: existingPlayer.id, username: existingPlayer.username });
        }
      } catch (error) {
        console.error(`Error creating player ${player.username}:`, error);
      }
    }
    
    // Add sample point history
    if (createdPlayers.length > 0) {
      const now = new Date();
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const pointHistoryEntries = [
        { playerId: createdPlayers[0].id, amount: 5, reason: "Solved the riddle", addedBy: "DM" },
        { playerId: createdPlayers[0].id, amount: 10, reason: "Defeated the Balrog", addedBy: "DM" },
        { playerId: createdPlayers[0].id, amount: 10, reason: "Creative spell usage", addedBy: "DM" },
        
        { playerId: createdPlayers[1].id, amount: 5, reason: "Leadership in battle", addedBy: "DM" },
        { playerId: createdPlayers[1].id, amount: 10, reason: "Roleplaying king's return", addedBy: "DM" },
        { playerId: createdPlayers[1].id, amount: 5, reason: "Tracking skills", addedBy: "DM" },
        
        { playerId: createdPlayers[2].id, amount: 8, reason: "Accurate archery", addedBy: "DM" },
        { playerId: createdPlayers[2].id, amount: 10, reason: "Scouting enemy territory", addedBy: "DM" },
        
        { playerId: createdPlayers[3].id, amount: 6, reason: "Dwarven resilience", addedBy: "DM" },
        { playerId: createdPlayers[3].id, amount: 10, reason: "Axe expertise", addedBy: "DM" },
        
        { playerId: createdPlayers[4].id, amount: 14, reason: "Ring bearer's burden", addedBy: "DM" },
        
        { playerId: createdPlayers[5].id, amount: 12, reason: "Unwavering loyalty", addedBy: "DM" },
        
        { playerId: createdPlayers[6].id, amount: 10, reason: "Defending the hobbits", addedBy: "DM" },
        
        { playerId: createdPlayers[7].id, amount: 8, reason: "Distracting the enemy", addedBy: "DM" },
        
        { playerId: createdPlayers[8].id, amount: 7, reason: "Rohan alliance", addedBy: "DM" },
        
        // Sauron has 0 because he's evil!
      ];
      
      for (const entry of pointHistoryEntries) {
        try {
          await dbStorage.addPoints(
            entry.playerId,
            entry.amount,
            entry.reason,
            entry.addedBy
          );
          console.log(`Added ${entry.amount} PL to ${createdPlayers.find(p => p.id === entry.playerId)?.username} for "${entry.reason}"`);
        } catch (error) {
          console.error(`Error adding PL for ${createdPlayers.find(p => p.id === entry.playerId)?.username}:`, error);
        }
      }
    }
    
    console.log("Sample data added successfully!");
  } catch (error) {
    console.error("Error adding sample data:", error);
  } finally {
    process.exit(0);
  }
}

// Execute the function
addSampleData();