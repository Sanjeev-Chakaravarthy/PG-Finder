import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Home,
  Wifi,
  Shield,
  DollarSign,
  Clock,
  Users,
  Star,
  ArrowRight,
  TrendingUp,
  Award,
  MessageCircle,
  Building2,
  Bath,
  Refrigerator,
  CookingPot,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");

  // ⭐ Updated features for LAW GATE PGs
  const features = [
    { icon: Wifi, title: "Free High-Speed WiFi", desc: "Unlimited high-speed internet in all rooms" },
    { icon: Shield, title: "24/7 Security", desc: "CCTV surveillance & safe locality" },
    { icon: Bath, title: "Attached Bathrooms", desc: "Private, hygienic bathrooms for every room" },
    { icon: Refrigerator, title: "Fridge & TV", desc: "Fully furnished with appliances included" },
    { icon: CookingPot, title: "Personal Kitchen", desc: "Cook your own meals anytime you want" },
    { icon: Clock, title: "Instant Move-in", desc: "Book and shift on the same day" },
  ];

  // ⭐ Updated Stats for LAW GATE
  const stats = [
    { value: "5+", label: "Premium PGs", icon: Home },
    { value: "500+", label: "Happy Residents", icon: Users },
    { value: "Law Gate", label: "Prime Location", icon: MapPin },
    { value: "4.8", label: "Average Rating", icon: Star },
  ];

  // ⭐ Updated Testimonials for LAW GATE Students
  const testimonials = [
    {
      name: "Harshit Kumar",
      role: "LPU B.Tech CSE",
      image: "👨‍💻",
      rating: 5,
      text: "Staying near Law Gate has been amazing — clean rooms, fast WiFi, and the kitchen setup is super helpful!",
    },
    {
      name: "Sanya Mehta",
      role: "LPU Fashion Design",
      image: "👩‍🎨",
      rating: 5,
      text: "The personal kitchen and attached bathroom made my stay extremely comfortable. Highly recommended!",
    },
    {
      name: "Arjun Singh",
      role: "LPU MBA",
      image: "👨‍🎓",
      rating: 5,
      text: "Great PG with all amenities. The Gulzar and Empire PGs are really worth the money and close to the campus.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl animate-fade-in-up">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              #1 PG Platform in Law Gate
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect PG Room Near LPU
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                Safe, Spacious & Fully Furnished 
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Find the best PG rooms at Law Gate, Cheema Park, Maheru & Near LPU.  
              AC rooms · Attached bathrooms · Personal kitchen · 24/7 security.
            </p>

            {/* SEARCH BAR */}
            <Card className="shadow-large border-2">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter location (e.g., Law Gate, Cheema Park)"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>

                  <Button size="lg" className="bg-gradient-hero shadow-glow h-12 px-8" asChild>
                    <Link to="/listings">
                      <Search className="h-5 w-5 mr-2" />
                      Search PG
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs text-muted-foreground">Popular:</span>
                  {["Law Gate", "Cheema Park", "Maheru", "Empire"].map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Best PG Amenities in Law Gate</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fully furnished rooms with AC, geyser, fridge, RO, WiFi, 24/7 power backup & personal kitchen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Award className="h-3 w-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Residents Love Staying Here</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real feedback from LPU students staying at Law Gate PGs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card
                key={idx}
                className="hover:shadow-large transition-all animate-fade-in-up"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-3">{testimonial.image}</div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero text-white border-0 shadow-large">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 animate-float" />

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Book Your Room?
              </h2>

              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Choose from 5+ verified, fully furnished PGs near LPU. Instant move-in available!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/listings">
                    Explore Properties
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  asChild
                >
                  <a href="https://wa.me/919447812177" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;