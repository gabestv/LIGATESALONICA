import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PlayerAvatar from "@/components/player-avatar";
import { Player, PointHistory } from "@shared/schema";

export default function PlayerStats() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const { data: pointHistory = [] } = useQuery<PointHistory[]>({
    queryKey: ["/api/point-history", selectedPlayerId],
    enabled: selectedPlayerId !== null,
  });

  const filteredPlayers = searchQuery 
    ? players.filter(player => 
        player.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : players;

  // Calculate player rank
  const getPlayerRank = (playerId: number): number => {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    return sortedPlayers.findIndex(p => p.id === playerId) + 1;
  };

  const playerHistory = pointHistory
    .filter(history => history.playerId === selectedPlayerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-discord-text-header">Player Statistics</h1>
        <p className="text-discord-text-muted">Detailed point information for individual players</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-discord-secondary border-none">
            <CardHeader>
              <CardTitle className="text-discord-text-header text-lg">Select a Player</CardTitle>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search players..."
                  className="bg-discord-tertiary border-none text-discord-text-normal"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-discord-text-muted" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredPlayers.length === 0 ? (
                  <p className="text-discord-text-muted text-center py-4">No players found</p>
                ) : (
                  filteredPlayers.map(player => (
                    <Button
                      key={player.id}
                      variant="ghost"
                      className={`w-full justify-start px-2 ${selectedPlayerId === player.id 
                        ? 'bg-discord-accent bg-opacity-20 text-discord-accent' 
                        : 'hover:bg-discord-tertiary'}`}
                      onClick={() => setSelectedPlayerId(player.id)}
                    >
                      <PlayerAvatar username={player.username} size="sm" className="mr-2" />
                      <span className="truncate">{player.username}</span>
                      <span className="ml-auto text-discord-text-muted">{player.points} pts</span>
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {!selectedPlayer ? (
            <Card className="bg-discord-secondary border-none h-full flex items-center justify-center">
              <CardContent className="text-center p-6">
                <p className="text-discord-text-muted">Select a player to view their stats</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="bg-discord-secondary border-none">
                <CardHeader className="flex flex-row items-center gap-4">
                  <PlayerAvatar username={selectedPlayer.username} size="lg" />
                  <div>
                    <CardTitle className="text-discord-text-header">
                      {selectedPlayer.username}
                    </CardTitle>
                    <p className="text-discord-text-muted">
                      Rank: {getPlayerRank(selectedPlayer.id)} of {players.length}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-discord-text-header">
                      {selectedPlayer.points}
                    </p>
                    <p className="text-discord-text-muted text-sm">Total Points</p>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-discord-secondary border-none">
                <CardHeader>
                  <CardTitle className="text-discord-text-header text-lg">Points History</CardTitle>
                </CardHeader>
                <CardContent>
                  {playerHistory.length === 0 ? (
                    <p className="text-discord-text-muted text-center py-4">No point history available</p>
                  ) : (
                    <div className="space-y-3">
                      {playerHistory.map(record => {
                        const date = new Date(record.timestamp);
                        const dateString = date.toLocaleDateString();
                        const timeString = date.toLocaleTimeString();
                        
                        return (
                          <div key={record.id} className="flex items-start border-b border-discord-tertiary pb-3 last:border-0">
                            <div className={`px-2 py-1 rounded-md text-white ${record.amount > 0 ? 'bg-discord-accent' : 'bg-discord-error'} min-w-14 text-center mr-3`}>
                              {record.amount > 0 ? `+${record.amount}` : record.amount}
                            </div>
                            <div className="flex-1">
                              <p>{record.reason || 'No reason provided'}</p>
                              <p className="text-discord-text-muted text-xs">
                                Added by: {record.addedBy} • {dateString} {timeString}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
