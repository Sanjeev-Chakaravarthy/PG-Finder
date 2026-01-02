import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, TrendingUp, Users, Home, 
  AlertCircle, DollarSign, Plus, ArrowRight, 
  CheckCircle2, XCircle, Clock, Eye, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

import API_BASE_URL from "@/config/api";
const getImageUrl = (path: string) => {
  if (!path) return "https://via.placeholder.com/400x300?text=No+Screenshot";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

const OwnerDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupied: 0,
    booked: 0,
    available: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch Listings
      const listingsRes = await fetch(`${API_BASE_URL}/api/rooms/my-listings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (listingsRes.ok) {
        const data = await listingsRes.json();
        // Check if data is an array before filtering
        if (Array.isArray(data)) {
          const total = data.length;
          const occupied = data.filter((r: any) => r.status === "occupied").length;
          const booked = data.filter((r: any) => r.status === "booked").length;
          const available = data.filter((r: any) => r.status === "available").length;

          const revenue = data
            .filter((r: any) => r.status === "occupied")
            .reduce((acc: number, curr: any) => acc + curr.price, 0);

          setStats({ totalRooms: total, occupied, booked, available, revenue });
          setRecentBookings(data.filter((r: any) => r.status === "booked"));
        } else {
          console.error("Dashboard Error: API did not return an array", data);
          setStats({ totalRooms: 0, occupied: 0, booked: 0, available: 0, revenue: 0 });
          setRecentBookings([]);
        }
      }

      // Fetch All Payments for Owner's Properties
      const paymentsRes = await fetch(`${API_BASE_URL}/api/rooms/owner/payments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (paymentsRes.ok) {
        const payments = await paymentsRes.json();
        setAllPayments(Array.isArray(payments) ? payments : []);
        setPendingPayments(
          Array.isArray(payments) 
            ? payments.filter((p: any) => p.status === 'pending')
            : []
        );
      }
    } catch (err) {
      console.error("OwnerDashboard fetch error:", err);
      setStats({ totalRooms: 0, occupied: 0, booked: 0, available: 0, revenue: 0 });
      setRecentBookings([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleVerifyPayment = async (paymentId: string, status: 'verified' | 'rejected') => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/owner/verify-payment/${paymentId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success(status === 'verified' ? "Payment Verified!" : "Payment Rejected");
        setIsDialogOpen(false);
        setSelectedPayment(null);
        fetchData(); // Refresh data
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to update payment status");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openPaymentDialog = (payment: any) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground">Overview of your PG business performance.</p>
          </div>
          <Button asChild className="bg-gradient-hero shadow-glow">
            <Link to="/add-room"><Plus className="mr-2 h-4 w-4" /> Add New PG</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Estimated from occupied rooms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalRooms > 0 ? Math.round((stats.occupied / stats.totalRooms) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">{stats.occupied} out of {stats.totalRooms} rooms occupied</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.booked}</div>
              <p className="text-xs text-muted-foreground">Visits scheduled needing action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRooms}</div>
              <p className="text-xs text-muted-foreground">{stats.available} currently available</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{pendingPayments.length}</div>
              <p className="text-xs text-orange-600">Awaiting verification</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Management Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" /> Payment Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="pending">
                  Pending ({pendingPayments.length})
                </TabsTrigger>
                <TabsTrigger value="history">
                  All Payments ({allPayments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
                {pendingPayments.length === 0 ? (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">No pending payments to review</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingPayments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-all">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{payment.tenant?.name || "Unknown Tenant"}</p>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              <Clock className="w-3 h-3 mr-1" /> Pending
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{payment.room?.name || "Room"}</p>
                          <div className="flex gap-4 mt-2 text-xs">
                            <span className="text-muted-foreground">Month: <strong>{payment.month}</strong></span>
                            <span className="text-muted-foreground">Amount: <strong className="text-green-600">₹{payment.amount}</strong></span>
                            <span className="text-muted-foreground">Ref: <strong>{payment.transactionId}</strong></span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => openPaymentDialog(payment)}>
                          <Eye className="w-4 h-4 mr-2" /> Review
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                {allPayments.length === 0 ? (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">No payment history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allPayments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{payment.tenant?.name || "Unknown Tenant"}</p>
                            {payment.status === 'verified' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                              </Badge>
                            ) : payment.status === 'rejected' ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="w-3 h-3 mr-1" /> Rejected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                <Clock className="w-3 h-3 mr-1" /> Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{payment.room?.name || "Room"}</p>
                          <div className="flex gap-4 mt-2 text-xs">
                            <span className="text-muted-foreground">Month: <strong>{payment.month}</strong></span>
                            <span className="text-muted-foreground">Amount: <strong className="text-green-600">₹{payment.amount}</strong></span>
                            <span className="text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => openPaymentDialog(payment)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Requests */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Booking Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                  <p>No pending requests right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((room) => (
                    <div key={room._id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-semibold text-foreground">{room.name}</p>
                        <p className="text-sm text-muted-foreground">Visitor: {room.bookedBy?.name}</p>
                        <p className="text-xs text-orange-600 font-medium flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" /> Visit Date: {room.visitDate}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/room/${room._id}`}>Manage</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          <Card className="h-full bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle>Manage Your Listings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                View all your properties, edit details, update pricing, or remove listings completely.
              </p>
              <Button asChild className="w-full h-12" variant="outline">
                <Link to="/my-listings">
                  Go to My Listings <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <div className="text-xs text-muted-foreground mt-4 p-4 bg-background/50 rounded-lg border">
                <strong>Tip:</strong> Keep your listings updated. Marking a room as "Occupied" removes it from public search results but keeps it in your revenue calculations.
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Payment Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Verification</DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tenant</p>
                    <p className="font-semibold">{selectedPayment.tenant?.name || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-semibold">{selectedPayment.room?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Month</p>
                    <p className="font-semibold">{selectedPayment.month}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold text-green-600">₹{selectedPayment.amount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Transaction ID</p>
                    <p className="font-semibold text-xs">{selectedPayment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant="outline" className={
                      selectedPayment.status === 'verified' 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : selectedPayment.status === 'rejected'
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }>
                      {selectedPayment.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot */}
              <div className="space-y-3">
                <p className="font-semibold">Payment Screenshot</p>
                {selectedPayment.screenshot ? (
                  <div className="border-2 rounded-lg overflow-hidden bg-slate-50">
                    <img 
                      src={getImageUrl(selectedPayment.screenshot)} 
                      alt="Payment Screenshot" 
                      className="w-full h-auto object-contain max-h-96"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p>No screenshot uploaded</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedPayment.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleVerifyPayment(selectedPayment._id, 'verified')}
                    className="flex-1 bg-green-600 hover:bg-green-700 h-12"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                    )}
                    Approve Payment
                  </Button>
                  <Button
                    onClick={() => handleVerifyPayment(selectedPayment._id, 'rejected')}
                    variant="destructive"
                    className="flex-1 h-12"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    Reject Payment
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;