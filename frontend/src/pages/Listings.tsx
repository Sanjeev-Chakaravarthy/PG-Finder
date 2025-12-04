import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  MapPin,
  Star,
  Search,
  SlidersHorizontal,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { rooms } from "@/data/rooms";

// ⭐ SWIPER IMPORTS
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([5000, 20000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState<string[]>([]);

  const areas = ["Law Gate", "Cheema Park", "Maheru", "Near LPU", "Phagwara", "Empire"];
  const amenitiesFilter = ["WiFi", "AC", "Parking", "Laundry", "Gym"];

  const filteredRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch =
        room.name.toLowerCase().includes(searchLower) ||
        room.location.toLowerCase().includes(searchLower) ||
        room.area.toLowerCase().includes(searchLower);

      const matchesArea =
        selectedArea === "all" ||
        room.area.toLowerCase().includes(selectedArea.toLowerCase()) ||
        room.location.toLowerCase().includes(selectedArea.toLowerCase());

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
          if (amenity === "WiFi") return room.facilities.wifi;
          if (amenity === "AC") return room.facilities.ac;
          if (amenity === "Parking") return room.facilities.parking;
          if (amenity === "Laundry") return room.facilities.laundry;
          if (amenity === "Gym") return room.facilities.gym;
          return true;
        });

      return (
        matchesSearch &&
        matchesArea &&
        matchesOccupancy &&
        matchesGender &&
        matchesPrice &&
        matchesAmenities
      );
    });

    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [
    searchQuery,
    selectedArea,
    selectedOccupancy,
    selectedGender,
    priceRange,
    selectedAmenities,
    sortBy,
  ]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleFavorite = (roomId: string) => {
    setFavorites((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const FilterPanel = () => (
    <div className="space-y-6">
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

      <div>
        <h3 className="font-semibold mb-3">Room Type</h3>
        <Select
          value={selectedOccupancy}
          onValueChange={setSelectedOccupancy}
        >
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

      <div>
        <h3 className="font-semibold mb-3">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </h3>
        <input
          type="range"
          min="5000"
          max="20000"
          step="1000"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], parseInt(e.target.value)])
          }
          className="w-full"
        />
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Your Perfect PG Near LPU
          </h1>
          <p className="text-muted-foreground">
            Browse {filteredRooms.length} fully furnished PGs across Law Gate
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by PG name, Law Gate, Cheema Park, Maheru..."
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
              <SelectItem value="price-low">Low to High</SelectItem>
              <SelectItem value="price-high">High to Low</SelectItem>
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

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" /> Filters
                </h2>
                <FilterPanel />
              </CardContent>
            </Card>
          </aside>

          {/* Listings */}
          <div className="flex-1">
            {filteredRooms.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No properties found</p>
                <Button variant="outline">Clear All Filters</Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <Card
                    key={room.id}
                    className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* ⭐ VIDEO + IMAGE SWIPER SLIDER FIXED ⭐ */}
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      {room.videos && room.videos.length > 0 ? (
                        <Swiper
                          modules={[Navigation, Pagination, Autoplay]}
                          navigation
                          pagination={{ clickable: true }}
                          autoplay={{ delay: 3000 }}
                          loop={true}
                          className="w-full h-full"
                        >
                          {room.videos.map((vid, index) => (
                            <SwiperSlide key={index}>
                              <video
                                src={vid}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <img
                          src={room.image}
                          alt={room.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}

                      <button
                        onClick={() => toggleFavorite(room.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.includes(room.id)
                              ? "fill-primary text-primary"
                              : "text-foreground"
                          }`}
                        />
                      </button>

                      <Badge className="absolute top-3 left-3 bg-primary text-white">
                        {room.occupancy}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{room.name}</h3>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {room.location}
                      </div>

                      <div className="flex items-center mt-2 mb-3">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span className="font-semibold mr-1">{room.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({room.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            ₹{room.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            per month
                          </div>
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