import Link from 'next/link';
import { FREE_SHIPPING_THRESHOLD, IBADAN_SHIPPING_COST, STANDARD_SHIPPING_COST } from '@/lib/shipping';

export const metadata = {
  title: 'Shipping Policy — Align Bookstore',
  description: 'Delivery rates, timelines, and free shipping details for Align Bookstore orders.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-brand-400 mb-4">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="text-brand-600 font-medium">Shipping Policy</span>
          </nav>
          <h1 className="text-4xl font-serif text-brand-950 mb-3">Shipping Policy</h1>
          <p className="text-brand-500">Last updated: April 2025</p>
        </div>

        <div className="space-y-8">
          {/* Delivery Rates */}
          <section className="bg-white rounded-card border border-brand-100 p-6">
            <h2 className="text-xl font-semibold text-brand-950 mb-4">Delivery Rates</h2>
            <div className="overflow-hidden rounded-lg border border-brand-100">
              <table className="w-full text-sm">
                <thead className="bg-brand-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-brand-700">Location</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-700">Order Value</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-700">Shipping Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  <tr className="bg-green-50/50">
                    <td className="px-4 py-3 text-brand-950 font-medium">Ibadan</td>
                    <td className="px-4 py-3 text-brand-600">₦{FREE_SHIPPING_THRESHOLD.toLocaleString()} and above</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">Free</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-brand-950 font-medium">Ibadan</td>
                    <td className="px-4 py-3 text-brand-600">Below ₦{FREE_SHIPPING_THRESHOLD.toLocaleString()}</td>
                    <td className="px-4 py-3 text-brand-950">₦{IBADAN_SHIPPING_COST.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-brand-950 font-medium">Other Nigerian Cities</td>
                    <td className="px-4 py-3 text-brand-600">Any order value</td>
                    <td className="px-4 py-3 text-brand-950">₦{STANDARD_SHIPPING_COST.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-brand-400 mt-3">
              Shipping costs are calculated at checkout based on your delivery city.
            </p>
          </section>

          {/* Free Shipping */}
          <section className="bg-white rounded-card border border-brand-100 p-6">
            <h2 className="text-xl font-semibold text-brand-950 mb-3">Free Shipping</h2>
            <div className="flex gap-3 p-4 bg-green-50 border border-green-100 rounded-lg mb-4">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-800">
                Orders over <strong>₦{FREE_SHIPPING_THRESHOLD.toLocaleString()}</strong> qualify for free delivery — exclusively for orders delivered within <strong>Ibadan</strong>.
              </p>
            </div>
            <p className="text-sm text-brand-600">
              Free shipping does not currently apply to deliveries outside Ibadan. We hope to extend this offer to more cities soon.
            </p>
          </section>

          {/* Delivery Times */}
          <section className="bg-white rounded-card border border-brand-100 p-6">
            <h2 className="text-xl font-semibold text-brand-950 mb-4">Estimated Delivery Times</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-2" />
                <div>
                  <p className="text-sm font-medium text-brand-950">Ibadan — 1–2 business days</p>
                  <p className="text-xs text-brand-400">Same-day delivery may be available for orders placed before 12 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-2" />
                <div>
                  <p className="text-sm font-medium text-brand-950">Lagos & Abuja — 2–3 business days</p>
                  <p className="text-xs text-brand-400">Via courier partner</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-2" />
                <div>
                  <p className="text-sm font-medium text-brand-950">Other Nigerian Cities — 3–5 business days</p>
                  <p className="text-xs text-brand-400">Delivery timelines may vary by location</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-400 mt-4">
              Delivery times are estimates and may be affected by weekends, public holidays, or unforeseen circumstances.
            </p>
          </section>

          {/* Order Processing */}
          <section className="bg-white rounded-card border border-brand-100 p-6">
            <h2 className="text-xl font-semibold text-brand-950 mb-3">Order Processing</h2>
            <p className="text-sm text-brand-600 mb-3">
              Orders are typically processed within <strong>1 business day</strong> of payment confirmation. You will receive an email confirmation once your order is placed.
            </p>
            <p className="text-sm text-brand-600">
              For pre-owned books, we carefully inspect each item before dispatch to ensure it matches the listed condition.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-brand-50 rounded-card border border-brand-100 p-6">
            <h2 className="text-xl font-semibold text-brand-950 mb-3">Questions?</h2>
            <p className="text-sm text-brand-600 mb-4">
              If you have any questions about your delivery or our shipping policy, please don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-pill hover:bg-brand-700 transition-colors"
              >
                Browse Books
              </Link>
              <a
                href="mailto:hello@alignbookstore.com"
                className="px-5 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-pill hover:bg-brand-100 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
