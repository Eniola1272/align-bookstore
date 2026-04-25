import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { countBooks, countOrders, countProfiles, sumOrderRevenue, getOrderStatusCounts, getBooks, getAllOrders } from '@/lib/supabase/queries';

export async function GET() {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;

  const [totalBooks, totalOrders, totalUsers, totalRevenue, statusMap, lowStockBooks, recentOrders] =
    await Promise.all([
      countBooks(),
      countOrders(),
      countProfiles(),
      sumOrderRevenue(),
      getOrderStatusCounts(),
      getBooks({ where: { stock: { lte: 5 } }, orderBy: [{ field: 'stock', direction: 'asc' }], take: 10 }),
      getAllOrders({ take: 5 }),
    ]);

  const lowStock = lowStockBooks.map(b => ({ id: b.id, title: b.title, author: b.author, stock: b.stock, coverImage: b.coverImage }));
  const recentOrdersMapped = recentOrders.map(o => ({
    id: o.id, orderNumber: o.orderNumber, createdAt: o.createdAt, total: o.total,
    status: o.status, paymentStatus: o.paymentStatus, shippingAddress: o.shippingAddress,
  }));

  return NextResponse.json({
    totalBooks,
    totalOrders,
    totalUsers,
    totalRevenue,
    pendingOrders: (statusMap['pending'] ?? 0) + (statusMap['confirmed'] ?? 0),
    ordersByStatus: statusMap,
    lowStock,
    recentOrders: recentOrdersMapped,
  });
}
