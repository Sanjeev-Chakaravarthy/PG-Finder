import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Eye, Trash2, Loader2, PlusCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import API_BASE_URL from "@/config/api";

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
};

const MyListings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  const fetchRooms = async (isRetry = false) => {
    if (isRetry) {
      setRetrying(true);
    } else {
      setLoading(true);
    }
    setError("");
    
    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/api/rooms/my-listings`;
      console.log('Fetching from:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const res = await fetch(url, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Response status:', res.status);

      if (!res.ok) {
        let errorText;
        try {
          const errorData = await res.json();
          errorText = errorData.message || errorData.error || `Server error: ${res.status}`;
        } catch {
          errorText = await res.text() || `Server responded with status ${res.status}`;
        }
        console.error('Error response:', errorText);
        throw new Error(errorText);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Backend may be down.");
      }

      const data = await res.json();
      console.log('Received data:', data);

      // Handle different response formats
      if (Array.isArray(data)) {
        setRooms(data);
      } else if (data.rooms && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      } else if (data.data && Array.isArray(data.data)) {
        setRooms(data.data);
      } else if (data.success === false) {
        throw new Error(data.message || "Failed to fetch listings");
      } else {
        console.error('Unexpected data format:', data);
        setRooms([]);
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setRooms([]);
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError("Request timed out. The server might be sleeping on Render's free tier. Please wait 30-60 seconds and try again.");
        } else if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          setError("Cannot connect to server. If using Render free tier, the server may be sleeping. Please wait 30-60 seconds for it to wake up, then click 'Retry'.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred while loading listings.");
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRooms();
    } else {
      setLoading(false);
      setError("Please login to view your listings.");
    }
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    
    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/api/rooms/${id}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const res = await fetch(url, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        toast.success("Listing deleted successfully");
        fetchRooms();
      } else {
        let errorText;
        try {
          const errorData = await res.json();
          errorText = errorData.message || errorData.error || "Failed to delete";
        } catch {
          errorText = await res.text() || "Failed to delete";
        }
        toast.error(errorText);
      }
    } catch (e) {
      console.error('Delete error:', e);
      if (e instanceof Error && e.name === 'AbortError') {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error("Network error while deleting. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <Button asChild>
            <Link to="/add-room">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
            </Link>
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
            <div className="flex items-start">
              <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold mb-1">Connection Error</div>
                <div className="text-sm mb-2">{error}</div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => fetchRooms(true)}
                  disabled={retrying}
                  className="mt-2"
                >
                  {retrying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Connection
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
            <p className="text-muted-foreground text-sm">Loading your listings...</p>
            <p className="text-muted-foreground text-xs mt-2">
              If using Render free tier, initial load may take 30-60 seconds
            </p>
          </div>
        ) : rooms.length === 0 && !error ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold mb-2">No Properties Listed</h3>
            <p className="text-muted-foreground mb-4">Start earning by listing your first PG property</p>
            <Button asChild>
              <Link to="/add-room">List Your First PG</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card
                key={room._id}
                className={`group overflow-hidden border transition-all ${
                  room.status === "occupied"
                    ? "opacity-75"
                    : "hover:border-primary/50 hover:shadow-lg"
                }`}
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img 
                    src={getImageUrl(room.image)} 
                    alt={room.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={room.status === 'occupied' ? "bg-blue-600" : "bg-green-500"}>
                      {room.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg truncate mb-1">{room.name}</h3>
                  <div className="text-sm text-muted-foreground mb-3 flex items-center">
                    <MapPin className="h-3 w-3 inline mr-1 flex-shrink-0" /> 
                    <span className="truncate">{room.location}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xl font-bold text-primary">
                      ₹{typeof room.price === 'number' ? room.price.toLocaleString() : room.price}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Updated: {new Date(room.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/room/${room._id}`}>Manage</Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={room.status === "occupied"}
                      title={room.status === "occupied" ? "Occupied rooms cannot be edited" : "Edit listing"}
                      onClick={() => {
                        if (room.status !== "occupied") {
                          navigate(`/edit-room/${room._id}`);
                        }
                      }}
                    >
                      {room.status === "occupied" ? "Locked" : "Edit"}
                    </Button>

                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(room._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyListings;