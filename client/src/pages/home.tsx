import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CommandCard from "@/components/command-card";
import LeaderboardTable from "@/components/leaderboard-table";
import ActivityFeed from "@/components/activity-feed";
import HelpPanel from "@/components/help-panel";
import { Player, PointHistory } from "@shared/schema";

export default function Home() {
  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const { data: activities = [] } = useQuery<PointHistory[]>({
    queryKey: ["/api/point-history"],
  });

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-discord-accent flex items-center justify-center text-white font-bold text-xl mr-4">
              D&D
            </div>
            <div>
              <h1 className="text-2xl font-bold text-discord-text-header">D&D Points Bot</h1>
              <p className="text-discord-text-muted">Track player points and rankings for your D&D campaign</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="bg-discord-secondary py-1 px-3 rounded-full text-sm text-discord-text-normal">Online</span>
          </div>
        </div>
        <Card className="bg-discord-secondary border-none">
          <CardContent className="pt-6">
            <p className="mb-2">Welcome to the D&D Points Bot! This bot helps you track and rank your D&D players based on points they earn during gameplay.</p>
            <p>Use <span className="command-syntax">!help</span> to see all available commands.</p>
          </CardContent>
        </Card>
      </header>

      <section>
        <h2 className="text-xl font-bold text-discord-text-header flex items-center mb-4">
          Popular Commands
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <CommandCard
            title="Add Points"
            syntax="!addpoints @player [amount] [reason]"
            example="!addpoints @Gandalf 5 Solved the riddle"
            response="Added 5 points to @Gandalf for 'Solved the riddle'\nCurrent total: 25 points"
            note="Only DMs and admins can add points."
          />
          <CommandCard
            title="View Rankings"
            syntax="!rankings [page]"
            example="!rankings"
            response="D&D Campaign Rankings (Page 1/1)\n🥇 @Gandalf - 25 points\n🥈 @Aragorn - 20 points\n🥉 @Legolas - 18 points"
            note="Available to all server members."
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-discord-text-header flex items-center mb-4">
          Current Leaderboard
        </h2>
        <LeaderboardTable players={players.slice(0, 5)} />
        <div className="text-center mt-3">
          <a href="/leaderboard" className="bg-discord-tertiary hover:bg-discord-secondary transition-colors text-discord-text-normal py-2 px-4 rounded-md text-sm inline-block">
            View Full Leaderboard
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-discord-text-header flex items-center mb-4">
          Recent Activity
        </h2>
        <ActivityFeed activities={activities.slice(0, 4)} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-discord-text-header flex items-center mb-4">
          Help & Documentation
        </h2>
        <HelpPanel />
      </section>

      <footer className="bg-discord-tertiary rounded-lg p-4 text-center text-sm text-discord-text-muted">
        <p className="mb-2">D&D Points Bot © 2023 | <a href="/help" className="text-discord-text-link hover:underline">View Documentation</a></p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="bg-discord-secondary py-1 px-2 rounded text-xs">DM: Full Access</span>
          <span className="bg-discord-secondary py-1 px-2 rounded text-xs">Admin: Full Access</span>
          <span className="bg-discord-secondary py-1 px-2 rounded text-xs">Player: View Rankings & Stats</span>
        </div>
      </footer>
    </div>
  );
}
