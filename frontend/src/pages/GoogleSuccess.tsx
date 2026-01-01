import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      try {
        // Decode JWT to extract user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Create user object from JWT payload
        const user = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role
        };
        
        // Use login from AuthContext
        login(token, user);
        
        toast.success(`Welcome back, ${user.name}!`);
        
        // Redirect based on role
        setTimeout(() => {
          if (user.role === 'owner') {
            navigate("/owner-dashboard", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        }, 500);
        
      } catch (error) {
        console.error('Error processing token:', error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    } else {
      toast.error("No authentication token received.");
      navigate("/login");
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-2xl font-bold text-slate-900">Login Successful!</h2>
        <p className="text-slate-600">Redirecting you now...</p>
      </div>
    </div>
  );
};

export default GoogleSuccess;