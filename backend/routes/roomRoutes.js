const express = require('express');
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { 
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  bookRoom,
  cancelBooking,
  confirmOccupancy,
  deleteRoom,
  getMyRooms,
  getUserBookings,
  payRent,
  getMyPayments,
  getOwnerPayments,
  verifyPayment
} = require('../controllers/roomController');
const { protect, isOwner } = require('../middleware/authMiddleware');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pg-haven",
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50000000 },
});

// Routes
router.get('/', getRooms);

// User & Owner specific routes MUST come before :id
router.get('/my-stay', protect, getUserBookings);
router.get('/payments', protect, getMyPayments);
router.get('/my-listings', protect, isOwner, getMyRooms);

router.get('/owner/payments', protect, isOwner, getOwnerPayments);
router.patch('/owner/verify-payment/:id', protect, isOwner, verifyPayment);

// ID-based route MUST be LAST
router.get('/:id', getRoomById);

// User Routes
router.post('/pay-rent', protect, upload.single('screenshot'), payRent);
router.post('/book/:id', protect, bookRoom);
router.post('/cancel/:id', protect, cancelBooking);

// Owner Routes
router.post(
  '/',
  protect,
  isOwner,
  upload.fields([
    { name: 'media', maxCount: 20 },
    { name: 'paymentQr', maxCount: 1 }
  ]),
  createRoom
);

router.put(
  '/:id',
  protect,
  isOwner,
  upload.fields([
    { name: 'media', maxCount: 20 },
    { name: 'paymentQr', maxCount: 1 }
  ]),
  updateRoom
);
router.post('/occupy/:id', protect, isOwner, confirmOccupancy);
router.delete('/:id', protect, isOwner, deleteRoom);

module.exports = router;