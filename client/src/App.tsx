import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import Home from "@/pages/home";
import Commands from "@/pages/commands";
import Leaderboard from "@/pages/leaderboard";
import PlayerStats from "@/pages/player-stats";
import Help from "@/pages/help";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/commands" component={Commands} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/player-stats" component={PlayerStats} />
      <Route path="/help" component={Help} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-discord-primary text-discord-text-normal min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Router />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
