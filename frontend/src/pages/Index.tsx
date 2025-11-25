import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Home, Wifi, Utensils, Shield, DollarSign, Clock, Users, Star, ArrowRight, Check, TrendingUp, Award, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");

  const features = [
    { icon: Shield, title: "100% Safe", desc: "Verified properties with 24/7 security" },
    { icon: Wifi, title: "High-Speed WiFi", desc: "Unlimited internet included" },
    { icon: Utensils, title: "Homely Food", desc: "Nutritious meals 3 times a day" },
    { icon: DollarSign, title: "No Brokerage", desc: "Zero hidden charges" },
    { icon: Clock, title: "Quick Move-in", desc: "Get settled within 24 hours" },
    { icon: Users, title: "Great Community", desc: "Connect with like-minded people" },
  ];

  const stats = [
    { value: "500+", label: "Properties", icon: Home },
    { value: "10K+", label: "Happy Residents", icon: Users },
    { value: "50+", label: "Locations", icon: MapPin },
    { value: "4.8", label: "Average Rating", icon: Star },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      image: "👩‍💻",
      rating: 5,
      text: "Found my perfect PG in Koramangala within 2 days! The process was seamless and the amenities are exactly as described.",
    },
    {
      name: "Rahul Verma",
      role: "Product Manager",
      image: "👨‍💼",
      rating: 5,
      text: "Best decision ever! Great food, clean rooms, and amazing community. The comparison feature helped me choose the right one.",
    },
    {
      name: "Ananya Patel",
      role: "Designer",
      image: "👩‍🎨",
      rating: 5,
      text: "Affordable, safe, and close to my office. The staff is super helpful and the facilities are top-notch. Highly recommended!",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
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
              Find Your Perfect
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                Home Away From Home
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover premium PG & co-living spaces across Law Gate. Safe, affordable, and fully-furnished rooms with all amenities.
            </p>

            {/* Search Bar */}
            <Card className="shadow-large border-2">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter location (e.g., Koramangala, HSR Layout)"
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
                  {["Koramangala", "HSR Layout", "Whitefield", "Electronic City"].map((area) => (
                    <Badge key={area} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4" variant="outline">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need, All in One Place</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide premium amenities and services to make your stay comfortable and hassle-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4" variant="outline">
              <Award className="h-3 w-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Residents Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of happy residents who found their perfect home with us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="hover:shadow-large transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero text-white border-0 shadow-large animate-fade-in">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 animate-float" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect PG?</h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Browse through 500+ verified properties and book your room in minutes. No brokerage, no hassle!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="shadow-medium" asChild>
                  <Link to="/listings">
                    Explore Properties
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                  <a href="https://wa.me/918123456789" target="_blank" rel="noopener noreferrer">
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
