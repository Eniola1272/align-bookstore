# Align Bookstore

**A bookstore for book lovers.** Browse thousands of pre-loved and new books, add them to your cart, and check out securely with Paystack. Every great story deserves a reader.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- **Book Catalogue** — Browse books by genre, condition, rating, or search by title/author
- **Product Pages** — Detailed book pages with cover, description, condition badge, stock status, and related books
- **Shopping Cart** — Persistent cart (survives page refresh), slide-out drawer, quantity controls
- **Paystack Checkout** — Secure NGN payments via Paystack's hosted payment page
- **Order History** — View all past orders with status tracking
- **Authentication** — Sign in with Google OAuth or email/password
- **Responsive Design** — Works on all screen sizes

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **Database** — MongoDB Atlas + Mongoose
- **Auth** — NextAuth.js (Google + Credentials)
- **Payments** — Paystack

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Paystack account

### 1. Clone the repository

```bash
git clone https://github.com/Eniola1272/pageturn-bookstore.git
cd pageturn-bookstore
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pageturn?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Paystack — get these from dashboard.paystack.com > Settings > API Keys
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

Generate a `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Seed the database

```bash
node scripts/seed.js
```

This inserts 20 books across multiple genres with real cover images.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── shop/                     # Browse catalogue
│   ├── books/[id]/               # Product detail page
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout form
│   ├── orders/                   # Order history + success page
│   └── api/
│       ├── products/             # Book listing + single product
│       ├── checkout/             # Paystack transaction init
│       ├── verify-payment/       # Paystack payment verification
│       └── orders/               # Order creation + history
├── components/
│   ├── BookCard.tsx              # Product card
│   ├── CartDrawer.tsx            # Slide-out cart
│   └── Navbar.tsx
└── context/
    └── CartContext.tsx           # Global cart state (localStorage)
```

## Payment Flow

1. User fills in shipping details on `/checkout`
2. App calls `POST /api/checkout` → Paystack initializes a transaction
3. User is redirected to Paystack's hosted payment page
4. On success, Paystack redirects to `/orders/success?reference=xxx`
5. App calls `GET /api/verify-payment?reference=xxx` → verifies with Paystack and creates the order

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List books (supports `genre`, `condition`, `bestseller`, `search`, `sort`, `page`) |
| GET | `/api/products/:id` | Single book |
| POST | `/api/checkout` | Initialize Paystack transaction |
| GET | `/api/verify-payment` | Verify payment + create order |
| GET | `/api/orders` | Current user's orders |
| GET | `/api/orders/:id` | Single order |

## Deployment

### Vercel

1. Push to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Set `NEXTAUTH_URL` to your production domain
5. Deploy

## Author

**Eniola Aderounmu**
- GitHub: [@Eniola1272](https://github.com/Eniola1272)
- Twitter: [@eniaderounmu](https://twitter.com/eniaderounmu)

---

Built with Next.js, MongoDB, and Paystack.
