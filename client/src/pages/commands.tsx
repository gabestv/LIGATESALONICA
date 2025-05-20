import { Card, CardContent } from "@/components/ui/card";
import CommandCard from "@/components/command-card";

export default function Commands() {
  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-discord-text-header">Bot Commands</h1>
        <p className="text-discord-text-muted">Complete list of available commands for the D&D Points Bot</p>
      </header>

      <section>
        <h2 className="text-xl font-bold text-discord-text-header mb-4">General Commands</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <CommandCard
            title="Help"
            syntax="!help"
            example="!help"
            response="Displays a list of all available commands and their usage"
            note="Available to all server members."
          />
          
          <CommandCard
            title="View Rankings"
            syntax="!rankings [page]"
            example="!rankings"
            response="D&D Campaign Rankings (Page 1/1)\n🥇 @Gandalf - 25 points\n🥈 @Aragorn - 20 points\n🥉 @Legolas - 18 points"
            note="Available to all server members."
          />
          
          <CommandCard
            title="Player Stats"
            syntax="!stats [@player]"
            example="!stats @Gandalf"
            response="Stats for @Gandalf\nTotal Points: 25\nCurrent Rank: 1 of 5\nPoints History:\n• +5 pts - Solved the riddle (Today)\n• +10 pts - Defeated the Balrog (Yesterday)"
            note="Players can view their own stats or DM can view anyone's stats."
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-discord-text-header mb-4">DM & Admin Commands</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <CommandCard
            title="Add Points"
            syntax="!addpoints @player [amount] [reason]"
            example="!addpoints @Gandalf 5 Solved the riddle"
            response="Added 5 points to @Gandalf for 'Solved the riddle'\nCurrent total: 25 points"
            note="Only DMs and admins can add points."
          />
          
          <CommandCard
            title="Reset Points"
            syntax="!resetpoints @player"
            example="!resetpoints @Gimli"
            response="Are you sure you want to reset points for @Gimli? Type !confirm to continue."
            note="Server admin permission required."
          />
          
          <CommandCard
            title="Set Points"
            syntax="!setpoints @player [amount]"
            example="!setpoints @Frodo 15"
            response="Set @Frodo's points to 15"
            note="Only DMs and admins can set points."
          />
        </div>
      </section>

      <Card className="bg-discord-secondary border-none">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-discord-text-header mb-2">Command Permissions</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-discord-tertiary px-2 py-1 rounded text-xs mr-2 mt-0.5">DM/Admin</span>
              <span>Full access to all commands, including adding, resetting, and setting points</span>
            </li>
            <li className="flex items-start">
              <span className="bg-discord-tertiary px-2 py-1 rounded text-xs mr-2 mt-0.5">Player</span>
              <span>Can only view rankings and their own stats</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
