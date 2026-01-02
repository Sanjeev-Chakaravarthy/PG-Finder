import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, PlusCircle, LogOut, LayoutDashboard, Building2, PieChart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isOwner = user?.role === 'owner';

  // Home Link: Where "Home" text/logo takes you
  const getHomeLink = () => {
    if (isOwner) return "/partner"; 
    if (user) return "/home";       
    return "/";                     
  };

  // Dashboard Link: Where "Dashboard" text takes you
  const getDashboardLink = () => {
    if (isOwner) return "/owner-dashboard";
    if (user) return "/user-dashboard";
    return "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to={getHomeLink()} className="flex items-center space-x-2 group">
          <Home className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            PG Haven
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to={getHomeLink()} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>

          {/* DASHBOARD LINK (Visible if logged in) */}
          {user && (
            <Link to={getDashboardLink()} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}

          {!isOwner ? (
            // --- USER / GUEST OPTIONS ---
            <>
              <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Find PG
              </Link>
              <Link to="/compare" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Compare
              </Link>
            </>
          ) : (
            // --- PG OWNER OPTIONS ---
            <>
              <Link to="/my-listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center">
                <Building2 className="w-4 h-4 mr-1" /> My Listings
              </Link>
              <Link to="/add-room" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center">
                <PlusCircle className="w-4 h-4 mr-1" /> Add New PG
              </Link>
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          
          {/* USER ONLY */}
          {!isOwner && (
            <>
              <Button size="sm" className="bg-gradient-hero shadow-glow" asChild>
                <Link to="/listings">Book Now</Link>
              </Button>
            </>
          )}

          {/* OWNER ONLY: Badge */}
          {isOwner && (
             <div className="hidden lg:flex px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full items-center border border-primary/20">
               <LayoutDashboard className="w-3 h-3 mr-1" /> Owner Mode
             </div>
          )}

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-4 ml-2 pl-2 border-l">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {isOwner ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/owner-dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-listings"><Building2 className="mr-2 h-4 w-4" /> My Listings</Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                        <DropdownMenuItem asChild><Link to="/user-dashboard"><User className="mr-2 h-4 w-4" /> My Dashboard</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link to="/home"><Home className="mr-2 h-4 w-4" /> Search PGs</Link></DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2 border-l pl-2">
              <Button variant="ghost" size="sm" asChild><Link to="/login">Login</Link></Button>
              <Button size="sm" variant="outline" asChild><Link to="/signup">Sign Up</Link></Button>
            </div>
          )}
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
            <Link to={getHomeLink()} className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            
            {user && (
                <Link to={getDashboardLink()} className="block py-2 text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            )}

            {!isOwner ? (
              <>
                <Link to="/listings" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Find PG</Link>
                <Link to="/compare" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Compare</Link>
              </>
            ) : (
              <>
                <Link to="/my-listings" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>My Listings</Link>
                <Link to="/add-room" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Add New PG</Link>
              </>
            )}
            
            <div className="pt-4 border-t space-y-2">
              {!isOwner && (
                <>
                  <Button size="sm" className="w-full bg-gradient-hero" asChild><Link to="/listings" onClick={() => setMobileMenuOpen(false)}>Book Now</Link></Button>
                </>
              )}

              {user ? (
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-600" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full" asChild><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></Button>
                  <Button size="sm" variant="secondary" className="w-full" asChild><Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;