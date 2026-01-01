import { Link } from "react-router-dom";
import { 
  Building2, TrendingUp, ShieldCheck, Wallet, 
  ArrowRight, CheckCircle2, BarChart3, Smartphone, Users, LayoutDashboard, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const OwnerHome = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative py-24 lg:py-32 bg-slate-950 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-3xl animate-pulse" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="container relative z-10 px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 px-4 py-1.5 text-sm uppercase tracking-widest font-semibold backdrop-blur-md">
                For Property Owners
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                Unlock the True <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-400">
                  Potential of Your PG
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl border-l-4 border-orange-500 pl-6">
                Stop chasing tenants and rent payments. Switch to <strong>PG Haven</strong> for 100% occupancy, automated billing, and verified residents.
              </p>
              
              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {isOwner ? (
                  <>
                    <Button size="lg" className="h-16 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-900/20 rounded-full transition-transform hover:scale-105" asChild>
                      <Link to="/owner-dashboard">
                        <LayoutDashboard className="mr-2 w-5 h-5" /> Go to Dashboard
                      </Link>
                    </Button>
                    
                    {/* FIXED: Solid White Button for Visibility */}
                    <Button size="lg" className="h-16 px-8 text-lg bg-white text-slate-950 hover:bg-slate-200 rounded-full font-bold shadow-lg transition-transform hover:scale-105" asChild>
                      <Link to="/add-room">
                        <Plus className="mr-2 w-5 h-5" /> List New Property
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" className="h-16 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-900/20 rounded-full" asChild>
                      <Link to="/signup">
                        List Your Property Free <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button size="lg" className="h-16 px-8 text-lg bg-white text-slate-950 hover:bg-slate-200 rounded-full font-bold shadow-lg" asChild>
                      <Link to="/login">Owner Login</Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm font-medium text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" /> No Hidden Fees
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" /> 24/7 Support
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Graphic */}
            <div className="lg:w-1/2 w-full animate-in fade-in slide-in-from-right-10 duration-700 delay-200">
              <div className="relative rounded-2xl bg-slate-900 p-1 border border-slate-700 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900 rounded-xl p-6 border border-white/5">
                  
                  {/* Mock Window Controls */}
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  
                  {/* Mock Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg"><Wallet className="w-5 h-5 text-green-400" /></div>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">+24%</span>
                      </div>
                      <div className="text-3xl font-bold text-white mt-2">₹8.5L</div>
                      <div className="text-xs text-slate-400 mt-1">Yearly Revenue</div>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-5 h-5 text-blue-400" /></div>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Full</span>
                      </div>
                      <div className="text-3xl font-bold text-white mt-2">45/45</div>
                      <div className="text-xs text-slate-400 mt-1">Current Occupancy</div>
                    </div>
                  </div>

                  {/* Mock Chart Area */}
                  <div className="h-48 bg-slate-800/30 rounded-xl border border-slate-700/50 relative overflow-hidden flex items-end justify-between px-6 pb-0 pt-10">
                     {[40, 65, 50, 80, 60, 95, 85].map((h, i) => (
                       <div key={i} className="w-8 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm hover:opacity-80 transition-opacity" style={{ height: `${h}%` }} />
                     ))}
                  </div>
                </div>

                {/* FIXED: Revenue Badge Positioned cleanly at bottom left, no overlap */}
                <div className="absolute -bottom-6 -left-4 bg-white text-slate-900 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce border border-slate-200 z-20">
                  <div className="bg-green-100 p-2.5 rounded-full"><TrendingUp className="w-6 h-6 text-green-600" /></div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Revenue Up</p>
                    <p className="text-[10px] text-muted-foreground font-medium">vs last month</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Top PG Owners Choose Us?</h2>
            <p className="text-lg text-slate-600">Managing a property shouldn't be a full-time headache. We provide the technology to automate your business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Smartphone, 
                title: "Digital Management", 
                desc: "Manage your entire PG from your phone. Check-in tenants, collect rent, and handle complaints instantly." 
              },
              { 
                icon: ShieldCheck, 
                title: "Tenant Verification", 
                desc: "We perform digital KYC and background checks on every tenant so you can host with peace of mind." 
              },
              { 
                icon: BarChart3, 
                title: "Occupancy Boost", 
                desc: "Our AI-driven marketing ensures your listing reaches the right students and professionals at the right time." 
              },
              { 
                icon: Wallet, 
                title: "Rent Guarantee", 
                desc: "Say goodbye to late payments. We facilitate automated reminders and direct bank transfers." 
              },
              { 
                icon: Building2, 
                title: "Property Branding", 
                desc: "We help you create a professional brand for your PG with high-quality photos and descriptions." 
              },
              { 
                icon: Users, 
                title: "Dedicated Support", 
                desc: "A dedicated relationship manager to assist you with any operational challenges 24/7." 
              }
            ].map((item, i) => (
              <Card key={i} className="group border-0 shadow-lg shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:bg-orange-600 transition-colors">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to upgrade your business?</h2>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-lg bg-slate-900 text-white hover:bg-slate-800 shadow-lg" asChild>
              <Link to="/add-room">Start Listing Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OwnerHome;