const Room = require('../models/Room');
const Payment = require('../models/Payment');
const fs = require('fs');
const path = require('path');

// @desc    Get rooms (Hides Occupied rooms from public)
// @route   GET /api/rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: { $ne: 'occupied' } }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    console.error("getRooms Error:", error);
    res.status(500).json([]);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('ownerId', 'name email phone')
      .populate('bookedBy', 'name email phone');
    
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get Owner's Listings (FIXED 500 CRASH)
// @route   GET /api/rooms/my-listings
exports.getMyRooms = async (req, res) => {
  try {
    // FIX: Explicitly check if user is authenticated
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const rooms = await Room.find({ ownerId: req.user.id })
      .populate('bookedBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(rooms || []); // Always return array
  } catch (error) {
    console.error("Error in getMyRooms:", error);
    res.status(500).json({ error: 'Server Error fetching listings' });
  }
};

// @desc    Create room
// @route   POST /api/rooms
exports.createRoom = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const {
      name,
      location,
      area,
      price,
      deposit,
      noticePeriod,
      occupancy,
      gender,
      description,
      amenities,
      facilities,
      rules,
      ownerPhone,
      ownerWhatsapp,
    } = req.body;

    const imagePath = req.files && req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '';
    const qrPath = req.files && req.files['paymentQr'] ? `/uploads/${req.files['paymentQr'][0].filename}` : '';

    let parsedFacilities = facilities ? JSON.parse(facilities) : {};
    let parsedAmenities = amenities ? JSON.parse(amenities) : [];
    let parsedRules = rules ? JSON.parse(rules) : [];

    const newRoom = await Room.create({
      ownerId: req.user.id,
      name,
      location,
      area: area.trim().toLowerCase(),
      ownerPhone,
      ownerWhatsapp,
      price: Number(price), 
      deposit: Number(deposit),
      noticePeriod: Number(noticePeriod) || 30,
      occupancy, gender, description,
      image: imagePath,
      paymentQr: qrPath, // Save QR Path
      facilities: parsedFacilities,
      amenities: parsedAmenities,
      rules: parsedRules,
      status: 'available'
    });

    res.status(201).json(newRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// @desc    Delete Room
// @route   DELETE /api/rooms/:id
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (room.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    if (room.image) {
       try {
         const filePath = path.join(__dirname, '..', room.image);
         if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
       } catch(e) { console.error("Image delete error", e); }
    }

    await room.deleteOne();
    res.json({ message: 'PG Removed Successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

// @desc    Book room
exports.bookRoom = async (req, res) => {
  const { visitDate } = req.body;
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    if (room.ownerId.toString() === req.user.id) {
      return res.status(400).json({ error: "You cannot book your own room!" });
    }
    if (room.status !== 'available') {
      return res.status(400).json({ error: 'Room is not available' });
    }

    room.status = 'booked';
    room.bookedBy = req.user.id;
    room.visitDate = visitDate;
    await room.save();

    res.json({ message: 'Visit scheduled! Room is marked as booked.' });
  } catch (error) {
    res.status(500).json({ error: 'Booking failed' });
  }
};

// @desc    Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (room.bookedBy?.toString() !== req.user.id && room.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
    }

    room.status = 'available';
    room.bookedBy = null;
    room.visitDate = null;
    await room.save();

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Cancellation failed' });
  }
};

// @desc    Confirm Occupancy
exports.confirmOccupancy = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (room.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
    }

    room.status = 'occupied';
    await room.save();
    res.json({ message: 'Room occupied' });
  } catch (error) {
    res.status(500).json({ error: 'Action failed' });
  }
};

// --- NEW USER DASHBOARD FUNCTIONS ---

// @desc    Get rooms booked by the user
exports.getUserBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Auth failed" });
    const rooms = await Room.find({ bookedBy: req.user.id }).populate('ownerId', 'name email phone');
    res.json(rooms || []);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Pay Rent
exports.payRent = async (req, res) => {
  try {
    const { roomId, amount, transactionId, month } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Payment screenshot required" });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const payment = await Payment.create({
      userId: req.user.id,
      roomId,
      ownerId: room.ownerId,
      amount,
      transactionId,
      month,
      screenshot: `/uploads/${req.file.filename}`,
      status: "pending",
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error("payRent error:", error);
    res.status(500).json({ error: "Payment failed" });
  }
};

// @desc    Get Payment History
exports.getMyPayments = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments || []);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

exports.getOwnerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ ownerId: req.user.id })
      .populate("userId", "name email")
      .populate("roomId", "name")
      .sort({ createdAt: -1 });

    const formatted = payments.map(p => ({
      ...p.toObject(),
      tenant: p.userId,
      room: p.roomId,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("getOwnerPayments error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    if (payment.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    payment.status = status;
    await payment.save();

    res.json({ message: "Payment status updated" });
  } catch (error) {
    console.error("verifyPayment error:", error);
    res.status(500).json({ error: "Update failed" });
  }
};

/**
 * @desc    Update room (Edit PG)
 * @route   PUT /api/rooms/:id
 * @access  Owner only
 */
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (room.status === "occupied") {
      return res.status(400).json({ error: "Occupied rooms cannot be edited" });
    }

    // Owner check
    if (room.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to edit this room" });
    }

    const {
      name,
      location,
      area,
      price,
      deposit,
      noticePeriod,
      occupancy,
      gender,
      description,
      amenities,
      facilities,
      rules,
      ownerPhone,
      ownerWhatsapp,
    } = req.body;

    if (name !== undefined) room.name = name;
    if (location !== undefined) room.location = location;
    if (area !== undefined) room.area = area.trim().toLowerCase();
    if (price !== undefined) room.price = Number(price);
    if (deposit !== undefined) room.deposit = Number(deposit);
    if (noticePeriod !== undefined) room.noticePeriod = Number(noticePeriod);
    if (occupancy !== undefined) room.occupancy = occupancy;
    if (gender !== undefined) room.gender = gender;
    if (description !== undefined) room.description = description;
    if (ownerPhone !== undefined) room.ownerPhone = ownerPhone;
    if (ownerWhatsapp !== undefined) room.ownerWhatsapp = ownerWhatsapp;

    if (amenities) room.amenities = JSON.parse(amenities);
    if (facilities) room.facilities = JSON.parse(facilities);
    if (rules) room.rules = JSON.parse(rules);

    // Replace main image if uploaded
    if (req.files?.image?.[0]) {
      if (room.image) {
        const oldImagePath = path.join(__dirname, "..", room.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      room.image = `/uploads/${req.files.image[0].filename}`;
    }

    // Replace payment QR if uploaded
    if (req.files?.paymentQr?.[0]) {
      if (room.paymentQr) {
        const oldQrPath = path.join(__dirname, "..", room.paymentQr);
        if (fs.existsSync(oldQrPath)) fs.unlinkSync(oldQrPath);
      }
      room.paymentQr = `/uploads/${req.files.paymentQr[0].filename}`;
    }

    // Change history (simple audit log)
    room.editHistory = room.editHistory || [];
    room.editHistory.push({
      editedBy: req.user.id,
      editedAt: new Date(),
    });

    await room.save();
    res.json(room);
  } catch (error) {
    console.error("updateRoom error:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
};