import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { Book } from '@/lib/db/models/Book';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const featured = searchParams.get('featured');
    const bestseller = searchParams.get('bestseller');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const query: Record<string, unknown> = {};

    if (genre && genre !== 'all') query.genre = genre;
    if (featured === 'true') query.featured = true;
    if (bestseller === 'true') query.bestseller = true;
    if (condition) query.condition = condition;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = parseFloat(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const validSorts = ['price', 'rating', 'createdAt'] as const;
    const sortKey = validSorts.includes(sort as typeof validSorts[number]) ? sort : 'createdAt';
    const sortDir = order as 1 | -1;

    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      Book.find(query).sort([[sortKey, sortDir]]).skip(skip).limit(limit).lean(),
      Book.countDocuments(query),
    ]);

    return NextResponse.json({
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const book = await Book.create(body);
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
