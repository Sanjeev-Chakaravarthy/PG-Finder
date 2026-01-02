import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Building2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import API_BASE_URL from "@/config/api";
const SelectRole = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const tempToken = searchParams.get("token");
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  // Redirect if already logged in
  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken && !tempToken) {
      // User is already logged in, redirect to home
      navigate("/", { replace: true });
    }
  }, [navigate, tempToken]);

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    if (!tempToken) {
      toast.error("Invalid session. Please try again.");
      navigate("/login", { replace: true });
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
        // Create user object
        const user = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        };

        // Use the login function from AuthContext
        login(data.token, user);
        
        toast.success(`Welcome to PG Finder, ${data.user.name}!`);
        
        // Small delay then redirect based on role
        setTimeout(() => {
          if (data.user.role === "owner") {
            navigate("/owner-dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 500);
      } else {
        toast.error(data.error || "Failed to complete signup");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Role selection error:", error);
      toast.error("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  // Check if token is present
  if (!tempToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Session Expired</h2>
            <p className="text-muted-foreground mb-4">
              Your session has expired. Please login again.
            </p>
            <Button onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Choose how you'd like to use PG Finder
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Role Card */}
              <button
                onClick={() => setSelectedRole("user")}
                disabled={isLoading}
                className={`p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                  selectedRole === "user"
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-slate-200 hover:border-blue-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                disabled={isLoading}
                className={`p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                  selectedRole === "owner"
                    ? "border-purple-500 bg-purple-50 shadow-lg"
                    : "border-slate-200 hover:border-purple-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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