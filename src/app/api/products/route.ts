import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { getBooks, countBooks, createBook } from '@/lib/supabase/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre') ?? undefined;
    const search = searchParams.get('search') ?? undefined;
    const sortParam = searchParams.get('sort') || 'createdAt';
    const direction = (searchParams.get('order') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const bestseller = searchParams.get('bestseller');
    const condition = searchParams.get('condition') ?? undefined;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where = {
      ...(genre && genre !== 'all' ? { genre } : {}),
      ...(bestseller === 'true' ? { bestseller: true } : {}),
      ...(condition ? { condition } : {}),
      ...(minPrice || maxPrice ? { price: { gte: minPrice ? parseFloat(minPrice) : undefined, lte: maxPrice ? parseFloat(maxPrice) : undefined } } : {}),
      ...(search ? { search } : {}),
    };

    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      getBooks({ where, orderBy: [{ field: sortParam, direction }], skip, take: limit }),
      countBooks(where),
    ]);

    return NextResponse.json({ books, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;

  try {
    const body = await req.json();
    const book = await createBook(body);
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
