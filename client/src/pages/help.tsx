import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HelpPanel from "@/components/help-panel";

export default function Help() {
  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-discord-text-header">Help & Documentation</h1>
        <p className="text-discord-text-muted">Everything you need to know about the D&D Points Bot</p>
      </header>

      <Tabs defaultValue="commands" className="w-full">
        <TabsList className="bg-discord-tertiary border-none w-full mb-4">
          <TabsTrigger value="commands" className="data-[state=active]:bg-discord-accent data-[state=active]:text-white">
            Commands
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-discord-accent data-[state=active]:text-white">
            Permissions
          </TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-discord-accent data-[state=active]:text-white">
            FAQ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="commands">
          <HelpPanel />
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card className="bg-discord-secondary border-none">
            <CardContent className="p-4 pt-6">
              <h2 className="text-lg font-semibold text-discord-text-header mb-4">Permission Levels</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-discord-text-header flex items-center">
                    <span className="bg-discord-accent w-4 h-4 rounded-full mr-2"></span>
                    Server Admin
                  </h3>
                  <div className="ml-6 mt-2 space-y-2">
                    <p>Server admins have full access to all bot commands, including:</p>
                    <ul className="list-disc list-inside pl-2 text-discord-text-muted">
                      <li>Adding points to players</li>
                      <li>Resetting points for any player</li>
                      <li>Setting exact point values</li>
                      <li>Viewing any player's stats</li>
                      <li>Configuring bot settings</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-discord-text-header flex items-center">
                    <span className="bg-discord-success w-4 h-4 rounded-full mr-2"></span>
                    Dungeon Master (DM)
                  </h3>
                  <div className="ml-6 mt-2 space-y-2">
                    <p>DMs have access to most bot commands:</p>
                    <ul className="list-disc list-inside pl-2 text-discord-text-muted">
                      <li>Adding points to players</li>
                      <li>Viewing any player's stats</li>
                      <li>Viewing rankings</li>
                    </ul>
                    <p className="text-discord-text-muted text-sm">
                      Note: The DM role is assigned automatically to anyone with the "Dungeon Master" role in your server.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-discord-text-header flex items-center">
                    <span className="bg-discord-tertiary w-4 h-4 rounded-full mr-2"></span>
                    Players
                  </h3>
                  <div className="ml-6 mt-2 space-y-2">
                    <p>Regular players have limited access:</p>
                    <ul className="list-disc list-inside pl-2 text-discord-text-muted">
                      <li>Viewing the leaderboard/rankings</li>
                      <li>Viewing their own stats</li>
                      <li>Using the help command</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card className="bg-discord-secondary border-none">
            <CardContent className="p-4 pt-6">
              <h2 className="text-lg font-semibold text-discord-text-header mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-discord-text-header">How do I add the bot to my server?</h3>
                  <p className="text-discord-text-muted mt-1">
                    Use the invitation link from our website to add the bot to your Discord server. Make sure you have the "Manage Server" permission.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-discord-text-header">How do points work?</h3>
                  <p className="text-discord-text-muted mt-1">
                    Points are awarded by DMs or admins to players for various achievements during gameplay. These could include good roleplaying, solving puzzles, or any other contribution to the game that deserves recognition.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-discord-text-header">Can I customize the bot's prefix?</h3>
                  <p className="text-discord-text-muted mt-1">
                    Yes! Server admins can change the default prefix (!) using the <span className="command-syntax">!setprefix [new_prefix]</span> command.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-discord-text-header">Can I reset all points for everyone?</h3>
                  <p className="text-discord-text-muted mt-1">
                    Yes, admins can use the <span className="command-syntax">!resetall</span> command to reset points for all players. This is useful when starting a new campaign.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-discord-text-header">Is there a limit to how many points can be given?</h3>
                  <p className="text-discord-text-muted mt-1">
                    No, there's no built-in limit. However, we recommend establishing guidelines within your group to maintain fairness.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
