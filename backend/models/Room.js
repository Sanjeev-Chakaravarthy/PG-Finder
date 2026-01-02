const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  ownerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  ownerWhatsapp: {
    type: String,
    required: true,
    trim: true,
  },
  price: { type: Number, required: true },
  deposit: { type: Number, default: 0 },
  noticePeriod: { type: Number, default: 30 },
  occupancy: { type: String, required: true },
  gender: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  
  // NEW: Payment QR Code Path
  paymentQr: { type: String, default: "" }, 
  
  amenities: [String],
  rules: [String], 
  facilities: {
    wifi: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    food: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    cleaning: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
  },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['available', 'booked', 'occupied'], 
    default: 'available' 
  },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  visitDate: { type: String, default: null },

  // 🔒 Edit history (audit trail)
  editHistory: [
    {
      editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      editedAt: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

roomSchema.index({ ownerId: 1 });
roomSchema.index({ area: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ "editHistory.editedAt": -1 });
roomSchema.index({ ownerPhone: 1 });

module.exports = mongoose.model('Room', roomSchema);