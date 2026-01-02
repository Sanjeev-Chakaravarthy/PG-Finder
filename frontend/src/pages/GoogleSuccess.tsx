import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false); // Prevent double processing in React strict mode

  useEffect(() => {
    // Prevent running twice
    if (hasProcessed.current) return;
    
    const processLogin = () => {
      const token = searchParams.get("token");
      
      if (!token) {
        toast.error("No authentication token received.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Decode JWT to extract user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          toast.error("Token expired. Please login again.");
          navigate("/login", { replace: true });
          return;
        }

        // Check if this is a temporary token (for role selection)
        if (payload.temp) {
          toast.error("Please complete role selection first.");
          navigate("/login", { replace: true });
          return;
        }
        
        // Create user object from JWT payload
        const user = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role
        };

        // Validate that we have all required fields
        if (!user.id || !user.role) {
          throw new Error("Invalid token payload");
        }
        
        // Mark as processed to prevent double execution
        hasProcessed.current = true;
        
        // Use login from AuthContext (this will set localStorage and state)
        login(token, user);
        
        toast.success(`Welcome back, ${user.name}!`);
        
        // Redirect based on role
        setTimeout(() => {
          if (user.role === 'owner') {
            navigate("/owner-dashboard", { replace: true });
          } else {
            navigate("/", { replace: true }); // Redirect to home page (root)
          }
        }, 500);
        
      } catch (error) {
        console.error('Error processing token:', error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login", { replace: true });
      }
    };

    processLogin();
  }, []); // Empty deps - only run once on mount

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