import { type Player } from "@shared/schema";
import PlayerAvatar from "./player-avatar";

interface LeaderboardTableProps {
  players: Player[];
}

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  const getRankClass = (index: number): string => {
    switch (index) {
      case 0: return "text-discord-accent font-bold"; // 1st
      case 1: return "text-gray-400 font-bold"; // 2nd
      case 2: return "text-yellow-600 font-bold"; // 3rd
      default: return "font-bold"; // rest
    }
  };

  // Format date to display as relative time (e.g., "Today", "Yesterday", "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-discord-secondary rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 bg-discord-tertiary py-2 px-4 border-b border-discord-primary">
        <div className="col-span-1 font-medium text-discord-text-muted">#</div>
        <div className="col-span-7 font-medium text-discord-text-muted">Player</div>
        <div className="col-span-2 font-medium text-discord-text-muted">PL</div>
        <div className="col-span-2 font-medium text-discord-text-muted text-right">Last Update</div>
      </div>
      
      {sortedPlayers.length === 0 ? (
        <div className="py-8 text-center text-discord-text-muted">
          No players found.
        </div>
      ) : (
        sortedPlayers.map((player, index) => (
          <div 
            key={player.id} 
            className={`grid grid-cols-12 py-3 px-4 items-center border-b border-discord-tertiary ${
              index === 0 ? 'bg-gradient-to-r from-discord-accent/10 to-transparent' : ''
            }`}
          >
            <div className={`col-span-1 ${getRankClass(index)}`}>{index + 1}</div>
            <div className="col-span-7 flex items-center">
              <PlayerAvatar username={player.username} className="mr-2" />
              <span className="discord-mention">@{player.username}</span>
            </div>
            <div className="col-span-2 font-bold text-discord-text-header">{player.points}</div>
            <div className="col-span-2 text-discord-text-muted text-sm text-right">
              {formatRelativeTime(player.lastUpdated)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
