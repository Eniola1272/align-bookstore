import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="font-semibold text-brand-950">Align Bookstore</span>
            </div>
            <p className="text-sm text-brand-400 leading-relaxed">
              Curated books for curious minds. New and pre-loved titles at prices you&apos;ll love.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-700 mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-brand-500">
              <li><Link href="/shop" className="hover:text-brand-700 transition-colors">All Books</Link></li>
              <li><Link href="/shop?genre=Fiction" className="hover:text-brand-700 transition-colors">Fiction</Link></li>
              <li><Link href="/shop?genre=Non-Fiction" className="hover:text-brand-700 transition-colors">Non-Fiction</Link></li>
              <li><Link href="/shop?bestseller=true" className="hover:text-brand-700 transition-colors">Bestsellers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-700 mb-3">Help</h3>
            <ul className="space-y-2 text-sm text-brand-500">
              <li><Link href="/shipping-policy" className="hover:text-brand-700 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/orders" className="hover:text-brand-700 transition-colors">My Orders</Link></li>
              <li><a href="mailto:hello@alignbookstore.com" className="hover:text-brand-700 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-400">
          <p>© {new Date().getFullYear()} Align Bookstore. All rights reserved.</p>
          <p>Payments secured by <span className="font-medium text-brand-500">Paystack</span></p>
        </div>
      </div>
    </footer>
  );
}
