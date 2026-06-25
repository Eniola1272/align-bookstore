import Link from "next/link";
import BookCard from "@/components/BookCard";
import { getBooks } from "@/lib/supabase/queries";
import { AppData } from "@/lib/data";

async function getFeaturedBooks() {
  try {
    return await getBooks({
      where: { status: 'active', stock: { gt: 0 } },
      orderBy: [{ field: 'featured', direction: 'desc' }, { field: 'created_at', direction: 'desc' }],
      take: 8,
    });
  } catch { return []; }
}

async function getBestsellers() {
  try {
    return await getBooks({
      where: { status: 'active', bestseller: true, stock: { gt: 0 } },
      orderBy: [{ field: 'created_at', direction: 'desc' }],
      take: 4,
    });
  } catch { return []; }
}

export default async function HomePage() {
  const [featuredBooks, bestsellers] = await Promise.all([
    getFeaturedBooks(),
    getBestsellers(),
  ]);

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/book-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-brand-950/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-pill px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-200 text-sm font-medium">New arrivals every week</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif text-white leading-tight">
              Every great story<br />
              <em className="text-amber-300 not-italic">deserves a reader.</em>
            </h1>
            <p className="mt-6 text-lg text-white max-w-xl leading-relaxed">
              Discover thousands of pre-loved and new books at unbeatable prices.
              From timeless classics to today&apos;s bestsellers — your next favourite read is waiting.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/shop" className="px-8 py-3.5 bg-amber-400 text-brand-950 font-semibold rounded-pill hover:bg-amber-300 transition-colors shadow-lg">
                Browse Collection
              </Link>
              <Link href="/shop?bestseller=true" className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-medium rounded-pill hover:bg-white/20 transition-colors">
                View Bestsellers
              </Link>
            </div>
            <div className="flex gap-8 mt-12">
              {AppData.heroStats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-brand-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-8 text-sm text-amber-800 font-medium flex-wrap">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Free shipping on orders over ₦50,000
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Easy 30-day returns
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure checkout
          </span>
        </div>
      </div>

      {/* Genre Browse */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif text-brand-950">Browse by Genre</h2>
            <p className="text-brand-500 mt-1">Find exactly what you&apos;re looking for</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {AppData.genres.map(({ name, emoji, color }) => (
            <Link
              key={name}
              href={`/shop?genre=${encodeURIComponent(name)}`}
              className={`bg-gradient-to-br ${color} rounded-card p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer border border-transparent hover:border-brand-200`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs font-medium text-brand-700 text-center leading-tight">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif text-brand-950">Featured Books</h2>
              <p className="text-brand-500 mt-1">Hand-picked by our team</p>
            </div>
            <Link href="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Bestsellers Strip */}
      {bestsellers.length > 0 && (
        <section className="bg-brand-950 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif text-white">Bestsellers</h2>
                <p className="text-brand-400 mt-1">The books everyone&apos;s reading</p>
              </div>
              <Link href="/shop?bestseller=true" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                See all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bestsellers.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Align */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-brand-950">Why Align?</h2>
          <p className="text-brand-500 mt-2">We&apos;re not just a bookstore — we&apos;re a community of readers</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {AppData.features.map(({ icon, title, description }) => (
            <div key={title} className="text-center p-8 rounded-card-lg border border-brand-100 hover:border-brand-300 hover:shadow-soft transition-all">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-600">
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-brand-950 mb-2">{title}</h3>
              <p className="text-brand-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Order CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 py-20">
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-pill px-4 py-1.5 mb-6">
            <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-amber-200 text-sm font-medium">Custom orders available</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif text-white mb-4">
            Can&apos;t find the book you&apos;re looking for?
          </h2>
          <p className="text-brand-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            No worries — tell us what you want and we&apos;ll source it for you.
            Just fill in a quick form and our team will get back to you within 24–48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/custom-order" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-amber-400 text-brand-950 font-semibold rounded-pill hover:bg-amber-300 transition-colors shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Request a Book
            </Link>
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/10 border border-white/20 text-white font-medium rounded-pill hover:bg-white/20 transition-colors">
              Browse Collection
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
