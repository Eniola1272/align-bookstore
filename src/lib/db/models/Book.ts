import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  isbn: { type: String },
  genre: { type: String, required: true },
  subGenre: { type: String },
  publisher: { type: String },
  publishedYear: { type: Number },
  pages: { type: Number },
  language: { type: String, default: 'English' },
  condition: { type: String, enum: ['new', 'like-new', 'good', 'fair'], default: 'new' },
  coverImage: { type: String, default: '/book-placeholder.png' },
  stock: { type: Number, default: 10, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true });

BookSchema.index({ title: 'text', author: 'text', description: 'text' });

export const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);
