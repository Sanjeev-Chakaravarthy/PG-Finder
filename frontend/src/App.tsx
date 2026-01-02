import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserDashboard from "./pages/UserDashboard"; // Import
import GoogleSuccess from "./pages/GoogleSuccess";
import SelectRole from "./pages/SelectRole";

// Pages
import Welcome from "./pages/Welcome";
import Index from "./pages/Index";
import OwnerHome from "./pages/OwnerHome";
import Listings from "./pages/Listings";
import RoomDetails from "./pages/RoomDetails";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddRoom from "./pages/AddRoom";
import OwnerDashboard from "./pages/OwnerDashboard";
import MyListings from "./pages/MyListings";
import EditRoom from "./pages/EditRoom";

const queryClient = new QueryClient();

// Helper Component: Redirects logged-in users away from the Welcome Page
const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a spinner

  if (user) {
    // If Owner -> Go to Dashboard
    if (user.role === "owner")
      return <Navigate to="/owner-dashboard" replace />;
    // If User -> Go to Home
    return <Navigate to="/home" replace />;
  }
  return children;
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* --- ENTRY POINT (Public Only) --- */}
            <Route
              path="/"
              element={
                <PublicOnlyRoute>
                  <Welcome />
                </PublicOnlyRoute>
              }
            />
            {/* --- USER ROUTES --- */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              }
            />
            <Route path="/listings" element={<Listings />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/compare" element={<Compare />} />
            {/* --- OWNER ROUTES --- */}
            <Route path="/partner" element={<OwnerHome />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route
              path="/owner-dashboard"
              element={
                <PrivateRoute>
                  <OwnerDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
            {/* --- AUTH --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/user-dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/google-success" element={<GoogleSuccess />} />
            <Route path="/select-role" element={<SelectRole />} />{" "}
            {/* ADD THIS */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
