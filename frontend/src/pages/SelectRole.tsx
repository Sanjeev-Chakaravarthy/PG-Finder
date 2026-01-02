import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Building2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SelectRole = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const tempToken = searchParams.get("token");
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    if (!tempToken) {
      toast.error("Invalid session. Please try again.");
      navigate("/signup");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google/complete`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        toast.success(`Welcome, ${data.user.name}!`);
        
        // Redirect based on role
        if (data.user.role === "owner") {
          navigate("/owner-dashboard");
        } else {
          navigate("/home");
        }
        
        // Force reload to update auth state
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to complete signup");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl shadow-xl border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Welcome, {name}! 👋
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Choose how you'd like to use PG Haven
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Role Card */}
              <button
                onClick={() => setSelectedRole("user")}
                className={`p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                  selectedRole === "user"
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-full ${
                    selectedRole === "user" ? "bg-blue-500" : "bg-slate-100"
                  }`}>
                    <Home className={`h-8 w-8 ${
                      selectedRole === "user" ? "text-white" : "text-slate-600"
                    }`} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">I'm Looking for a PG</h3>
                    <p className="text-sm text-muted-foreground">
                      Find and book the perfect PG accommodation
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-left">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Browse PG listings
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Compare properties
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Book rooms instantly
                      </li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Owner Role Card */}
              <button
                onClick={() => setSelectedRole("owner")}
                className={`p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                  selectedRole === "owner"
                    ? "border-purple-500 bg-purple-50 shadow-lg"
                    : "border-slate-200 hover:border-purple-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-full ${
                    selectedRole === "owner" ? "bg-purple-500" : "bg-slate-100"
                  }`}>
                    <Building2 className={`h-8 w-8 ${
                      selectedRole === "owner" ? "text-white" : "text-slate-600"
                    }`} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">I'm a PG Owner</h3>
                    <p className="text-sm text-muted-foreground">
                      List your property and manage bookings
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-left">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        List your properties
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Manage bookings
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Track payments
                      </li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>

            <Button
              onClick={handleRoleSubmit}
              disabled={!selectedRole || isLoading}
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {isLoading ? "Setting up your account..." : "Continue"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SelectRole;