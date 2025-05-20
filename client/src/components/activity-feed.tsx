import { PlusCircle, Trash2 } from "lucide-react";
import { PointHistory } from "@shared/schema";

interface ActivityFeedProps {
  activities: PointHistory[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  // Format date to display as "Today at 10:23 AM" or "Yesterday at 8:42 PM"
  const formatActivityTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    if (isToday) return `Today at ${timeString}`;
    if (isYesterday) return `Yesterday at ${timeString}`;
    return `${date.toLocaleDateString()} at ${timeString}`;
  };

  return (
    <div className="bg-discord-secondary rounded-lg">
      {activities.length === 0 ? (
        <div className="p-6 text-center text-discord-text-muted">
          No recent activity.
        </div>
      ) : (
        activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`border-discord-tertiary p-3 ${
              index !== activities.length - 1 ? 'border-b' : ''
            }`}
          >
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${activity.amount > 0 ? 'bg-discord-accent' : 'bg-discord-error'} flex items-center justify-center text-white mr-3 flex-shrink-0`}>
                {activity.amount > 0 ? (
                  <PlusCircle className="w-4 h-4" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </div>
              <div>
                <p>
                  <span className="font-medium text-discord-text-header">{activity.addedBy}</span>
                  {activity.amount > 0 
                    ? ` added ${activity.amount} points` 
                    : ` reset points`} 
                  for <span className="discord-mention">@Player{activity.playerId}</span>
                </p>
                {activity.reason && (
                  <p className="text-sm text-discord-text-muted">Reason: {activity.reason}</p>
                )}
                <p className="text-xs text-discord-text-muted mt-1">
                  {formatActivityTime(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
