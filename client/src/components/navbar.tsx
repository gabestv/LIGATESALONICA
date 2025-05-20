import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/commands", label: "Commands" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/player-stats", label: "Player Stats" },
  { href: "/help", label: "Help" }
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-discord-tertiary border-b border-discord-secondary">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-discord-accent flex items-center justify-center text-white font-bold text-sm">
              D&D
            </div>
            <span className="ml-2 text-xl font-semibold text-discord-text-header hidden sm:block">
              D&D Points Bot
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {LINKS.map(link => (
            <Link key={link.href} href={link.href}>
              <div className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                location === link.href
                  ? "bg-discord-accent text-white"
                  : "text-discord-text-normal hover:bg-discord-secondary"
              }`}>
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-discord-text-normal">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-discord-secondary border-discord-tertiary pt-12">
              <div className="space-y-4 flex flex-col">
                {LINKS.map(link => (
                  <Link key={link.href} href={link.href}>
                    <div 
                      className={`px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                        location === link.href
                          ? "bg-discord-accent text-white"
                          : "text-discord-text-normal hover:bg-discord-primary"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </div>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
