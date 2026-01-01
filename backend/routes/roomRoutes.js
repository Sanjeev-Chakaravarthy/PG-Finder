const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) { cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 }
});

const paymentUpload = multer({
  storage,
  limits: { fileSize: 5000000 }
});

// Allow multiple files
const cpUpload = upload.fields([
  { name: 'image', maxCount: 1 }, 
  { name: 'paymentQr', maxCount: 1 }
]);

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
router.post('/pay-rent', protect, paymentUpload.single('screenshot'), payRent);
router.post('/book/:id', protect, bookRoom);
router.post('/cancel/:id', protect, cancelBooking);

// Owner Routes
router.post('/', protect, isOwner, cpUpload, createRoom);
router.put('/:id', protect, isOwner, cpUpload, updateRoom);
router.post('/occupy/:id', protect, isOwner, confirmOccupancy);
router.delete('/:id', protect, isOwner, deleteRoom);

module.exports = router;