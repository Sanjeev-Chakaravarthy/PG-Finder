import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, MapPin, ArrowRight, Home, Users, 
  Wallet, ShieldCheck, Wifi, Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// High-quality hero background
const HERO_IMG = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2000";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/rooms`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const uniqueLocations = Array.from(
            new Set(data.map((r: any) => r.area || r.location).filter(Boolean))
          );
          setAllLocations(uniqueLocations);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    setSuggestions([]);
    e.preventDefault();
    if (searchLocation.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchLocation)}`);
    } else {
      navigate("/listings");
    }
  };

  const handleCategoryClick = (filterType: string, value: string) => {
    // Navigate to listings with pre-applied filters (You would implement logic in Listings to read these)
    navigate(`/listings?${filterType}=${value}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[550px] flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        <div className="relative z-10 container px-4 w-full max-w-5xl text-center space-y-8">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Find a place you'll love to <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                call home.
              </span>
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Search verified PGs, hostels, and co-living spaces with zero brokerage.
            </p>
          </div>

          {/* MAIN SEARCH CARD */}
          <Card className="p-2 max-w-3xl mx-auto bg-white rounded-full shadow-2xl border-0 animate-in zoom-in-95 duration-500 delay-100">
            <form onSubmit={handleSearch} className="flex items-center gap-2 pl-4 pr-1 py-1 relative">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <Input 
                className="border-0 shadow-none focus-visible:ring-0 text-base h-12 bg-transparent placeholder:text-gray-400"
                placeholder="Search by City, Area, or College..."
                value={searchLocation}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchLocation(value);

                  if (!value) {
                    setSuggestions([]);
                    return;
                  }

                  const filtered = allLocations.filter(loc =>
                    loc.toLowerCase().startsWith(value.toLowerCase())
                  );

                  setSuggestions(filtered.slice(0, 6));
                }}
              />
              <Button size="lg" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 transition-all text-lg">
                Search
              </Button>
            </form>
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg mt-2 overflow-hidden z-50">
                {suggestions.map((loc, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      navigate(`/listings?search=${encodeURIComponent(loc)}`);
                      setSearchLocation(loc);
                      setSuggestions([]);
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-muted text-left"
                  >
                    <MapPin className="inline w-4 h-4 mr-2 text-muted-foreground" />
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* QUICK TAGS */}
          <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            {["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"].map((city) => (
              <button 
                key={city}
                onClick={() => navigate(`/listings?search=${city}`)}
                className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- BROWSE BY CATEGORY --- */}
      <section className="py-16 bg-muted/20">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Explore Categories</h2>
              <p className="text-muted-foreground mt-2">Find the room type that fits your lifestyle.</p>
            </div>
            <Button variant="ghost" className="text-primary hidden md:flex" onClick={() => navigate('/listings')}>
              View All Listings <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              onClick={() => handleCategoryClick('occupancy', 'Single')}
              className="group cursor-pointer bg-white dark:bg-card border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">Private Rooms</h3>
              <p className="text-sm text-muted-foreground">For privacy & comfort</p>
            </div>

            <div 
              onClick={() => handleCategoryClick('occupancy', 'Double')}
              className="group cursor-pointer bg-white dark:bg-card border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">Shared Rooms</h3>
              <p className="text-sm text-muted-foreground">Budget-friendly options</p>
            </div>

            <div 
              onClick={() => handleCategoryClick('gender', 'Female')}
              className="group cursor-pointer bg-white dark:bg-card border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">Female Only</h3>
              <p className="text-sm text-muted-foreground">Safe & secure stays</p>
            </div>

            <div 
              onClick={() => navigate('/listings?sort=price-low')}
              className="group cursor-pointer bg-white dark:bg-card border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">Pocket Friendly</h3>
              <p className="text-sm text-muted-foreground">Best value for money</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="bg-primary/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 border border-primary/10">
            <div className="md:w-1/2 space-y-6">
              <Badge variant="outline" className="border-primary text-primary px-3 py-1">Premium Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">More than just a room.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We ensure that every property listed on PG Haven meets our strict quality standards. 
                Move in without worries about amenities or hidden costs.
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "High-Speed WiFi", "Daily Housekeeping", "Professional Security", "Healthy Meals",
                  "Power Backup", "Community Events"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium text-foreground/80">
                    <div className="w-2 h-2 rounded-full bg-primary" /> {item}
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Button size="lg" className="px-8 shadow-lg shadow-primary/20" onClick={() => navigate('/listings')}>
                  Start Exploring
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center relative">
              <div className="relative z-10 w-full max-w-sm bg-white dark:bg-card p-6 rounded-2xl shadow-xl border rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4 border-b pb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Verified Property</h4>
                    <p className="text-xs text-muted-foreground">Inspected by PG Haven Team</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><Wifi className="w-4 h-4" /> Internet</span>
                    <span className="text-green-600 font-medium">100 Mbps</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><Zap className="w-4 h-4" /> Power</span>
                    <span className="text-green-600 font-medium">24/7 Backup</span>
                  </div>
                </div>
              </div>
              {/* Decorative Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-3xl -z-0 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;