const Room = require('../models/Room');
const Payment = require('../models/Payment');

// @desc    Get rooms (Hides Occupied rooms from public)
// @route   GET /api/rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: { $ne: 'occupied' } }).sort({ createdAt: -1 });
    
    // FIXED: Ensure media array exists and has proper URLs
    const roomsWithMedia = rooms.map(room => {
      const roomObj = room.toObject();
      
      // Ensure media array exists
      if (!roomObj.media || !Array.isArray(roomObj.media) || roomObj.media.length === 0) {
        // Fallback to old 'image' field if exists
        roomObj.media = roomObj.image ? [roomObj.image] : [];
      }
      
      // Clean up media paths (ensure they start with /)
      roomObj.media = roomObj.media.map(mediaPath => {
        if (!mediaPath) return '';
        if (mediaPath.startsWith('http')) return mediaPath;
        return mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
      }).filter(Boolean); // Remove empty strings
      
      // Set image to first media item for backward compatibility
      roomObj.image = roomObj.media[0] || '';
      
      return roomObj;
    });
    
    res.json(roomsWithMedia);
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
    
    const roomObj = room.toObject();
    
    // FIXED: Ensure media array exists
    if (!roomObj.media || !Array.isArray(roomObj.media) || roomObj.media.length === 0) {
      roomObj.media = roomObj.image ? [roomObj.image] : [];
    }
    
    // Clean up media paths
    roomObj.media = roomObj.media.map(mediaPath => {
      if (!mediaPath) return '';
      if (mediaPath.startsWith('http')) return mediaPath;
      return mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
    }).filter(Boolean);
    
    roomObj.image = roomObj.media[0] || '';
    
    res.json(roomObj);
  } catch (error) {
    console.error("getRoomById Error:", error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get Owner's Listings (FIXED 500 CRASH + MEDIA)
// @route   GET /api/rooms/my-listings
exports.getMyRooms = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const rooms = await Room.find({ ownerId: req.user.id })
      .populate('bookedBy', 'name email')
      .sort({ createdAt: -1 });
    
    // FIXED: Ensure media array exists for each room
    const roomsWithMedia = rooms.map(room => {
      const roomObj = room.toObject();
      
      if (!roomObj.media || !Array.isArray(roomObj.media) || roomObj.media.length === 0) {
        roomObj.media = roomObj.image ? [roomObj.image] : [];
      }
      
      roomObj.media = roomObj.media.map(mediaPath => {
        if (!mediaPath) return '';
        if (mediaPath.startsWith('http')) return mediaPath;
        return mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
      }).filter(Boolean);
      
      roomObj.image = roomObj.media[0] || '';
      
      return roomObj;
    });
    
    res.json(roomsWithMedia || []);
  } catch (error) {
    console.error("Error in getMyRooms:", error);
    res.status(500).json({ error: 'Server Error fetching listings' });
  }
};

// @desc    Create room (UPDATED for multi-media)
// @route   POST /api/rooms
exports.createRoom = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      name, location, area, price, deposit, noticePeriod,
      occupancy, gender, description, amenities, facilities,
      rules, ownerPhone, ownerWhatsapp,
    } = req.body;

    // FIXED: Handle multiple media files with proper path formatting
    const mediaPaths = req.files?.media
      ? req.files.media.map(file => file.path)
      : [];

    const qrPath = req.files?.paymentQr
      ? req.files.paymentQr[0].path
      : '';

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
      occupancy,
      gender,
      description,
      media: mediaPaths,
      image: mediaPaths[0] || '',
      paymentQr: qrPath,
      facilities: parsedFacilities,
      amenities: parsedAmenities,
      rules: parsedRules,
      status: 'available',
    });

    console.log('✅ Room created with media:', mediaPaths);
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('❌ Create room error:', error);
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


    await room.deleteOne();
    res.json({ message: 'PG Removed Successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
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
      screenshot: req.file.path,
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

// @desc    Update room (UPDATED for multi-media)
// @route   PUT /api/rooms/:id
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.status === "occupied") {
      return res.status(400).json({ error: "Occupied rooms cannot be edited" });
    }

    if (room.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to edit this room" });
    }

    const {
      name, location, area, price, deposit, noticePeriod,
      occupancy, gender, description, amenities, facilities,
      rules, ownerPhone, ownerWhatsapp, existingMedia
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

    // Parse existing media
    let existingMediaArray = [];
    if (existingMedia) {
      try {
        existingMediaArray = JSON.parse(existingMedia);
      } catch (e) {
        console.error("Failed to parse existingMedia:", e);
      }
    }

    // Add newly uploaded media
    const newMediaPaths = req.files?.media
      ? req.files.media.map(file => file.path)
      : [];

    room.media = [...existingMediaArray, ...newMediaPaths];
    room.image = room.media[0] || '';

    console.log('✅ Updated room media:', room.media);

    // Update payment QR
    if (req.files?.paymentQr) {
      room.paymentQr = req.files.paymentQr[0].path;
    }

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