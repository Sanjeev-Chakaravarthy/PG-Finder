import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Star, Wifi, Wind, Utensils, Car, Dumbbell,
  ShowerHead, Shield, Check, Phone, MessageCircle, Loader2, Trash2, Settings,
  Play, Pause, ChevronLeft, Volume2, VolumeX, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/config/api";

const getMediaUrl = (mediaPath: string) => {
  if (!mediaPath) return "https://via.placeholder.com/800x600?text=No+Image";
  if (mediaPath.startsWith("http")) return mediaPath;
  return `${API_BASE_URL}${mediaPath}`;
};

const isVideo = (path: string) => {
  if (!path) return false;
  return /\.(mp4|webm|mov|avi)$/i.test(path);
};

const MediaGallery = ({ mediaFiles }: { mediaFiles: string[] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsPlaying(false);
    setImageError(false);
    setCurrentTime(0);
    resetControlsTimer();
  };

  const scrollToThumbnail = (index: number) => {
    if (thumbnailContainerRef.current) {
      const thumbnail = thumbnailContainerRef.current.children[index] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleNext = () => {
    const newIndex = (selectedIndex + 1) % mediaFiles.length;
    setSelectedIndex(newIndex);
    scrollToThumbnail(newIndex);
    setIsPlaying(false);
    setImageError(false);
    setCurrentTime(0);
    resetControlsTimer();
  };

  const handlePrev = () => {
    const newIndex = (selectedIndex - 1 + mediaFiles.length) % mediaFiles.length;
    setSelectedIndex(newIndex);
    scrollToThumbnail(newIndex);
    setIsPlaying(false);
    setImageError(false);
    setCurrentTime(0);
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resetControlsTimer = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    resetControlsTimer();
  }, [isPlaying]);

  const canScrollUp = selectedIndex > 0;
  const canScrollDown = selectedIndex < mediaFiles.length - 1;

  if (!mediaFiles || mediaFiles.length === 0) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-3">🏠</div>
          <span className="text-gray-500 font-medium">No Media Available</span>
        </div>
      </div>
    );
  }

  const currentMedia = mediaFiles[selectedIndex];
  const isCurrentVideo = isVideo(currentMedia);
  const mediaUrl = getMediaUrl(currentMedia);
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex gap-4">
      <div className="w-20 flex-shrink-0 relative">
        {canScrollUp && (
          <button
            onClick={handlePrev}
            className="absolute top-0 left-1/2 -translate-x-[65%] z-10 h-10 w-10 bg-gradient-to-b from-white via-white to-transparent flex items-start justify-center pt-1 hover:from-gray-50 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 rotate-90" />
          </button>
        )}

        <div 
          ref={thumbnailContainerRef}
          className="flex flex-col gap-3 overflow-y-auto max-h-[400px] sm:max-h-[500px] pr-2 pt-12 pb-12 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          style={{ scrollbarWidth: 'thin' }}
        >
          {mediaFiles.map((media, idx) => {
            const thumbUrl = getMediaUrl(media);
            const isThumbVideo = isVideo(media);
            
            return (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                  idx === selectedIndex 
                    ? "border-primary shadow-md" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {isThumbVideo ? (
                  <div className="w-full h-full bg-black flex items-center justify-center relative">
                    <Play className="h-5 w-5 text-white" />
                    <div className="absolute bottom-1 right-1">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Play className="h-2 w-2 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/80x80?text=Img";
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {canScrollDown && (
          <button
            onClick={handleNext}
            className="absolute bottom-1 left-1/2 -translate-x-[78%] z-10 h-9 w-9 bg-gradient-to-t from-white via-white to-transparent flex items-end justify-center pb-1.5 hover:from-gray-50 rounded-full shadow-sm"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 -rotate-90" />
          </button>
        )}
      </div>

      <div className="flex-1 relative bg-white rounded-lg overflow-hidden border">
        <div className="relative w-full h-[400px] sm:h-[500px] bg-white flex items-center justify-center">
          {isCurrentVideo ? (
            <div className="relative w-full h-full group bg-white">
              <video
                ref={videoRef}
                key={mediaUrl}
                src={mediaUrl}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration);
                }}
                onError={(e) => {
                  console.error('Video load error:', mediaUrl);
                  setImageError(true);
                }}
              />
              
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 min-h-[400px] sm:min-h-[500px]">
                  <div className="text-center text-white">
                    <div className="text-5xl mb-3">📹</div>
                    <span>Video unavailable</span>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                      showControls ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handlePlaybackRateChange.bind(null, playbackRate === 2 ? 1 : playbackRate === 1.5 ? 2 : 1.5)}
                          className="px-3 py-1 bg-black/60 text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
                        >
                          {playbackRate}x
                        </button>
                        <button
                          onClick={handleRestart}
                          className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                          title="Restart"
                        >
                          <RotateCcw className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePlayPause}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all group-hover:scale-110"
                    >
                      <div className="p-4 rounded-full bg-white/95 hover:bg-white hover:scale-110 transition-all shadow-2xl">
                        {isPlaying ? (
                          <Pause className="h-10 w-10 text-black" />
                        ) : (
                          <Play className="h-10 w-10 text-black ml-1" />
                        )}
                      </div>
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                      <div className="w-full">
                        <div 
                          className="relative w-full h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = (e.clientX - rect.left) / rect.width;
                            const newTime = percent * duration;
                            handleSeek(newTime);
                          }}
                        >
                          <div 
                            className="absolute left-0 top-0 h-full bg-orange-500 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          />
                          
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full shadow-lg transform -translate-x-1/2 cursor-pointer hover:scale-125 transition-transform"
                            style={{ left: `${progressPercentage}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-white text-xs mt-2">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={handlePlayPause}
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            {isPlaying ? (
                              <Pause className="h-6 w-6 text-white" />
                            ) : (
                              <Play className="h-6 w-6 text-white ml-0.5" />
                            )}
                          </button>
                          <button
                            onClick={handleVolumeToggle}
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            {isMuted ? (
                              <VolumeX className="h-6 w-6 text-white" />
                            ) : (
                              <Volume2 className="h-6 w-6 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!showControls && isPlaying && (
                    <button
                      onClick={handlePlayPause}
                      className="absolute bottom-4 left-4 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                    >
                      <Pause className="h-5 w-5 text-white" />
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {!imageError ? (
                <img
                  src={mediaUrl}
                  alt={`Media ${selectedIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error:', mediaUrl);
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="w-full min-h-[400px] sm:min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="text-center">
                    <div className="text-5xl mb-3">📷</div>
                    <span className="text-gray-600 font-medium">Image unavailable</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [room, setRoom] = useState<any>(null);
  const [visitDate, setVisitDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/rooms/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.media && Array.isArray(data.media) && data.media.length > 0) {
          data.media = data.media;
        } else if (data.image) {
          data.media = [data.image];
        } else {
          data.media = [];
        }
        setRoom(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      toast.error("Please login to book a visit!");
      navigate("/login");
      return;
    }
    if (!visitDate) {
      toast.error("Please select a date for your visit.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/book/${id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ visitDate })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Visit Scheduled! Room marked as Booked.");
        navigate(0);
      } else {
        toast.error(data.error || "Booking failed");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking? The room will become available again.")) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/cancel/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success("Booking Cancelled");
        navigate(0);
      } else {
        toast.error("Failed to cancel");
      }
    } catch (error) {
      toast.error("Error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOccupancy = async () => {
    if (!confirm("Confirming payment means the user has moved in. This room will be removed from listings. Continue?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/occupy/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success("Room marked as Occupied!");
        navigate("/my-listings");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    const isConfirmed = window.confirm("⚠️ ARE YOU SURE? \nThis will permanently delete this PG listing from the website. This action cannot be undone.");
    
    if (!isConfirmed) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("PG Listing Deleted Successfully");
        navigate("/my-listings");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Connection Error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
        <Button asChild><Link to="/listings">Back to Search</Link></Button>
      </div>
    );
  }

  const facilityIcons: any = {
    wifi: <Wifi className="h-5 w-5" />, ac: <Wind className="h-5 w-5" />, food: <Utensils className="h-5 w-5" />,
    laundry: <ShowerHead className="h-5 w-5" />, parking: <Car className="h-5 w-5" />, gym: <Dumbbell className="h-5 w-5" />,
    cleaning: <ShowerHead className="h-5 w-5" />, security: <Shield className="h-5 w-5" />
  };

  const isOwner =
    user &&
    room?.ownerId &&
    (room.ownerId._id === user.id || room.ownerId === user.id);
  const isBooker = user && room.bookedBy && user.id === room.bookedBy._id;

  const backLink = isOwner ? "/my-listings" : "/listings";
  const backText = isOwner ? "Back to My Listings" : "Back to Listings";

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to={backLink}>
            <ArrowLeft className="h-4 w-4 mr-2" /> {backText}
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <Card className="overflow-hidden border shadow-lg">
              <CardContent className="p-6">
                <MediaGallery mediaFiles={room.media || []} />
              </CardContent>
            </Card>

            <div className="flex justify-between items-start px-1">
              <div>
                <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {room.location}
                </div>
                <div className="flex items-center gap-4 mt-2">
                   <Badge variant="secondary" className="px-3 py-1">{room.occupancy}</Badge>
                   <Badge variant="outline" className="px-3 py-1">{room.gender}</Badge>
                   <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold text-sm">{room.rating || 4.5}</span>
                   </div>
                </div>
              </div>
              <div className="text-right p-2 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  ₹{room.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>

            {isOwner && room.status === 'booked' && (
              <Card className="bg-blue-50 border-blue-200 shadow-sm">
                <CardHeader className="pb-3"><CardTitle className="text-blue-700 text-lg">Booking Request</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p><strong>Booked By:</strong> {room.bookedBy?.name}</p>
                        <p className="text-sm text-muted-foreground">{room.bookedBy?.email}</p>
                        <p className="mt-2"><strong>Requested Visit Date:</strong> <Badge variant="outline" className="ml-2 bg-white">{room.visitDate}</Badge></p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 flex-1 md:flex-none" onClick={handleCancel}>Reject</Button>
                        <Button className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none" onClick={handleOccupancy}>Confirm Occupancy</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-md rounded-xl border-0">
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 bg-muted rounded-lg">
                    <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="amenities" className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Amenities</TabsTrigger>
                    <TabsTrigger value="rules" className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Rules</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6 animate-in fade-in-50">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">About This Property</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                        {room.description || "No description provided by the owner."}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-xl border">
                      <div>
                         <p className="text-sm text-muted-foreground mb-1">Security Deposit</p>
                         <p className="font-semibold text-lg">₹{room.deposit ? room.deposit.toLocaleString() : "N/A"}</p>
                      </div>
                      <div>
                         <p className="text-sm text-muted-foreground mb-1">Notice Period</p>
                         <p className="font-semibold text-lg">{room.noticePeriod || 30} Days</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="amenities" className="mt-4 animate-in fade-in-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {room.facilities && Object.entries(room.facilities).map(([key, val]) => (
                        <div key={key} className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${val ? "bg-primary/5 border-primary/20" : "bg-gray-50 border-gray-100 opacity-60"}`}>
                           <div className={`p-2 rounded-full ${val ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-400"}`}>
                             {facilityIcons[key] || <Check className="h-5 w-5" />}
                           </div>
                           <span className="font-medium capitalize">{key}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="rules" className="mt-4 animate-in fade-in-50">
                     {room.rules && room.rules.length > 0 ? (
                       <ul className="space-y-3 border rounded-xl p-6 bg-muted/10">
                         {room.rules.map((rule: string, i: number) => (
                           <li key={i} className="flex items-start">
                               <Check className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" /> 
                               <span className="leading-tight">{rule}</span>
                           </li>
                         ))}
                       </ul>
                     ) : <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl">No specific house rules mentioned.</div>}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-t-4 border-t-primary rounded-xl overflow-hidden">
              <CardHeader className="bg-muted/20 pb-4">
                {isOwner ? (
                  <>
                    <CardTitle>Owner Controls</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {new Date(room.updatedAt).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <CardTitle>
                    {room.status === 'available' ? 'Book a Visit' : 'Status'}
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                {isOwner && room?._id ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 rounded-lg flex items-start gap-3">
                      <Settings className="h-6 w-6 text-primary mt-1" />
                      <div>
                          <p className="font-medium">Managing Property</p>
                          <p className="text-sm text-muted-foreground leading-tight">You are viewing your listing. Use the dashboard for more options.</p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full py-6 text-md"
                      disabled={room.status === "occupied"}
                      title={room.status === "occupied" ? "Occupied rooms cannot be edited" : "Edit Property"}
                      onClick={() => {
                        if (room.status !== "occupied") {
                          navigate(`/edit-room/${room._id}`);
                        }
                      }}
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      {room.status === "occupied" ? "Editing Locked" : "Edit Property Details"}
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full py-6 text-md"
                      onClick={handleDeleteRoom}
                      disabled={actionLoading}
                    >
                      <Trash2 className="h-5 w-5 mr-2" /> Delete Property Listing
                    </Button>
                  </div>
                ) : (
                  <>
                    {room.status === 'available' ? (
                      <>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Select Visit Date</label>
                            <Input type="date" onChange={(e) => setVisitDate(e.target.value)} className="mb-4 py-6 text-lg" />
                        </div>
                        <Button onClick={handleBook} className="w-full bg-gradient-hero shadow-glow py-6 text-lg" disabled={actionLoading}>
                          {actionLoading ? "Scheduling..." : "Schedule Free Visit"}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-2">No payment required for booking.</p>
                      </>
                    ) : (
                      <div className="text-center p-6 bg-muted/30 rounded-lg">
                        {room.status === 'booked' && (
                          <Badge className="text-lg mb-4 px-4 py-2 bg-yellow-500 text-black">
                            Pending Approval
                          </Badge>
                        )}
                        {room.status === 'occupied' && (
                          <Badge className="text-lg mb-4 px-4 py-2 bg-green-600 text-white">
                            Reserved
                          </Badge>
                        )}
                        {room.status === 'booked' && <p className="text-sm text-muted-foreground">Visit scheduled for: <strong>{room.visitDate}</strong></p>}
                        
                        {isBooker && (
                          <div className="mt-6">
                            <p className="text-sm text-green-600 font-medium mb-4 flex justify-center items-center"><Check className="h-4 w-4 mr-1"/> You reserved this!</p>
                            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50" onClick={handleCancel}>Cancel Reservation</Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Separator className="my-4" />
                    {room.status !== "occupied" && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="w-full py-6"
                          asChild
                          disabled={!room.ownerPhone}
                        >
                          <a href={`tel:${room.ownerPhone}`}>
                            <Phone className="h-5 w-5 mr-2" /> Call Agent
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full py-6"
                          asChild
                          disabled={!room.ownerWhatsapp}
                        >
                          <a
                            href={`https://wa.me/91${room.ownerWhatsapp}?text=Hi, I am interested in your PG: ${room.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-5 w-5 mr-2" /> Chat
                          </a>
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoomDetails;
