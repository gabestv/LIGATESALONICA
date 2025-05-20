import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PlayerAvatarProps {
  username: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function PlayerAvatar({ username, size = "md", className = "" }: PlayerAvatarProps) {
  // Get the first letter of the username for the fallback
  const firstLetter = username.charAt(0).toUpperCase();
  
  // Generate a consistent color based on the username
  const generateColorFromUsername = (username: string) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use the hash to generate a hue between 0 and 360
    const hue = Math.abs(hash % 360);
    
    // Return an HSL color with fixed saturation and lightness
    return `hsl(${hue}, 70%, 30%)`;
  };
  
  const backgroundColor = generateColorFromUsername(username);
  
  // Define size classes
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base"
  };
  
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback style={{ backgroundColor }}>{firstLetter}</AvatarFallback>
    </Avatar>
  );
}
