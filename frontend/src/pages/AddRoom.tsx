import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Plus,
  X,
  Banknote,
  CalendarDays,
  MapPin,
  Home,
  ImagePlus,
  Loader2,
  QrCode,
} from "lucide-react";
import API_BASE_URL from "@/config/api";

const AddRoom = () => {
  const { token, user, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [roomStatus, setRoomStatus] = useState<string>("available");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [roomData, setRoomData] = useState({
    name: "",
    location: "",
    area: "",
    ownerPhone: "",
    ownerWhatsapp: "",
    price: "",
    deposit: "",
    noticePeriod: "30",
    occupancy: "Single",
    gender: "Co-ed",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentRule, setCurrentRule] = useState("");
  const [rules, setRules] = useState<string[]>([]);

  const [facilities, setFacilities] = useState({
    wifi: true,
    ac: false,
    food: false,
    laundry: false,
    parking: false,
    gym: false,
    cleaning: false,
    security: false,
  });
  const [qrFile, setQrFile] = useState<File | null>(null);

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (loading) return;
    
    if (!user || user.role !== "owner") {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!isEdit || !token) return;

    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          toast.error("Failed to load room details");
          return;
        }

        const data = await res.json();

        setRoomData({
          name: data.name || "",
          location: data.location || "",
          area: data.area || "",
          ownerPhone: data.ownerPhone || "",
          ownerWhatsapp: data.ownerWhatsapp || "",
          price: data.price?.toString() || "",
          deposit: data.deposit?.toString() || "",
          noticePeriod: data.noticePeriod?.toString() || "30",
          occupancy: data.occupancy || "Single",
          gender: data.gender || "Co-ed",
          description: data.description || "",
        });

        setFacilities(data.facilities || {});
        setRules(data.rules || []);
        setPreviewUrl(data.image ? `${API_BASE_URL}${data.image}` : null);

        setRoomStatus(data.status);
        setLastUpdated(data.updatedAt || null);

        setInitialData({
          roomData: {
            name: data.name || "",
            location: data.location || "",
            area: data.area || "",
            ownerPhone: data.ownerPhone || "",
            ownerWhatsapp: data.ownerWhatsapp || "",
            price: data.price?.toString() || "",
            deposit: data.deposit?.toString() || "",
            noticePeriod: data.noticePeriod?.toString() || "30",
            occupancy: data.occupancy || "Single",
            gender: data.gender || "Co-ed",
            description: data.description || "",
          },
          facilities: data.facilities || {},
          rules: data.rules || [],
          previewUrl: data.image ? `${API_BASE_URL}${data.image}` : null,
        });
      } catch {
        toast.error("Error loading room");
      }
    };

    fetchRoom();
  }, [id, isEdit, token]);

  const handleFacilityChange = (key: keyof typeof facilities) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleAddRule = () => {
    if (currentRule.trim() !== "") {
      setRules([...rules, currentRule.trim()]);
      setCurrentRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && roomStatus === "occupied") {
      toast.error("Occupied rooms cannot be edited");
      return;
    }

    if (!imageFile && !isEdit) {
      toast.error("Please upload an image of the room.");
      return;
    }

    setIsLoading(true);

    // Auto-normalize area before submit
    const normalizedRoomData = {
      ...roomData,
      area: roomData.area.trim().toLowerCase(),
    };

    const formData = new FormData();
    Object.keys(normalizedRoomData).forEach((key) => {
      formData.append(key, normalizedRoomData[key as keyof typeof normalizedRoomData]);
    });

    if (imageFile) formData.append("image", imageFile);
    if (qrFile) formData.append("paymentQr", qrFile);
    formData.append("facilities", JSON.stringify(facilities));
    formData.append("rules", JSON.stringify(rules));

    const amenitiesList = Object.keys(facilities)
      .filter((k) => facilities[k as keyof typeof facilities])
      .map((k) => k.toUpperCase());
    formData.append("amenities", JSON.stringify(amenitiesList));

    try {
      const url = isEdit
        ? `${API_BASE_URL}/api/rooms/${id}`
        : `${API_BASE_URL}/api/rooms`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        toast.success(isEdit ? "Property Updated Successfully!" : "Property Listed Successfully!");
        navigate("/my-listings");
      } else {
        const data = await res.json();
        toast.error(data.error || (isEdit ? "Failed to update property" : "Failed to list property"));
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Property" : "List Your Property"}
          </h1>
          {isEdit && lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
          <p className="text-muted-foreground">
            Fill in the details to list your PG on PG Haven.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* IMAGE UPLOAD SECTION - FIXED */}
          <Card className="overflow-hidden border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors rounded-xl bg-muted/5">
            <CardContent className="p-0">
              {previewUrl ? (
                <div className="relative w-full aspect-[21/9] bg-slate-100 group">
                  <img
                    src={previewUrl}
                    alt="Property Preview"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 shadow-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeImage}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center h-[300px] w-full cursor-pointer hover:bg-muted/10 transition-colors"
                >
                  <div className="p-4 rounded-full bg-primary/10 mb-4 text-primary">
                    <ImagePlus className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-xl">
                    Upload Property Photo
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs text-center">
                    Drag & drop or click to choose your main listing image.
                  </p>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: DETAILS */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" /> Basic Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Property Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. The Gulzar PG"
                        value={roomData.name}
                        onChange={(e) =>
                          setRoomData({ ...roomData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area / Locality</Label>
                      <Input
                        id="area"
                        placeholder="e.g. Law Gate, Cheema Chowk"
                        value={roomData.area}
                        onChange={(e) =>
                          setRoomData({ ...roomData, area: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Full Address</Label>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder="e.g. Near Law Gate Auto Stand"
                        value={roomData.location}
                        onChange={(e) =>
                          setRoomData({ ...roomData, location: e.target.value })
                        }
                        required
                        className="pl-9"
                      />
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        placeholder="e.g. 9876543210"
                        value={roomData.ownerPhone}
                        onChange={(e) =>
                          setRoomData({ ...roomData, ownerPhone: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>WhatsApp Number</Label>
                      <Input
                        placeholder="e.g. 9876543210"
                        value={roomData.ownerWhatsapp}
                        onChange={(e) =>
                          setRoomData({ ...roomData, ownerWhatsapp: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe amenities, environment, and nearby landmarks..."
                      value={roomData.description}
                      onChange={(e) =>
                        setRoomData({
                          ...roomData,
                          description: e.target.value,
                        })
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Facilities Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Facilities</CardTitle>
                  <CardDescription>Select all that apply.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(facilities).map((key) => (
                      <div
                        key={key}
                        onClick={() =>
                          handleFacilityChange(key as keyof typeof facilities)
                        }
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                          facilities[key as keyof typeof facilities]
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded border flex items-center justify-center ${
                            facilities[key as keyof typeof facilities]
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-input"
                          }`}
                        >
                          {facilities[key as keyof typeof facilities] && (
                            <Plus className="h-3 w-3" />
                          )}
                        </div>
                        <label className="text-sm font-medium capitalize cursor-pointer pointer-events-none">
                          {key}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* House Rules Card */}
              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a rule (e.g. No Smoking)"
                      value={currentRule}
                      onChange={(e) => setCurrentRule(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddRule();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddRule}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>

                  {rules.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {rules.map((rule, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted border"
                        >
                          {rule}
                          <button
                            type="button"
                            onClick={() => handleRemoveRule(index)}
                            className="ml-2 text-muted-foreground hover:text-destructive focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No specific rules added yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: PRICING & TYPE */}
            <div className="space-y-8">
              <Card className="sticky top-24 shadow-md border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle>Pricing & Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Monthly Rent</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="8000"
                        value={roomData.price}
                        onChange={(e) =>
                          setRoomData({ ...roomData, price: e.target.value })
                        }
                        required
                        className="pl-8 text-lg font-semibold"
                      />
                      <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">
                        ₹
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Security Deposit</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="10000"
                        value={roomData.deposit}
                        onChange={(e) =>
                          setRoomData({ ...roomData, deposit: e.target.value })
                        }
                        required
                        className="pl-9"
                      />
                      <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notice Period (Days)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="30"
                        value={roomData.noticePeriod}
                        onChange={(e) =>
                          setRoomData({
                            ...roomData,
                            noticePeriod: e.target.value,
                          })
                        }
                        required
                        className="pl-9"
                      />
                      <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment QR Code (Optional)</Label>
                    <p className="text-xs text-muted-foreground">
                      Upload your GPay/PhonePe QR for tenants.
                    </p>
                    <div className="border-2 border-dashed border-input rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-muted/50 relative bg-muted/10">
                      <QrCode className="h-6 w-6 text-muted-foreground mr-2" />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleQrChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground font-medium">
                        {qrFile ? qrFile.name : "Upload QR Image"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Occupancy</Label>
                      <Select
                        onValueChange={(val) =>
                          setRoomData({ ...roomData, occupancy: val })
                        }
                        defaultValue="Single"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Occupancy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single Room</SelectItem>
                          <SelectItem value="Double">Double Sharing</SelectItem>
                          <SelectItem value="Triple">Triple Sharing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Gender</Label>
                      <Select
                        onValueChange={(val) =>
                          setRoomData({ ...roomData, gender: val })
                        }
                        defaultValue="Co-ed"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Co-ed">Co-ed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isEdit && initialData && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mb-3"
                      onClick={() => {
                        setRoomData(initialData.roomData);
                        setFacilities(initialData.facilities);
                        setRules(initialData.rules);
                        setPreviewUrl(initialData.previewUrl);
                        setImageFile(null);
                        toast.info("Changes reset");
                      }}
                    >
                      Cancel Changes
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero py-6 text-lg shadow-glow mt-4"
                    disabled={isLoading || (isEdit && roomStatus === "occupied")}
                  >
                    {isLoading
                      ? isEdit ? "Updating..." : "Publishing..."
                      : isEdit ? "Update Listing" : "Publish Listing"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddRoom;