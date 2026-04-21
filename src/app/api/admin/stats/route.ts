import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminCheck';
import connectDB from '@/lib/db/mongodb';
import { Book } from '@/lib/db/models/Book';
import { Order } from '@/lib/db/models/Order';
import User from '@/lib/db/models/User';

export async function GET() {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;

  await connectDB();

  const [totalBooks, totalOrders, totalUsers, revenueAgg, ordersByStatus, lowStock, recentOrders] =
    await Promise.all([
      Book.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Book.find({ stock: { $lte: 5 } })
        .select('title author stock coverImage')
        .sort({ stock: 1 })
        .limit(10)
        .lean(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber createdAt total status paymentStatus shippingAddress')
        .lean(),
    ]);

  const statusMap: Record<string, number> = {};
  for (const s of ordersByStatus) statusMap[s._id] = s.count;

  return NextResponse.json({
    totalBooks,
    totalOrders,
    totalUsers,
    totalRevenue: revenueAgg[0]?.total || 0,
    pendingOrders: (statusMap['pending'] || 0) + (statusMap['confirmed'] || 0),
    ordersByStatus: statusMap,
    lowStock,
    recentOrders,
  });
}
