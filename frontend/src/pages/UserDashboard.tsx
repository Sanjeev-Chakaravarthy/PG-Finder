import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, CreditCard, History, QrCode, CheckCircle2, AlertCircle, Loader2, LogOut, Upload, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    if (path.startsWith("http")) return path;
    return `http://localhost:5001${path}`;
};

const UserDashboard = () => {
  const { token, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [myRoom, setMyRoom] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Payment Form State
  const [txnId, setTxnId] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!token) {
        navigate("/login");
        return;
    }

    const fetchData = async () => {
      try {
        // Fetch My Room
        const roomRes = await fetch("http://localhost:5001/api/rooms/my-stay", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (roomRes.ok) {
            const roomData = await roomRes.json();
            if (Array.isArray(roomData) && roomData.length > 0) {
                setMyRoom(roomData[0]); 
            } else {
                setMyRoom(null);
            }
        }

        // Fetch Payments
        const payRes = await fetch("http://localhost:5001/api/rooms/payments", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (payRes.ok) {
            const payData = await payRes.json();
            setPayments(Array.isArray(payData) ? payData : []);
        }
        
      } catch (e) {
        console.error(e);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, [token, navigate, loading]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);
      const objectUrl = URL.createObjectURL(file);
      setScreenshotPreview(objectUrl);
    }
  };

  const handlePayment = async () => {
    if (!txnId || !paymentMonth) {
      toast.error("Please enter Transaction ID and Month");
      return;
    }

    if (!screenshotFile) {
      toast.error("Please upload payment screenshot");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("roomId", myRoom._id);
      formData.append("amount", myRoom.price.toString());
      formData.append("transactionId", txnId);
      formData.append("month", paymentMonth);
      formData.append("screenshot", screenshotFile);

      const res = await fetch("http://localhost:5001/api/rooms/pay-rent", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
        body: formData
      });

      if (res.ok) {
        toast.success("Payment Submitted! Waiting for owner verification.");
        setIsPayOpen(false);
        setTxnId("");
        setPaymentMonth("");
        setScreenshotFile(null);
        setScreenshotPreview(null);
        
        // Refresh payments history
        const payRes = await fetch("http://localhost:5001/api/rooms/payments", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (payRes.ok) {
            setPayments(await payRes.json());
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to record payment");
      }
    } catch (e) {
      toast.error("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading screen while Auth is initializing or data is loading
  if (loading || dataLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}</h1>
                <p className="text-muted-foreground">Manage your current stay and rent payments.</p>
            </div>
            <Button variant="outline" onClick={() => { logout(); navigate("/"); }}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: CURRENT STAY --- */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
              <Home className="h-5 w-5 text-primary" /> Your Room
            </h2>

            {myRoom ? (
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full aspect-[16/9] bg-gray-200">
                  <img 
                    src={getImageUrl(myRoom.image)} 
                    className="w-full h-full object-contain" 
                    alt="Room" 
                  />
                  <div className="absolute top-4 right-4">
                    {myRoom.status === 'occupied' ? (
                        <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1 text-sm shadow-md">Active Resident</Badge>
                    ) : (
                        <Badge className="bg-orange-500 hover:bg-orange-600 px-3 py-1 text-sm shadow-md animate-pulse">Booking Pending</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{myRoom.name}</h3>
                      <p className="text-slate-500 flex items-center gap-1 mt-1"><Home className="w-4 h-4" /> {myRoom.location}</p>
                    </div>
                    <div className="text-right bg-slate-100 p-3 rounded-lg min-w-[120px]">
                      <div className="text-xl font-bold text-primary">₹{myRoom.price.toLocaleString()}</div>
                      <span className="text-xs text-slate-500">per month</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {myRoom.status === 'occupied' ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-semibold text-green-800">You are an active resident</p>
                            <p className="text-sm text-green-600 mt-1">Please ensure your rent is paid by the 5th of every month.</p>
                        </div>
                        </div>
                    ) : (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <p className="font-semibold text-orange-800">Booking Confirmed - Visit Pending</p>
                            <p className="text-sm text-orange-600 mt-1">Visit Date: {myRoom.visitDate || "Not Scheduled"}</p>
                            <p className="text-xs text-orange-600 mt-2">Visit the property to finalize paperwork and move in.</p>
                        </div>
                        </div>
                    )}

                    {/* PAY RENT BUTTON */}
                    {myRoom.status === 'occupied' && (
                        <div className="pt-2">
                        <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                            <DialogTrigger asChild>
                            <Button className="w-full bg-gradient-hero shadow-lg h-14 text-lg font-semibold rounded-xl">
                                <CreditCard className="mr-2 h-5 w-5" /> Pay Monthly Rent
                            </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-center text-xl">Pay Rent</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-2">
                                {/* QR Display */}
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-slate-50">
                                {myRoom.paymentQr ? (
                                    <img src={getImageUrl(myRoom.paymentQr)} alt="Owner QR" className="w-48 h-48 object-contain rounded-lg shadow-sm" />
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                    <QrCode className="h-16 w-16 mx-auto mb-2 opacity-20" />
                                    <p>Owner hasn't uploaded a QR Code.</p>
                                    </div>
                                )}
                                <p className="text-xs text-center text-muted-foreground mt-3 font-medium">Scan with GPay / PhonePe / Paytm</p>
                                </div>

                                <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Payment For (Date)</Label>
                                    <Input 
                                      type="date" 
                                      value={paymentMonth} 
                                      onChange={e => setPaymentMonth(e.target.value)}
                                      className="w-full"
                                    />
                                    <p className="text-xs text-muted-foreground">Select the payment date</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Transaction / Reference ID</Label>
                                    <Input placeholder="Enter UPI Ref ID (e.g. 3242xxxx)" value={txnId} onChange={e => setTxnId(e.target.value)} />
                                </div>

                                {/* Screenshot Upload */}
                                <div className="space-y-2">
                                    <Label>Payment Screenshot *</Label>
                                    <p className="text-xs text-muted-foreground">Upload screenshot of your payment confirmation</p>
                                    <div className="relative">
                                      {screenshotPreview ? (
                                        <div className="border-2 border-green-500 rounded-lg p-2 bg-green-50">
                                          <img src={screenshotPreview} alt="Screenshot Preview" className="w-full h-40 object-contain rounded" />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2"
                                            onClick={() => {
                                              setScreenshotFile(null);
                                              setScreenshotPreview(null);
                                            }}
                                          >
                                            Change Screenshot
                                          </Button>
                                        </div>
                                      ) : (
                                        <label className="border-2 border-dashed border-input rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                          <span className="text-sm text-muted-foreground font-medium">Click to upload screenshot</span>
                                          <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleScreenshotChange}
                                            className="hidden"
                                          />
                                        </label>
                                      )}
                                    </div>
                                </div>

                                <Button 
                                  onClick={handlePayment} 
                                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                                  disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                      <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Confirm Payment
                                      </>
                                    )}
                                </Button>
                                </div>
                            </div>
                            </DialogContent>
                        </Dialog>
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-12 text-center border-2 border-dashed bg-slate-50">
                <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Active Room</h3>
                <p className="text-muted-foreground mb-6">You haven't booked or moved into any room yet.</p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link to="/listings">Find a PG Now</Link>
                </Button>
              </Card>
            )}
          </div>

          {/* --- RIGHT COLUMN: HISTORY --- */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
              <History className="h-5 w-5 text-primary" /> Payment History
            </h2>
            <Card className="h-fit min-h-[400px] shadow-md border-0">
              <CardContent className="p-0">
                {payments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <History className="w-10 h-10 mb-2 opacity-20" />
                    <p>No payment records found.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {payments.map((pay) => (
                        <div key={pay._id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-900">{pay.month}</span>
                                <span className="text-green-600 font-bold">₹{pay.amount}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                                <span>Ref: {pay.transactionId}</span>
                                {pay.status === 'verified' ? (
                                  <Badge variant="outline" className="text-[10px] h-5 bg-green-50 text-green-700 border-green-200 uppercase">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                  </Badge>
                                ) : pay.status === 'rejected' ? (
                                  <Badge variant="outline" className="text-[10px] h-5 bg-red-50 text-red-700 border-red-200 uppercase">
                                    <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-700 border-orange-200 uppercase">
                                    <Clock className="w-3 h-3 mr-1" /> Pending
                                  </Badge>
                                )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                                {new Date(pay.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                  </div>
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

export default UserDashboard;