import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverImage: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const ShippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'Nigeria' },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [OrderItemSchema],
  shippingAddress: ShippingAddressSchema,
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  paymentMethod: { type: String, default: 'card' },
  stripePaymentIntentId: { type: String },
  stripeSessionId: { type: String },
  notes: { type: String },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
