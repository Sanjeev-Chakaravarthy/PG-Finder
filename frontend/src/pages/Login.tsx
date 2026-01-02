import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FcGoogle } from "react-icons/fc";

// Get API URL from environment variable with fallback
import API_BASE_URL from "@/config/api";


const Login = () => {
  const handleGoogleLogin = () => {
    const googleAuthUrl = `${API_BASE_URL}/api/auth/google`;
    console.log('🔗 Redirecting to:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loginUrl = `${API_BASE_URL}/api/auth/login`;
    console.log('🔗 Attempting login to:', loginUrl);

    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', res.status);

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Check if backend is running.");
      }

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate("/");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error(`Cannot connect to server at ${API_BASE_URL}. Please check if backend is running.`);
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login to PG Haven</CardTitle>
            <p className="text-sm text-center text-muted-foreground">
              Enter your email and password to access your account
            </p>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4 flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-hero text-white" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;