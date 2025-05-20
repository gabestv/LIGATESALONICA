import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LeaderboardTable from "@/components/leaderboard-table";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Player } from "@shared/schema";

export default function Leaderboard() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: players = [], isLoading, refetch } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const totalPages = Math.ceil(players.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedPlayers = players.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-discord-text-header">D&D Campaign Leaderboard</h1>
          <p className="text-discord-text-muted">Players ranked by total points earned</p>
        </div>
        <Button 
          variant="outline" 
          className="bg-discord-tertiary border-none text-discord-text-normal" 
          onClick={() => refetch()}
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </header>

      {isLoading ? (
        <Card className="bg-discord-secondary border-none">
          <CardContent className="p-4 flex justify-center items-center h-60">
            <p>Loading leaderboard data...</p>
          </CardContent>
        </Card>
      ) : players.length === 0 ? (
        <Card className="bg-discord-secondary border-none">
          <CardContent className="p-4 flex justify-center items-center h-60">
            <p>No player data available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <LeaderboardTable players={paginatedPlayers} />
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                className="bg-discord-tertiary border-none text-discord-text-normal"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} className="mr-2" />
                Previous
              </Button>
              
              <span className="text-discord-text-muted">
                Page {page} of {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                className="bg-discord-tertiary border-none text-discord-text-normal"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </>
      )}

      <Card className="bg-discord-secondary border-none mt-6">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-discord-text-header mb-2">About the Leaderboard</h3>
          <p className="mb-2">Players earn points through various activities in your D&D campaign:</p>
          <ul className="list-disc list-inside pl-2 space-y-1 text-discord-text-muted">
            <li>Creative problem-solving</li>
            <li>Roleplaying character decisions</li>
            <li>Memorable moments during gameplay</li>
            <li>Collaborative storytelling</li>
            <li>And more - points are awarded at the DM's discretion</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
