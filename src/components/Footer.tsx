import Link from "next/link";
import { AppData } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-100 text-brand-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-brand-950 font-semibold text-lg">Align Bookstore</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Curated books for curious minds. New and pre-loved titles at prices you&apos;ll love.
            </p>
            <div className="flex items-center gap-3">
              {AppData.socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center text-brand-500 hover:bg-brand-600 hover:text-white transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-brand-900 text-sm font-semibold mb-5 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm">
              {AppData.footerLinks.shop.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-brand-700 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-brand-900 text-sm font-semibold mb-5 uppercase tracking-wider">Account</h4>
            <ul className="space-y-3 text-sm">
              {AppData.footerLinks.account.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-brand-700 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-brand-900 text-sm font-semibold mb-5 uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm">
              {AppData.footerLinks.support.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="hover:text-brand-700 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-400">
          <p>&copy; {new Date().getFullYear()} Align Bookstore. All rights reserved.</p>
          <div className="flex gap-5">
            <span className="cursor-default hover:text-brand-600 transition-colors">Privacy Policy</span>
            <span className="cursor-default hover:text-brand-600 transition-colors">Terms of Service</span>
            <span>Payments by <span className="text-brand-600 font-medium">Paystack</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
