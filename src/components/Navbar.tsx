import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Clock, Calendar, Bot, ChevronDown, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onGetStartedClick: () => void;
}

const Navbar = ({ onGetStartedClick }: NavbarProps) => {
  const advantages = [
    {
      icon: Clock,
      title: "24/7 Doctor Access",
      description: "Connect with healthcare professionals anytime"
    },
    {
      icon: Calendar,
      title: "Instant Appointment Booking",
      description: "Book appointments with real-time availability"
    },
    {
      icon: Bot,
      title: "AI-Powered Health Tips",
      description: "Get personalized health recommendations"
    }
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                AfyaSmart Connect
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Right side - Get Started with hover card */}
          <div className="flex items-center space-x-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  variant="hero" 
                  size="default"
                  onClick={onGetStartedClick}
                  className="group"
                >
                  Get Started
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 bg-card shadow-hover border border-border/50">
                <div className="space-y-4">
                  <h4 className="font-semibold text-card-foreground mb-3">
                    Why Choose AfyaSmart Connect?
                  </h4>
                  {advantages.map((advantage, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                        <advantage.icon className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-card-foreground">
                          {advantage.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {advantage.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;