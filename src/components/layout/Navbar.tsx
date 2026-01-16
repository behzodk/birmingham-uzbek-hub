import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/news", label: "News" },
  { to: "/merch", label: "Merch" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b-[3px] border-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary border-[3px] border-foreground flex items-center justify-center shadow-[3px_3px_0px_0px_hsl(var(--foreground))] group-hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all">
              <span className="text-primary-foreground font-display font-bold text-lg">U</span>
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">UzbekSoc</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={location.pathname === link.to ? "secondary" : "ghost"}
                  size="sm"
                  className={location.pathname === link.to ? "" : "border-0"}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t-[3px] border-foreground animate-bounce-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={location.pathname === link.to ? "secondary" : "outline"}
                    className="w-full justify-start"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
