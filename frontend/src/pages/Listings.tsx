import { useEffect, useState, useMemo } from "react";
// FIX: Import useSearchParams
import { Link, useSearchParams } from "react-router-dom";
import {
  Filter, MapPin, Star, Search, SlidersHorizontal, Heart, Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

// API base URL from Vite env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper for image URLs
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath; // External link
  return `${API_BASE_URL}${imagePath}`; // Backend file via ENV
};

interface Room {
  _id: string;
  name: string;
  location: string;
  area: string;
  price: number;
  occupancy: string;
  gender: string;
  image: string;
  rating: number;
  reviews: number;
  status: 'available' | 'booked' | 'occupied';
  facilities: any;
}

const Listings = () => {
  // FIX: Initialize search from URL
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState(initialSearch); // Set initial state
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Removed hardcoded areas array as per instructions

  const amenitiesFilter = ["wifi", "ac", "parking", "laundry", "gym"];

useEffect(() => {
    fetch(`${API_BASE_URL}/api/rooms`)
      .then(res => res.json())
      .then(data => {
        setRooms(data);

        if (Array.isArray(data) && data.length > 0) {
          const prices = data.map((r: any) => r.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);

          setPriceBounds([min, max]);
          setPriceRange([min, max]);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch rooms:", err);
        setLoading(false);
      });
  }, []);

  const availableAreas = useMemo(() => {
    const areaSet = new Set<string>();
    rooms.forEach(room => {
      if (room.area) {
        areaSet.add(room.area.trim());
      }
    });
    return Array.from(areaSet).sort();
  }, [rooms]);

  // Sync search query if URL changes
  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const filteredRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
      const searchLower = searchQuery.toLowerCase();
      
      const matchesSearch =
        room.name.toLowerCase().includes(searchLower) ||
        room.location.toLowerCase().includes(searchLower) ||
        room.area.toLowerCase().includes(searchLower);

      const matchesArea =
        selectedArea === "all" ||
        room.area.toLowerCase() === selectedArea.toLowerCase();

      const matchesOccupancy =
        selectedOccupancy === "all" || room.occupancy === selectedOccupancy;

      const matchesGender =
        selectedGender === "all" ||
        room.gender === selectedGender ||
        room.gender === "Co-ed";

      const matchesPrice =
        room.price >= priceRange[0] && room.price <= priceRange[1];

      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => {
          return room.facilities && room.facilities[amenity as keyof typeof room.facilities];
        });

      return (
        matchesSearch && matchesArea && matchesOccupancy &&
        matchesGender && matchesPrice && matchesAmenities
      );
    });

    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [rooms, searchQuery, selectedArea, selectedOccupancy, selectedGender, priceRange, selectedAmenities, sortBy]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleFavorite = (roomId: string) => {
    setFavorites((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Location</h3>
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {availableAreas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Room Type</h3>
        <Select value={selectedOccupancy} onValueChange={setSelectedOccupancy}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Double">Double Sharing</SelectItem>
            <SelectItem value="Triple">Triple Sharing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Gender</h3>
        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Co-ed">Co-ed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Amenities</h3>
        <div className="space-y-2">
          {amenitiesFilter.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={amenity} checked={selectedAmenities.includes(amenity)} onCheckedChange={() => toggleAmenity(amenity)} />
              <Label htmlFor={amenity} className="cursor-pointer text-sm capitalize">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Price: ₹{priceRange[0]} - ₹{priceRange[1]}</h3>
        <input
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={500}
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="w-full accent-primary"
        />
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setSelectedArea("all"); setSelectedOccupancy("all"); setSelectedGender("all"); setSelectedAmenities([]); setPriceRange(priceBounds); }}>Clear Filters</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Perfect PG</h1>
          <p className="text-muted-foreground">Browse verified, fully furnished PGs across multiple cities.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search by City, Area, or PG Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" className="md:hidden"><SlidersHorizontal className="h-5 w-5 mr-2" /> Filters</Button></SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
              <div className="mt-6"><FilterPanel /></div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center"><Filter className="h-5 w-5 mr-2" /> Filters</h2>
                <FilterPanel />
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p>Loading available PGs...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No properties found matching your criteria.</p>
                <Button variant="outline" onClick={() => { setSelectedArea("all"); setSearchQuery(""); }}>Clear Search</Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <Card key={room._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(room.image)}
                        alt={room.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image+Error" }}
                      />
                      <button onClick={(e) => { e.preventDefault(); toggleFavorite(room._id); }} className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-white transition-colors z-10">
                        <Heart className={`h-4 w-4 ${favorites.includes(room._id) ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                      </button>
                      
                      <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                        <Badge className="bg-primary text-white shadow-sm">{room.occupancy}</Badge>
                        {room.status === 'booked' && (
                          <Badge variant="destructive" className="shadow-sm">Booked / Reserved</Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{room.name}</h3>
                        <Badge variant="outline" className="text-xs">{room.gender}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1">{room.location}</span>
                      </div>
                      <div className="flex items-center mb-4">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-semibold mr-1">{room.rating || 4.5}</span>
                        <span className="text-xs text-muted-foreground">({room.reviews || 0} reviews)</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <div className="text-xl font-bold text-primary">₹{room.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">per month</div>
                        </div>
                        <Button asChild size="sm" className={room.status === 'booked' ? "bg-gray-500" : "bg-gradient-hero"}>
                          <Link to={`/room/${room._id}`}>
                            {room.status === 'booked' ? 'View (Reserved)' : 'View Details'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Listings;