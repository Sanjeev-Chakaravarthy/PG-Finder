import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X, TrendingUp, Zap, Shield, Wifi, UtensilsCrossed, Home, MapPin, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Room {
  _id: string;
  name: string;
  location: string;
  area: string;
  price: number;
  deposit?: number;
  occupancy: string;
  gender: string;
  rating: number;
  image: string;
  facilities: {
    wifi?: boolean;
    ac?: boolean;
    food?: boolean;
    laundry?: boolean;
    parking?: boolean;
    gym?: boolean;
    cleaning?: boolean;
    security?: boolean;
  };
  foodMenu?: string[];
}

interface ComparisonMetrics {
  roomSize: number;
  amenitiesScore: number;
  pricing: number;
  connectivity: number;
  foodQuality: number;
  safety: number;
}

const getImageUrl = (image?: string) => {
  if (!image) return "https://via.placeholder.com/400x300?text=No+Image";
  if (image.startsWith("http")) return image;
  return `http://localhost:5001${image}`;
};

const Compare = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/rooms")
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const addRoom = (roomId: string) => {
    if (selectedRoomIds.length < 3 && !selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds([...selectedRoomIds, roomId]);
    }
  };

  const removeRoom = (roomId: string) => {
    setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
  };

  const selectedRooms = rooms.filter(r => selectedRoomIds.includes(r._id));

  const connectivityMap: { [key: string]: number } = {
    "Law Gate": 95,
    "Cheema Park": 90,
    "Maheru": 85,
    "Empire": 88,
    "Near LPU": 92,
    "LPU Main Gate": 94,
    "Phagwara": 80,
  };

  const getComparisonMetrics = (room: Room): ComparisonMetrics => {
    const amenitiesCount = Object.values(room.facilities || {}).filter(Boolean).length;
    const amenitiesScore = (amenitiesCount / 8) * 100;
    const pricingScore = Math.max(0, 100 - ((room.price - 5000) / 150));
    const roomSizeMap: { [key: string]: number } = { Single: 85, Double: 65, Triple: 50 };
    const roomSize = roomSizeMap[room.occupancy] || 50;
    const connectivity = connectivityMap[room.area] || 75;
    const foodQuality = room.facilities?.food ? (room.foodMenu?.length || 2) * 25 : 0;
    const safety = room.facilities?.security ? room.rating * 20 : room.rating * 15;
    return { roomSize, amenitiesScore, pricing: pricingScore, connectivity, foodQuality, safety };
  };

  const getWinner = (metricKey: keyof ComparisonMetrics) => {
    if (selectedRooms.length < 2) return null;
    const scores = selectedRooms.map(room => ({
      id: room._id,
      score: getComparisonMetrics(room)[metricKey]
    }));
    const maxScore = Math.max(...scores.map(s => s.score));
    return scores.find(s => s.score === maxScore)?.id;
  };

  const metricIcons = {
    roomSize: Home,
    amenitiesScore: Sparkles,
    pricing: Zap,
    connectivity: MapPin,
    foodQuality: UtensilsCrossed,
    safety: Shield,
  };

  const metricColors = {
    roomSize: "bg-blue-500",
    amenitiesScore: "bg-purple-500",
    pricing: "bg-emerald-500",
    connectivity: "bg-orange-500",
    foodQuality: "bg-amber-500",
    safety: "bg-indigo-500",
  };

  const comparisonCategories = [
    { key: "price", label: "Monthly Rent", format: (value: number) => `₹${value.toLocaleString()}` },
    { key: "deposit", label: "Security Deposit", format: (value: number) => `₹${value?.toLocaleString() || '0'}` },
    { key: "occupancy", label: "Room Type" },
    { key: "gender", label: "Gender Preference" },
    { key: "rating", label: "Rating", format: (value: number) => `${value} ⭐` },
    { key: "area", label: "Location" },
  ];

  const facilities = [
    { key: "wifi", label: "WiFi", icon: Wifi },
    { key: "ac", label: "Air Conditioning", icon: Sparkles },
    { key: "food", label: "Food Included", icon: UtensilsCrossed },
    { key: "laundry", label: "Laundry", icon: Sparkles },
    { key: "parking", label: "Parking", icon: MapPin },
    { key: "gym", label: "Gym", icon: Zap },
    { key: "cleaning", label: "Cleaning Service", icon: Sparkles },
    { key: "security", label: "24/7 Security", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-pulse space-y-4">
              <div className="h-12 w-64 bg-slate-200 rounded-xl mx-auto"></div>
              <div className="h-6 w-48 bg-slate-200 rounded-xl mx-auto"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-6 hover:bg-slate-100">
            <Link to="/listings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Link>
          </Button>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Compare Properties
              </h1>
            </div>
            <p className="text-lg text-slate-600 ml-[72px]">
              Select up to 3 properties to compare side by side
            </p>
          </div>
        </div>

        {/* Selection Boxes */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[0, 1, 2].map((index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border border-slate-200 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {selectedRooms[index] ? (
                  <div className="relative">
                    <div className="relative overflow-hidden">
                      <img 
                        src={getImageUrl(selectedRooms[index].image)} 
                        alt={selectedRooms[index].name} 
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <button
                        onClick={() => removeRoom(selectedRooms[index]._id)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/95 backdrop-blur shadow-lg hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <Badge className="absolute top-4 left-4 bg-white/95 text-slate-900 backdrop-blur">
                        Property {index + 1}
                      </Badge>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{selectedRooms[index].name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
                        <span className="line-clamp-1">{selectedRooms[index].location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-2xl font-bold text-blue-600">
                          ₹{selectedRooms[index].price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/mo</span>
                        </div>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                          {selectedRooms[index].occupancy}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24 px-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Plus className="h-10 w-10 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-6">
                      Select Property {index + 1}
                    </p>
                    <Select onValueChange={addRoom}>
                      <SelectTrigger className="border-2 border-slate-200 hover:border-blue-300 transition-all rounded-xl">
                        <SelectValue placeholder="Choose a property" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms
                          .filter((room) => !selectedRoomIds.includes(room._id))
                          .map((room) => (
                            <SelectItem key={room._id} value={room._id}>
                              {room.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Metrics */}
        {selectedRooms.length >= 2 && (
          <Card className="mb-12 border border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                Performance Metrics
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="space-y-8">
                {[
                  { key: "roomSize", label: "Room Size & Space" },
                  { key: "amenitiesScore", label: "Amenities & Facilities" },
                  { key: "pricing", label: "Value for Money" },
                  { key: "connectivity", label: "Location & Connectivity" },
                  { key: "foodQuality", label: "Food Quality" },
                  { key: "safety", label: "Safety & Security" },
                ].map((metric) => {
                  const Icon = metricIcons[metric.key as keyof typeof metricIcons];
                  const color = metricColors[metric.key as keyof typeof metricColors];
                  const winnerId = getWinner(metric.key as keyof ComparisonMetrics);
                  
                  return (
                    <div key={metric.key} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-slate-700" />
                        <span className="text-base font-semibold text-slate-900">{metric.label}</span>
                      </div>

                      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedRooms.length}, 1fr)` }}>
                        {selectedRooms.map((room) => {
                          const metrics = getComparisonMetrics(room);
                          const value = metrics[metric.key as keyof ComparisonMetrics];
                          const isWinner = room._id === winnerId;

                          return (
                            <div key={room._id} className="space-y-2">
                              <div className={`relative h-12 bg-slate-100 rounded-xl overflow-hidden transition-all ${isWinner ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                                <div 
                                  className={`h-full ${color} transition-all duration-700 ease-out flex items-center justify-end pr-3`}
                                  style={{ width: `${value}%` }}
                                >
                                  {isWinner && <Award className="h-4 w-4 text-white" />}
                                </div>
                              </div>
                              <div className="text-xs text-center text-slate-600 truncate">
                                {room.name.split("–")[0].trim()}
                              </div>
                              <div className={`text-sm text-center font-bold ${isWinner ? 'text-blue-600' : 'text-slate-700'}`}>
                                {Math.round(value)}%
                                {isWinner && " 🏆"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Comparison */}
        {selectedRooms.length >= 2 && (
          <Card className="border border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-200">
              <CardTitle className="text-xl text-slate-900">Detailed Comparison</CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="py-4 px-6 text-left font-bold text-slate-900">Feature</th>
                      {selectedRooms.map((room) => (
                        <th key={room._id} className="py-4 px-6 text-left font-bold text-slate-900">
                          {room.name.split("–")[0].trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {comparisonCategories.map((category, idx) => (
                      <tr key={category.key} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="py-4 px-6 text-sm font-medium text-slate-600">{category.label}</td>
                        {selectedRooms.map((room) => {
                          const value = room[category.key as keyof Room];
                          const displayValue = category.format
                            ? category.format(value as number)
                            : value ?? "-";
                          return (
                            <td key={room._id} className="py-4 px-6 font-semibold text-slate-900">
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    <tr className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50">
                      <td colSpan={selectedRooms.length + 1} className="py-4 px-6 font-bold text-slate-900">
                        Facilities & Amenities
                      </td>
                    </tr>

                    {facilities.map((facility, idx) => {
                      const FacilityIcon = facility.icon;
                      return (
                        <tr key={facility.key} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-4 px-6 text-sm font-medium text-slate-600">
                            <div className="flex items-center gap-2">
                              <FacilityIcon className="h-4 w-4 text-slate-500" />
                              {facility.label}
                            </div>
                          </td>
                          {selectedRooms.map((room) => {
                            const hasFeature = room.facilities?.[facility.key as keyof typeof room.facilities];

                            return (
                              <td key={room._id} className="py-4 px-6">
                                {hasFeature ? (
                                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                    ✓ Yes
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                    ✗ No
                                  </Badge>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {selectedRooms.map((room) => (
                  <Button 
                    key={room._id} 
                    asChild 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link to={`/room/${room._id}`}>
                      View Full Details - {room.name.split("–")[0].trim()}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedRooms.length === 0 && (
          <Card className="border border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white">
            <div className="p-20 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                Start Your Comparison
              </h3>
              <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto">
                Select at least 2 properties above to see a detailed side-by-side comparison
              </p>
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/listings">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Browse All Properties
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Compare;