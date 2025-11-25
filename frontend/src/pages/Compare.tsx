import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { rooms } from "@/data/rooms";
import { ComparisonMetrics } from "@/types/room";

const Compare = () => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const addRoom = (roomId: string) => {
    if (selectedRooms.length < 3 && !selectedRooms.includes(roomId)) {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const removeRoom = (roomId: string) => {
    setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
  };

  const getComparisonMetrics = (roomId: string): ComparisonMetrics => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return { roomSize: 0, amenitiesScore: 0, pricing: 0, connectivity: 0, foodQuality: 0, safety: 0 };

    // Calculate scores (normalized to 0-100)
    const amenitiesCount = Object.values(room.facilities).filter(Boolean).length;
    const amenitiesScore = (amenitiesCount / 8) * 100;
    
    // Price score (inverted - lower price = higher score)
    const pricingScore = Math.max(0, 100 - ((room.price - 5000) / 150));
    
    // Room size based on occupancy (estimated)
    const roomSizeMap: { [key: string]: number } = { Single: 85, Double: 65, Triple: 50 };
    const roomSize = roomSizeMap[room.occupancy] || 50;
    
    // Connectivity (based on location)
    const connectivityMap: { [key: string]: number } = {
      Koramangala: 95,
      "HSR Layout": 90,
      Indiranagar: 92,
      Whitefield: 75,
      "Electronic City": 70,
      "BTM Layout": 80,
    };
    const connectivity = connectivityMap[room.area] || 70;
    
    // Food quality (based on meals included)
    const foodQuality = room.facilities.food ? (room.foodMenu?.length || 2) * 25 : 0;
    
    // Safety score (based on security + rating)
    const safety = room.facilities.security ? room.rating * 20 : room.rating * 15;

    return {
      roomSize,
      amenitiesScore,
      pricing: pricingScore,
      connectivity,
      foodQuality,
      safety,
    };
  };

  const comparisonCategories = [
    { key: "price", label: "Monthly Rent", format: (val: number) => `₹${val.toLocaleString()}` },
    { key: "deposit", label: "Security Deposit", format: (val: number) => `₹${val.toLocaleString()}` },
    { key: "occupancy", label: "Room Type" },
    { key: "gender", label: "Gender Preference" },
    { key: "rating", label: "Rating", format: (val: number) => `${val} ⭐` },
    { key: "area", label: "Location" },
  ];

  const facilities = [
    { key: "wifi", label: "WiFi" },
    { key: "ac", label: "Air Conditioning" },
    { key: "food", label: "Food Included" },
    { key: "laundry", label: "Laundry" },
    { key: "parking", label: "Parking" },
    { key: "gym", label: "Gym" },
    { key: "cleaning", label: "Cleaning Service" },
    { key: "security", label: "24/7 Security" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/listings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Compare PG Properties</h1>
          <p className="text-muted-foreground">Select up to 3 properties to compare side by side</p>
        </div>

        {/* Room Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((index) => (
            <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                {selectedRooms[index] ? (
                  <div>
                    {(() => {
                      const room = rooms.find((r) => r.id === selectedRooms[index]);
                      if (!room) return null;
                      return (
                        <>
                          <div className="relative mb-4">
                            <img src={room.image} alt={room.name} className="w-full h-40 object-cover rounded-lg" />
                            <button
                              onClick={() => removeRoom(selectedRooms[index])}
                              className="absolute top-2 right-2 p-1 rounded-full bg-background/80 backdrop-blur hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <h3 className="font-semibold mb-2">{room.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{room.location}</p>
                          <div className="text-xl font-bold text-primary">₹{room.price.toLocaleString()}/mo</div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">Select Property {index + 1}</p>
                    <Select onValueChange={addRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a property" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms
                          .filter((room) => !selectedRooms.includes(room.id))
                          .map((room) => (
                            <SelectItem key={room.id} value={room.id}>
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

        {/* Comparison Charts */}
        {selectedRooms.length >= 2 && (
          <Card className="mb-8 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { key: "roomSize", label: "Room Size" },
                  { key: "amenitiesScore", label: "Amenities" },
                  { key: "pricing", label: "Value for Money" },
                  { key: "connectivity", label: "Location & Connectivity" },
                  { key: "foodQuality", label: "Food Quality" },
                  { key: "safety", label: "Safety & Security" },
                ].map((metric) => (
                  <div key={metric.key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${selectedRooms.length}, 1fr)` }}>
                      {selectedRooms.map((roomId) => {
                        const metrics = getComparisonMetrics(roomId);
                        const value = metrics[metric.key as keyof ComparisonMetrics];
                        const room = rooms.find((r) => r.id === roomId);
                        return (
                          <div key={roomId} className="space-y-1">
                            <div className="h-8 bg-muted rounded-lg overflow-hidden">
                              <div
                                className="h-full bg-gradient-hero transition-all duration-500"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <div className="text-xs text-center text-muted-foreground">{room?.name.split("-")[0].trim()}</div>
                            <div className="text-xs text-center font-semibold">{Math.round(value)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Comparison Table */}
        {selectedRooms.length >= 2 && (
          <Card className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Feature</th>
                      {selectedRooms.map((roomId) => {
                        const room = rooms.find((r) => r.id === roomId);
                        return (
                          <th key={roomId} className="text-left py-3 px-4 font-semibold">
                            {room?.name.split("-")[0].trim()}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonCategories.map((category) => (
                      <tr key={category.key} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm font-medium text-muted-foreground">{category.label}</td>
                        {selectedRooms.map((roomId) => {
                          const room = rooms.find((r) => r.id === roomId);
                          if (!room) return <td key={roomId}>-</td>;
                          const value = room[category.key as keyof typeof room];
                          const displayValue = category.format 
                            ? category.format(value as number) 
                            : typeof value === 'string' || typeof value === 'number' 
                              ? value 
                              : '-';
                          return (
                            <td key={roomId} className="py-3 px-4">
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="border-b">
                      <td colSpan={selectedRooms.length + 1} className="py-3 px-4 font-semibold bg-muted/30">
                        Facilities
                      </td>
                    </tr>
                    {facilities.map((facility) => (
                      <tr key={facility.key} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm text-muted-foreground">{facility.label}</td>
                        {selectedRooms.map((roomId) => {
                          const room = rooms.find((r) => r.id === roomId);
                          const hasFeature = room?.facilities[facility.key as keyof typeof room.facilities];
                          return (
                            <td key={roomId} className="py-3 px-4">
                              {hasFeature ? (
                                <Badge variant="default" className="bg-success">
                                  Yes
                                </Badge>
                              ) : (
                                <Badge variant="secondary">No</Badge>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {selectedRooms.map((roomId) => {
                  const room = rooms.find((r) => r.id === roomId);
                  return (
                    <Button key={roomId} asChild>
                      <Link to={`/room/${roomId}`}>View {room?.name.split("-")[0].trim()}</Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedRooms.length === 0 && (
          <Card className="p-12 text-center animate-fade-in">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Start Comparing</h3>
            <p className="text-muted-foreground mb-6">Select at least 2 properties to see a detailed comparison</p>
            <Button asChild>
              <Link to="/listings">Browse Properties</Link>
            </Button>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Compare;
