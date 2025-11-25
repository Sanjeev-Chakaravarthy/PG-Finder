import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Filter, MapPin, Star, Wifi, Wind, Utensils, Search, SlidersHorizontal, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { rooms } from "@/data/rooms";

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([5000, 20000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState<string[]>([]);

  const areas = ["Koramangala", "HSR Layout", "Whitefield", "Indiranagar", "Electronic City", "BTM Layout"];
  const amenitiesFilter = ["WiFi", "AC", "Food", "Gym", "Parking", "Laundry"];

  const filteredRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.area.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesArea = selectedArea === "all" || room.area === selectedArea;
      const matchesOccupancy = selectedOccupancy === "all" || room.occupancy === selectedOccupancy;
      const matchesGender = selectedGender === "all" || room.gender === selectedGender || room.gender === "Co-ed";
      const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
      
      const matchesAmenities = selectedAmenities.length === 0 || 
        selectedAmenities.every((amenity) => {
          if (amenity === "WiFi") return room.facilities.wifi;
          if (amenity === "AC") return room.facilities.ac;
          if (amenity === "Food") return room.facilities.food;
          if (amenity === "Gym") return room.facilities.gym;
          if (amenity === "Parking") return room.facilities.parking;
          if (amenity === "Laundry") return room.facilities.laundry;
          return true;
        });

      return matchesSearch && matchesArea && matchesOccupancy && matchesGender && matchesPrice && matchesAmenities;
    });

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [searchQuery, selectedArea, selectedOccupancy, selectedGender, priceRange, selectedAmenities, sortBy]);

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
      {/* Area Filter */}
      <div>
        <h3 className="font-semibold mb-3">Location</h3>
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger>
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Occupancy Filter */}
      <div>
        <h3 className="font-semibold mb-3">Room Type</h3>
        <Select value={selectedOccupancy} onValueChange={setSelectedOccupancy}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Double">Double Sharing</SelectItem>
            <SelectItem value="Triple">Triple Sharing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gender Filter */}
      <div>
        <h3 className="font-semibold mb-3">Gender</h3>
        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Co-ed">Co-ed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amenities Filter */}
      <div>
        <h3 className="font-semibold mb-3">Amenities</h3>
        <div className="space-y-2">
          {amenitiesFilter.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="cursor-pointer text-sm">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </h3>
        <div className="space-y-2">
          <input
            type="range"
            min="5000"
            max="20000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedArea("all");
          setSelectedOccupancy("all");
          setSelectedGender("all");
          setSelectedAmenities([]);
          setPriceRange([5000, 20000]);
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Perfect PG</h1>
          <p className="text-muted-foreground">Browse {filteredRooms.length} properties across Law Gate</p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h2>
                <FilterPanel />
              </CardContent>
            </Card>
          </aside>

          {/* Room Listings */}
          <div className="flex-1">
            {filteredRooms.length === 0 ? (
              <Card className="p-12 text-center animate-fade-in">
                <p className="text-muted-foreground mb-4">No properties found matching your criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedArea("all");
                    setSelectedOccupancy("all");
                    setSelectedGender("all");
                    setSelectedAmenities([]);
                  }}
                >
                  Clear All Filters
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredRooms.map((room, idx) => (
                  <Card
                    key={room.id}
                    className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 animate-fade-in-up overflow-hidden"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <button
                        onClick={() => toggleFavorite(room.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.includes(room.id) ? "fill-primary text-primary" : "text-foreground"
                          }`}
                        />
                      </button>
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {room.occupancy}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {room.name}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {room.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span className="font-semibold mr-1">{room.rating}</span>
                        <span className="text-sm text-muted-foreground">({room.reviews} reviews)</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {room.facilities.wifi && (
                          <Badge variant="secondary" className="text-xs">
                            <Wifi className="h-3 w-3 mr-1" />
                            WiFi
                          </Badge>
                        )}
                        {room.facilities.ac && (
                          <Badge variant="secondary" className="text-xs">
                            <Wind className="h-3 w-3 mr-1" />
                            AC
                          </Badge>
                        )}
                        {room.facilities.food && (
                          <Badge variant="secondary" className="text-xs">
                            <Utensils className="h-3 w-3 mr-1" />
                            Food
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <div className="text-2xl font-bold text-primary">₹{room.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">per month</div>
                        </div>
                        <Button asChild>
                          <Link to={`/room/${room.id}`}>View Details</Link>
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
