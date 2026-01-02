import { Link } from "react-router-dom";
import { 
  User, Building2, ArrowRight, Star, ShieldCheck, Zap, 
  MapPin, Globe2, Quote 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      {/* --- HERO SECTION --- */}
      <main className="flex-1">
        <section className="relative pt-20 pb-32 overflow-hidden">
          {/* Background Decorative Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -z-10" />

          <div className="container px-4 text-center">
            <Badge variant="outline" className="mb-6 py-2 px-4 text-sm border-primary/20 bg-primary/5 text-primary animate-in fade-in zoom-in duration-700">
              <Globe2 className="w-4 h-4 mr-2" /> India's #1 Co-Living Network
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">PG Finder</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Simplifying the search for PGs and Hostels. Whether you are a student looking for a home or an owner looking for tenants, we've got you covered.
            </p>

            {/* SPLIT CHOICE CARDS */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
              
              {/* TENANT CARD */}
              <Link to="/home" className="group relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Card className="h-full border-2 border-transparent hover:border-blue-500/20 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="absolute top-0 right-0 bg-blue-500 w-16 h-16 opacity-5 rounded-bl-full" />
                  <CardContent className="p-8 flex flex-col items-center text-center h-full">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                      <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">I need a Room</h2>
                    <p className="text-muted-foreground mb-8 flex-1">
                      Search thousands of verified PGs with photos, reviews, and amenities across top cities.
                    </p>
                    <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                      Find My PG <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* OWNER CARD */}
              <Link to="/partner" className="group relative">
                <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Card className="h-full border-2 border-transparent hover:border-orange-500/20 bg-gradient-to-b from-orange-50/50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="absolute top-0 right-0 bg-orange-500 w-16 h-16 opacity-5 rounded-bl-full" />
                  <CardContent className="p-8 flex flex-col items-center text-center h-full">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-6 transition-transform duration-300">
                      <Building2 className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">I am an Owner</h2>
                    <p className="text-muted-foreground mb-8 flex-1">
                      List your property for free, manage tenants, rent collection, and grow your business.
                    </p>
                    <Button className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20">
                      List Property <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

            </div>
          </div>
        </section>

        {/* --- WHY CHOOSE US --- */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
              <p className="text-muted-foreground">Whether renting or hosting, we make it seamless.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "100% Verified", desc: "Every user and property is physically verified." },
                { icon: Zap, title: "Instant Booking", desc: "Book your stay or accept tenants in minutes." },
                { icon: MapPin, title: "Prime Locations", desc: "Properties close to colleges and tech parks." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section className="py-24 bg-background overflow-hidden relative">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-4">Community Love</Badge>
              <h2 className="text-4xl font-bold mb-4">Trusted by 10,000+ Users</h2>
              <p className="text-muted-foreground">Don't just take our word for it. Here is what students and owners say.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  text: "Finding a PG near Law Gate was a nightmare until I found PG Finder. Verified photos saved me so much time!",
                  name: "Priya Sharma",
                  role: "Student, LPU",
                  rating: 5
                },
                {
                  text: "As an owner, managing rent and vacancies was hard. Now I get leads automatically. Best platform ever.",
                  name: "Rajesh Kumar",
                  role: "PG Owner, Phagwara",
                  rating: 5
                },
                {
                  text: "Zero brokerage and direct contact with the owner. The app interface is super clean and easy to use.",
                  name: "Rahul Verma",
                  role: "Software Engineer",
                  rating: 4
                }
              ].map((t, i) => (
                <Card key={i} className="border bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
                  <CardContent className="p-8">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    <p className="text-lg italic text-foreground/80 mb-6">"{t.text}"</p>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h4 className="font-bold">{t.name}</h4>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(t.rating)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Welcome;