import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Star,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import API_BASE_URL from "@/config/api";

const getMediaUrl = (mediaPath: string) => {
  if (!mediaPath) {
    return "https://via.placeholder.com/400x300?text=No+Image";
  }
  
  if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
    return mediaPath;
  }
  
  const cleanPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  return `${API_BASE_URL}${cleanPath}`;
};

interface Room {
  _id: string;
  name: string;
  location: string;
  area: string;
  price: number;
  occupancy: string;
  gender: string;
  image: string;
  media?: string[];
  rating: number;
  reviews: number;
  status: "available" | "booked" | "occupied";
}

const MyListings = () => {
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "owner") {
      navigate("/");
      return;
    }

    fetchMyRooms();
  }, [user, authLoading, token, navigate]);

  const fetchMyRooms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Raw API Response:", data);
        
        const roomsWithMedia = data.map((room: any) => {
          console.log("Processing room:", {
            id: room._id,
            name: room.name,
            hasMedia: !!room.media,
            mediaLength: room.media?.length,
            media: room.media,
            hasImage: !!room.image,
            image: room.image
          });
          
          return {
            ...room,
            media: room.media && Array.isArray(room.media) && room.media.length > 0 
              ? room.media 
              : room.image 
                ? [room.image] 
                : []
          };
        });
        
        console.log("Processed rooms with media:", roomsWithMedia);
        setRooms(roomsWithMedia);
      } else {
        toast.error("Failed to load your listings");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Property deleted successfully");
        setRooms(rooms.filter((room) => room._id !== roomId));
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "booked":
        return "bg-yellow-500";
      case "occupied":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Listings</h1>
            <p className="text-muted-foreground">
              Manage your property listings and bookings
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-hero shadow-glow w-full md:w-auto"
          >
            <Link to="/add-room">
              <Plus className="h-5 w-5 mr-2" />
              Add New Property
            </Link>
          </Button>
        </div>

        {rooms.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  No listings yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first property to the platform
                </p>
              </div>
              <Button asChild className="bg-gradient-hero">
                <Link to="/add-room">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Property
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              // Helper function to check if a file is a video
              const isVideoFile = (path: string) => {
                if (!path) return false;
                return /\.(mp4|mov|webm|avi)$/i.test(path);
              };

              // Get the first IMAGE from media array (skip videos for thumbnail)
              let coverImage = "";
              if (room.media && room.media.length > 0) {
                // Find first image (non-video) in media array
                coverImage = room.media.find((media: string) => !isVideoFile(media)) || room.media[0];
              } else if (room.image) {
                coverImage = room.image;
              }

              const finalUrl = getMediaUrl(coverImage);
              
              console.log("Rendering room card:", {
                roomId: room._id,
                roomName: room.name,
                coverImage,
                finalUrl,
                mediaArray: room.media,
                isVideo: isVideoFile(coverImage)
              });

              return (
                <Card
                  key={room._id}
                  className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border bg-white"
                >
                  {/* Image Section */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                      src={finalUrl}
                      alt={room.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onLoad={(e) => {
                        console.log("Image loaded successfully:", finalUrl);
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', {
                          roomId: room._id,
                          roomName: room.name,
                          coverImage,
                          finalUrl,
                          mediaArray: room.media,
                          imageAttr: room.image
                        });
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />

                    {/* Status Badge - Bottom Left */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <Badge
                        className={`${getStatusColor(
                          room.status
                        )} text-white shadow-md capitalize px-3 py-1`}
                      >
                        {room.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-base line-clamp-1 mb-1">
                        {room.name}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{room.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {room.occupancy}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {room.gender}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t mb-4">
                      <div>
                        <div className="text-xl font-bold">
                          ₹{room.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          per month
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Link to={`/room/${room._id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={room.status === "occupied"}
                      >
                        <Link to={`/edit-room/${room._id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your property listing.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(room._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyListings;
