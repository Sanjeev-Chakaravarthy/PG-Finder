import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Wifi,
  Wind,
  Utensils,
  Car,
  Dumbbell,
  ShowerHead,
  Shield,
  Check,
  X,
  Phone,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { rooms } from "@/data/rooms";
import { toast } from "sonner";

// ⭐ SWIPER IMPORTS
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const RoomDetails = () => {
  const { id } = useParams();
  const room = rooms.find((r) => r.id === id);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    moveInDate: "",
    message: "",
  });

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
          <Button asChild>
            <Link to="/listings">Back to Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  const facilityIcons = {
    wifi: <Wifi className="h-5 w-5" />,
    ac: <Wind className="h-5 w-5" />,
    food: <Utensils className="h-5 w-5" />,
    laundry: <ShowerHead className="h-5 w-5" />,
    parking: <Car className="h-5 w-5" />,
    gym: <Dumbbell className="h-5 w-5" />,
    cleaning: <ShowerHead className="h-5 w-5" />,
    security: <Shield className="h-5 w-5" />,
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Booking request sent! We'll contact you shortly.");
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      moveInDate: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4 animate-fade-in">
          <Link to="/listings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* ⭐ IMAGE / VIDEO SLIDER */}
            <Card className="overflow-hidden animate-fade-in-up">
              {room.videos && room.videos.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000 }}
                  loop={true}
                  className="w-full h-[400px]"
                >
                  {room.videos.map((vid, index) => (
                    <SwiperSlide key={index}>
                      <video
                        src={vid}
                        autoPlay
                        muted
                        loop
                        controls
                        playsInline
                        className="w-full h-[400px] object-cover rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-[400px] object-cover"
                />
              )}
            </Card>

            {/* Title */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {room.location}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-primary text-primary mr-1" />
                      <span className="font-semibold mr-1">
                        {room.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({room.reviews} reviews)
                      </span>
                    </div>
                    <Badge variant="secondary">{room.occupancy}</Badge>
                    <Badge variant="outline">{room.gender}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ₹{room.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per month
                  </div>
                </div>
              </div>
              <Separator />
            </div>

            {/* Tabs Section */}
            <Card
              className="animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <CardContent className="p-6">
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                  </TabsList>

                  {/* OVERVIEW */}
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        About This Property
                      </h3>
                      <p className="text-muted-foreground">
                        {room.description}
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Deposit
                        </p>
                        <p className="font-semibold">
                          ₹{room.deposit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Notice Period
                        </p>
                        <p className="font-semibold">
                          {room.noticePeriod} days
                        </p>
                      </div>
                    </div>

                    {room.foodMenu && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2">Food Included</h3>
                          <div className="flex flex-wrap gap-2">
                            {room.foodMenu.map((meal) => (
                              <Badge key={meal} variant="secondary">
                                {meal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* AMENITIES */}
                  <TabsContent value="amenities" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(room.facilities).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className={`flex items-center space-x-3 p-3 rounded-lg border ${
                              value
                                ? "bg-success/5 border-success/20"
                                : "bg-muted/50 border-border"
                            }`}
                          >
                            {value ? (
                              <Check className="h-5 w-5 text-success" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div className="flex items-center space-x-2">
                              {facilityIcons[
                                key as keyof typeof facilityIcons
                              ]}
                              <span className="font-medium capitalize">
                                {key}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="font-semibold mb-3">
                        Additional Amenities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* LOCATION */}
                  <TabsContent
                    value="location"
                    className="mt-4 space-y-4"
                  >
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium">
                          Metro Station
                        </span>
                        <Badge variant="secondary">
                          {room.distance.metro}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium">Bus Stop</span>
                        <Badge variant="secondary">
                          {room.distance.busStop}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium">
                          Office/IT Park
                        </span>
                        <Badge variant="secondary">
                          {room.distance.office}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Located in {room.area}, one of Law Gate's most
                        connected areas
                      </p>
                    </div>
                  </TabsContent>

                  {/* RULES */}
                  <TabsContent value="rules" className="mt-4">
                    <ul className="space-y-2">
                      {room.rules.map((rule, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-2"
                        >
                          <Check className="h-5 w-5 text-primary mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card
              className="sticky top-20 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <CardHeader>
                <CardTitle>Book a Visit</CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={bookingForm.name}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="moveInDate">
                      Preferred Move-in Date
                    </Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      value={bookingForm.moveInDate}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          moveInDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Any special requirements?"
                      value={bookingForm.message}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          message: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero shadow-glow"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Visit
                  </Button>
                </form>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="tel:+918123456789">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`https://wa.me/918123456789?text=Hi, I'm interested in ${room.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        <div
          className="mt-12 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          <h2 className="text-2xl font-bold mb-6">
            Similar Properties
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms
              .filter((r) => r.id !== room.id && r.area === room.area)
              .slice(0, 3)
              .map((similarRoom) => (
                <Card
                  key={similarRoom.id}
                  className="hover:shadow-large transition-all duration-300"
                >
                  <img
                    src={similarRoom.image}
                    alt={similarRoom.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">
                      {similarRoom.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        ₹{similarRoom.price.toLocaleString()}
                      </span>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/room/${similarRoom.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RoomDetails;