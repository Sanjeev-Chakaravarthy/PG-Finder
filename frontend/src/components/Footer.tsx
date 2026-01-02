import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                PG Finder
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              India's fastest growing co-living network. We provide safe, fully furnished, and affordable PGs for students and professionals across the country.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/listings" className="hover:text-primary transition-colors">Find PG</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-primary transition-colors">Compare Rooms</Link>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors">About Us</a>
              </li>
            </ul>
          </div>

          {/* Popular Cities (Updated from local areas) */}
          <div>
            <h3 className="font-semibold mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Delhi NCR</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Mumbai</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Bangalore</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Pune</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Hyderabad</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Corporate Office, Punjab, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+919447812177" className="hover:text-primary transition-colors">
                  +91 94478 12177
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href="https://wa.me/919447812177"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Chat
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@pghaven.com" className="hover:text-primary transition-colors">
                  info@pghaven.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 PG Finder. All rights reserved. | Privacy Policy | Terms & Conditions</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;