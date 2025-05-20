import { Card, CardContent } from "@/components/ui/card";

export default function HelpPanel() {
  return (
    <Card className="bg-discord-secondary border-none">
      <CardContent className="p-4 pt-6">
        <p className="mb-4">The D&D Points Bot allows you to track and manage points for your D&D campaign players. Here are all available commands:</p>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-discord-text-header font-semibold mb-1">General Commands</h3>
            <ul className="space-y-2">
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!help</span>
                <span>Shows this help message with all available commands</span>
              </li>
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!rankings [page]</span>
                <span>Shows the current player rankings (optional page number)</span>
              </li>
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!stats [@player]</span>
                <span>Shows detailed stats for a player (yourself if no player mentioned)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-discord-text-header font-semibold mb-1">DM/Admin Commands</h3>
            <ul className="space-y-2">
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!addpoints</span>
                <span>Adds points to a player: <span className="command-syntax">!addpoints @player [amount] [reason]</span></span>
              </li>
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!resetpoints</span>
                <span>Resets points for a player: <span className="command-syntax">!resetpoints @player</span></span>
              </li>
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!setpoints</span>
                <span>Sets exact point value for a player: <span className="command-syntax">!setpoints @player [amount]</span></span>
              </li>
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!resetall</span>
                <span>Resets points for all players (admin only): <span className="command-syntax">!resetall</span></span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-discord-text-header font-semibold mb-1">Configuration Commands</h3>
            <ul className="space-y-2">
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!setprefix</span>
                <span>Changes the bot command prefix: <span className="command-syntax">!setprefix [new_prefix]</span></span>
              </li>
              <li className="flex">
                <span className="command-syntax mr-2 min-w-[120px]">!setdmrole</span>
                <span>Sets which role can use DM commands: <span className="command-syntax">!setdmrole [@role]</span></span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
