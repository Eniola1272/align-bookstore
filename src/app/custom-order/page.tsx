'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FormData {
  name: string;
  email: string;
  phone: string;
  bookTitle: string;
  bookAuthor: string;
  isbn: string;
  quantity: number;
  notes: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  bookTitle: '',
  bookAuthor: '',
  isbn: '',
  quantity: 1,
  notes: '',
};

export default function CustomOrderPage() {
  const { profile, status } = useUser();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Auto-fill when user logs in
  useEffect(() => {
    if (profile) {
      setForm(prev => ({
        ...prev,
        name: prev.name || profile.name || '',
        email: prev.email || profile.email || '',
      }));
    }
  }, [profile]);

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Your name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.bookTitle.trim()) newErrors.bookTitle = 'Book title is required';
    if (form.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }
      setSubmitted(true);
      toast.success('Your book request has been submitted!');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  if (submitted) {
    return (
      <>
        <main className="min-h-screen bg-surface">
          <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fade-in">
            {/* Success checkmark */}
            <div className="relative mx-auto w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-serif text-brand-950 mb-4">Request Received!</h1>
            <p className="text-brand-500 text-lg max-w-md mx-auto mb-3">
              We&apos;ve got your book request. Our team will source <strong className="text-brand-700">&ldquo;{form.bookTitle}&rdquo;</strong> and get back to you soon.
            </p>
            <p className="text-brand-400 text-sm mb-10">
              We&apos;ll reach out via <strong className="text-brand-600">{form.email}</strong> or <strong className="text-brand-600">{form.phone}</strong> with updates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => { setSubmitted(false); setForm(prev => ({ ...initialForm, name: prev.name, email: prev.email, phone: prev.phone })); }}
                className="px-8 py-3.5 bg-brand-600 text-white font-semibold rounded-pill hover:bg-brand-700 transition-colors shadow-glow"
              >
                Request Another Book
              </button>
              <Link href="/shop" className="px-8 py-3.5 border border-brand-200 text-brand-700 font-medium rounded-pill hover:bg-brand-50 transition-colors">
                Browse Collection
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        {/* Hero header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-pill px-4 py-1.5 mb-6">
              <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-amber-200 text-sm font-medium">We&apos;ll find it for you</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif text-white leading-tight mb-4">
              Can&apos;t find a book?<br />
              <em className="text-amber-300 not-italic">Let us source it.</em>
            </h1>
            <p className="text-brand-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Tell us what you&apos;re looking for and we&apos;ll track it down. Fill out the form below
              and our team will get back to you with availability and pricing.
            </p>
          </div>
        </section>

        {/* Form section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
          {/* Guest sign-in prompt */}
          {status === 'unauthenticated' && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-card p-4 flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-amber-800">
                  <Link href="/auth/signin" className="font-semibold text-amber-900 hover:underline">Sign in</Link>
                  {' '}to auto-fill your details and track your requests.
                </p>
              </div>
            </div>
          )}

          {/* Logged-in indicator */}
          {status === 'authenticated' && profile && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-card p-4 flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-green-800">
                  Signed in as <strong className="text-green-900">{profile.name}</strong> — your details have been filled in automatically.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-card-lg shadow-soft border border-brand-100 overflow-hidden">
            {/* Section: Your Details */}
            <div className="px-6 sm:px-8 pt-8 pb-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-brand-950">Your Details</h2>
                  <p className="text-sm text-brand-400">So we can reach you with updates</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-2">
                {/* Full Name */}
                <div>
                  <label htmlFor="custom-name" className="block text-sm font-medium text-brand-950 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="custom-name"
                    type="text"
                    value={form.name}
                    onChange={e => updateField('name', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-brand-400 outline-none transition-colors text-sm ${errors.name ? 'border-red-300 bg-red-50/30' : 'border-brand-200'}`}
                    placeholder="Adebayo Ogunlana"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="custom-email" className="block text-sm font-medium text-brand-950 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="custom-email"
                    type="email"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-brand-400 outline-none transition-colors text-sm ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-brand-200'}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label htmlFor="custom-phone" className="block text-sm font-medium text-brand-950 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  id="custom-phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-brand-400 outline-none transition-colors text-sm ${errors.phone ? 'border-red-300 bg-red-50/30' : 'border-brand-200'}`}
                  placeholder="+234 801 234 5678"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="border-t border-brand-100" />

            {/* Section: Book Details */}
            <div className="px-6 sm:px-8 pt-6 pb-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-brand-950">Book Details</h2>
                  <p className="text-sm text-brand-400">Tell us what you&apos;re looking for</p>
                </div>
              </div>

              {/* Book Title */}
              <div className="mb-4">
                <label htmlFor="custom-book-title" className="block text-sm font-medium text-brand-950 mb-1.5">
                  Book Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="custom-book-title"
                  type="text"
                  value={form.bookTitle}
                  onChange={e => updateField('bookTitle', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-brand-400 outline-none transition-colors text-sm ${errors.bookTitle ? 'border-red-300 bg-red-50/30' : 'border-brand-200'}`}
                  placeholder="e.g. Things Fall Apart"
                />
                {errors.bookTitle && <p className="text-xs text-red-500 mt-1">{errors.bookTitle}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {/* Author */}
                <div>
                  <label htmlFor="custom-author" className="block text-sm font-medium text-brand-950 mb-1.5">
                    Author <span className="text-brand-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="custom-author"
                    type="text"
                    value={form.bookAuthor}
                    onChange={e => updateField('bookAuthor', e.target.value)}
                    className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-brand-400 outline-none transition-colors text-sm"
                    placeholder="e.g. Chinua Achebe"
                  />
                </div>

                {/* ISBN */}
                <div>
                  <label htmlFor="custom-isbn" className="block text-sm font-medium text-brand-950 mb-1.5">
                    ISBN <span className="text-brand-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="custom-isbn"
                    type="text"
                    value={form.isbn}
                    onChange={e => updateField('isbn', e.target.value)}
                    className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-brand-400 outline-none transition-colors text-sm"
                    placeholder="e.g. 978-0-385-47454-2"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label htmlFor="custom-qty" className="block text-sm font-medium text-brand-950 mb-1.5">
                  Quantity
                </label>
                <div className="flex items-center gap-3 max-w-[160px]">
                  <button
                    type="button"
                    onClick={() => updateField('quantity', Math.max(1, form.quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-brand-200 flex items-center justify-center text-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    id="custom-qty"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={e => updateField('quantity', Math.max(1, Number(e.target.value) || 1))}
                    className="w-16 text-center px-2 py-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 outline-none transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => updateField('quantity', form.quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-brand-200 flex items-center justify-center text-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label htmlFor="custom-notes" className="block text-sm font-medium text-brand-950 mb-1.5">
                  Additional Notes <span className="text-brand-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="custom-notes"
                  rows={3}
                  value={form.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-brand-400 outline-none transition-colors text-sm resize-none"
                  placeholder="Preferred edition, condition (new/used), any other details..."
                />
              </div>
            </div>

            {/* Submit */}
            <div className="px-6 sm:px-8 py-6 bg-brand-50/50 border-t border-brand-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-3.5 bg-brand-600 text-white font-semibold rounded-pill hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed transition-all shadow-glow text-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Book Request
                  </>
                )}
              </button>
              <p className="text-xs text-brand-400 mt-3">
                We&apos;ll review your request and get back to you within 24–48 hours.
              </p>
            </div>
          </form>

          {/* How it works */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-brand-950 text-center mb-8">How it works</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: '1', icon: '📝', title: 'Submit Request', desc: 'Fill out the form with the book details you\'re looking for.' },
                { step: '2', icon: '🔍', title: 'We Source It', desc: 'Our team searches our network of suppliers to find your book.' },
                { step: '3', icon: '📦', title: 'Get Notified', desc: 'We\'ll contact you with availability, pricing, and delivery info.' },
              ].map(({ step, icon, title, desc }) => (
                <div key={step} className="relative text-center p-6 rounded-card-lg bg-white border border-brand-100 hover:border-brand-300 hover:shadow-soft transition-all">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{step}</span>
                  </div>
                  <span className="text-3xl mb-3 block mt-2">{icon}</span>
                  <h4 className="font-semibold text-brand-950 mb-1">{title}</h4>
                  <p className="text-sm text-brand-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
