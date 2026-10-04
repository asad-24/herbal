# Herbal Ecommerce

Next.js herbal ecommerce storefront with a local SQLite database, Cash on Delivery checkout, WhatsApp order handoff, and an admin panel.

## Features

- Storefront pages for home, shop, collections, products, cart, checkout, certificates, lab reports, contact, and policies.
- Client-side cart saved in localStorage.
- COD checkout saved through Prisma Client.
- WhatsApp order summary link after checkout.
- Admin login, dashboard, products, categories, orders, certificates, and store settings.

## Setup

```bash
npm install --legacy-peer-deps --ignore-scripts
cp .env.example .env
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Admin Login

```text
Email: admin@herbal.local
Password: Admin123!
```

Change the admin password and `ADMIN_SESSION_SECRET` before production use.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:push
npm run db:seed
```

`db:push` syncs the Prisma schema to MongoDB Atlas.

For Vercel, set these Environment Variables in Project Settings:

```text
MONGODB_URI
ADMIN_SESSION_SECRET
```
