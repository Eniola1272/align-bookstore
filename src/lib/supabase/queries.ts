import { supabaseAdmin } from './admin';

// ── Types (matching Prisma camelCase shapes) ──────────────────────────────────

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice: number | null;
  isbn: string | null;
  genre: string;
  subGenre: string | null;
  publisher: string | null;
  publishedYear: number | null;
  pages: number | null;
  language: string;
  condition: string;
  coverImage: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: unknown;
  shippingAddress: unknown;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentReference: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBook(r: any): Book {
  return {
    id: r.id, title: r.title, author: r.author, description: r.description,
    price: r.price, originalPrice: r.original_price ?? null,
    isbn: r.isbn ?? null, genre: r.genre, subGenre: r.sub_genre ?? null,
    publisher: r.publisher ?? null, publishedYear: r.published_year ?? null,
    pages: r.pages ?? null, language: r.language, condition: r.condition,
    coverImage: r.cover_image, stock: r.stock, rating: r.rating,
    reviewCount: r.review_count, featured: r.featured, bestseller: r.bestseller,
    tags: r.tags ?? [],
    createdAt: new Date(r.created_at), updatedAt: new Date(r.updated_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfile(r: any): Profile {
  return {
    id: r.id, name: r.name, username: r.username, avatar: r.avatar ?? null,
    role: r.role, createdAt: new Date(r.created_at), updatedAt: new Date(r.updated_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrder(r: any): Order {
  return {
    id: r.id, userId: r.user_id, orderNumber: r.order_number,
    items: r.items, shippingAddress: r.shipping_address,
    subtotal: r.subtotal, shippingCost: r.shipping_cost, total: r.total,
    status: r.status, paymentStatus: r.payment_status,
    paymentMethod: r.payment_method ?? 'paystack',
    paymentReference: r.payment_reference ?? null, notes: r.notes ?? null,
    createdAt: new Date(r.created_at), updatedAt: new Date(r.updated_at),
  };
}

// ── Book helpers ──────────────────────────────────────────────────────────────

interface BookFilter {
  genre?: string;
  bestseller?: boolean;
  condition?: string;
  stock?: { gt?: number; lte?: number };
  search?: string;
  price?: { gte?: number; lte?: number };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBookFilters(query: any, where: BookFilter): any {
  if (where.genre && where.genre !== 'all') query = query.eq('genre', where.genre);
  if (where.bestseller !== undefined) query = query.eq('bestseller', where.bestseller);
  if (where.condition) query = query.eq('condition', where.condition);
  if (where.stock?.gt !== undefined) query = query.gt('stock', where.stock.gt);
  if (where.stock?.lte !== undefined) query = query.lte('stock', where.stock.lte);
  if (where.price?.gte !== undefined) query = query.gte('price', where.price.gte);
  if (where.price?.lte !== undefined) query = query.lte('price', where.price.lte);
  if (where.search) query = query.or(`title.ilike.%${where.search}%,author.ilike.%${where.search}%`);
  return query;
}

export async function getBooks(opts: {
  where?: BookFilter;
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  skip?: number;
  take?: number;
  select?: string;
} = {}): Promise<Book[]> {
  let q = supabaseAdmin.from('books').select(opts.select ?? '*');
  if (opts.where) q = applyBookFilters(q, opts.where);
  for (const s of opts.orderBy ?? [{ field: 'created_at', direction: 'desc' as const }]) {
    const col = s.field === 'createdAt' ? 'created_at' : s.field === 'reviewCount' ? 'review_count' : s.field;
    q = q.order(col, { ascending: s.direction === 'asc' });
  }
  if (opts.skip !== undefined && opts.take !== undefined) {
    q = q.range(opts.skip, opts.skip + opts.take - 1);
  } else if (opts.take !== undefined) {
    q = q.limit(opts.take);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapBook);
}

export async function countBooks(where: BookFilter = {}): Promise<number> {
  let q = supabaseAdmin.from('books').select('*', { count: 'exact', head: true });
  q = applyBookFilters(q, where);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabaseAdmin.from('books').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return mapBook(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createBook(data: Record<string, any>): Promise<Book> {
  const row = {
    title: data.title, author: data.author, description: data.description,
    price: data.price, original_price: data.originalPrice ?? null,
    isbn: data.isbn ?? null, genre: data.genre, sub_genre: data.subGenre ?? null,
    publisher: data.publisher ?? null, published_year: data.publishedYear ?? null,
    pages: data.pages ?? null, language: data.language ?? 'English',
    condition: data.condition ?? 'new', cover_image: data.coverImage ?? '/book-placeholder.png',
    stock: data.stock ?? 0, rating: data.rating ?? 0, review_count: data.reviewCount ?? 0,
    featured: data.featured ?? false, bestseller: data.bestseller ?? false,
    tags: data.tags ?? [],
  };
  const { data: created, error } = await supabaseAdmin.from('books').insert(row).select().single();
  if (error) throw error;
  return mapBook(created);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateBook(id: string, data: Record<string, any>): Promise<Book> {
  const fieldMap: Record<string, string> = {
    originalPrice: 'original_price', subGenre: 'sub_genre', publishedYear: 'published_year',
    coverImage: 'cover_image', reviewCount: 'review_count',
  };
  const row: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    row[fieldMap[k] ?? k] = v;
  }
  const { data: updated, error } = await supabaseAdmin.from('books').update(row).eq('id', id).select().single();
  if (error) throw error;
  return mapBook(updated);
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('books').delete().eq('id', id);
  if (error) throw error;
}

export async function decrementBookStock(id: string, qty: number): Promise<void> {
  const { data, error: fetchErr } = await supabaseAdmin.from('books').select('stock').eq('id', id).single();
  if (fetchErr) throw fetchErr;
  const { error } = await supabaseAdmin.from('books').update({ stock: Math.max(0, (data.stock as number) - qty) }).eq('id', id);
  if (error) throw error;
}

// ── Profile helpers ───────────────────────────────────────────────────────────

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return mapProfile(data);
}

export async function getProfileByUsername(username: string, excludeId?: string): Promise<Profile | null> {
  let q = supabaseAdmin.from('profiles').select('*').eq('username', username);
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q.maybeSingle();
  if (error || !data) return null;
  return mapProfile(data);
}

export async function createProfile(data: { id: string; name: string; username: string; avatar?: string | null; role?: string }): Promise<Profile> {
  const { data: created, error } = await supabaseAdmin.from('profiles').insert({
    id: data.id, name: data.name, username: data.username,
    avatar: data.avatar ?? null, role: data.role ?? 'user',
  }).select().single();
  if (error) throw error;
  return mapProfile(created);
}

export async function updateProfile(id: string, data: { name?: string; username?: string; avatar?: string | null }): Promise<Profile> {
  const { data: updated, error } = await supabaseAdmin.from('profiles').update(data).eq('id', id).select().single();
  if (error) throw error;
  return mapProfile(updated);
}

export async function countProfiles(): Promise<number> {
  const { count, error } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

// ── Order helpers ─────────────────────────────────────────────────────────────

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabaseAdmin.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapOrder);
}

export async function getOrderById(id: string, userId?: string): Promise<Order | null> {
  let q = supabaseAdmin.from('orders').select('*').eq('id', id);
  if (userId) q = q.eq('user_id', userId);
  const { data, error } = await q.maybeSingle();
  if (error || !data) return null;
  return mapOrder(data);
}

export async function getOrderByPaymentRef(ref: string): Promise<Order | null> {
  const { data, error } = await supabaseAdmin.from('orders').select('*').eq('payment_reference', ref).maybeSingle();
  if (error || !data) return null;
  return mapOrder(data);
}

export async function createOrder(data: {
  userId: string; orderNumber: string; items: unknown; shippingAddress: unknown;
  subtotal: number; shippingCost: number; total: number;
  status?: string; paymentStatus?: string; paymentMethod?: string; paymentReference?: string;
}): Promise<Order> {
  const { data: created, error } = await supabaseAdmin.from('orders').insert({
    user_id: data.userId, order_number: data.orderNumber, items: data.items,
    shipping_address: data.shippingAddress, subtotal: data.subtotal,
    shipping_cost: data.shippingCost, total: data.total,
    status: data.status ?? 'pending', payment_status: data.paymentStatus ?? 'unpaid',
    payment_method: data.paymentMethod ?? 'paystack', payment_reference: data.paymentReference ?? null,
  }).select().single();
  if (error) throw error;
  return mapOrder(created);
}

export async function updateOrder(id: string, data: { status?: string; paymentStatus?: string; notes?: string }): Promise<Order> {
  const row: Record<string, unknown> = {};
  if (data.status !== undefined) row.status = data.status;
  if (data.paymentStatus !== undefined) row.payment_status = data.paymentStatus;
  if (data.notes !== undefined) row.notes = data.notes;
  const { data: updated, error } = await supabaseAdmin.from('orders').update(row).eq('id', id).select().single();
  if (error) throw error;
  return mapOrder(updated);
}

export async function getAllOrders(opts: { status?: string; skip?: number; take?: number } = {}): Promise<Order[]> {
  let q = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
  if (opts.status && opts.status !== 'all') q = q.eq('status', opts.status);
  if (opts.skip !== undefined && opts.take !== undefined) q = q.range(opts.skip, opts.skip + opts.take - 1);
  else if (opts.take !== undefined) q = q.limit(opts.take);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapOrder);
}

export async function countOrders(where: { status?: string; paymentStatus?: string } = {}): Promise<number> {
  let q = supabaseAdmin.from('orders').select('*', { count: 'exact', head: true });
  if (where.status && where.status !== 'all') q = q.eq('status', where.status);
  if (where.paymentStatus) q = q.eq('payment_status', where.paymentStatus);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

export async function getOrderStatusCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin.from('orders').select('status');
  if (error) throw error;
  const map: Record<string, number> = {};
  for (const row of data ?? []) map[row.status] = (map[row.status] ?? 0) + 1;
  return map;
}

export async function sumOrderRevenue(): Promise<number> {
  const { data, error } = await supabaseAdmin.from('orders').select('total').eq('payment_status', 'paid');
  if (error) throw error;
  return (data ?? []).reduce((s, r) => s + (r.total as number), 0);
}
