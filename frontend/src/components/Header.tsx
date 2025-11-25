import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Search, BarChart3, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <Home className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            PG Haven
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Find PG
          </Link>
          <Link to="/compare" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Compare
          </Link>
          <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild>
            <a href="tel:+918123456789">
              <Phone className="h-4 w-4 mr-2" />
              Call Us
            </a>
          </Button>
          <Button size="sm" className="bg-gradient-hero shadow-glow" asChild>
            <Link to="/listings">Book Now</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/listings"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find PG
            </Link>
            <Link
              to="/compare"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare
            </Link>
            <a
              href="#contact"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="pt-2 space-y-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="tel:+918123456789">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </a>
              </Button>
              <Button size="sm" className="w-full bg-gradient-hero" asChild>
                <Link to="/listings">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
