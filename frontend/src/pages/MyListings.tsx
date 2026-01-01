import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Eye, Trash2, Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:5001${imagePath}`;
};

const MyListings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/rooms/my-listings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        setRooms([]);
        setError("Failed to load listings. Server response invalid.");
        setLoading(false);
        return;
      }
      const data = await res.json();

      // Fix: Ensure data is an array
      if (Array.isArray(data)) {
        setRooms(data);
        setError("");
      } else {
        setRooms([]);
        setError("Failed to load listings. Server response invalid.");
      }
    } catch (err) {
      setRooms([]);
      setError("Network Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRooms();
  }, [token]);

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/rooms/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if(res.ok) {
        toast.success("Listing deleted");
        fetchRooms();
      } else {
        toast.error("Failed to delete");
      }
    } catch(e) { toast.error("Error deleting"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <Button asChild><Link to="/add-room"><PlusCircle className="mr-2 h-4 w-4" /> Add New Property</Link></Button>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded mb-4 flex items-center"><AlertCircle className="mr-2 h-4 w-4"/>{error}</div>}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
        ) : rooms.length === 0 && !error ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold mb-2">No Properties Listed</h3>
            <Button asChild><Link to="/add-room">List Your First PG</Link></Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card
                key={room._id}
                className={`group overflow-hidden border transition-all ${
                  room.status === "occupied"
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:border-primary/50"
                }`}
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img src={getImageUrl(room.image)} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge className={room.status === 'occupied' ? "bg-blue-600" : "bg-green-500"}>{room.status}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg truncate">{room.name}</h3>
                  <div className="text-sm text-muted-foreground mb-2"><MapPin className="h-3 w-3 inline mr-1"/> {room.location}</div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xl font-bold text-primary">₹{room.price}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
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

                    <Button size="sm" variant="destructive" onClick={() => handleDelete(room._id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
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