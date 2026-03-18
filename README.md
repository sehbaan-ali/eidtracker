# Eid Order Tracker 2025

Modern, cloud-based order management system for Eid celebrations, featuring a sleek dark theme inspired by Claude.com.

## Features

✅ **Modern Dark UI** - Professional interface with orange accents and large, readable text
✅ **Cloud Storage** - Supabase backend for access from any device
✅ **Fast Search** - Instant filtering by name, phone number, or order number
✅ **Smart Filters** - Toggle between mutton/chicken orders, filter by payment status
✅ **Custom Extras** - Support for special items beyond the standard menu
✅ **Payment Tracking** - Track paid and pay-later orders with outstanding balances
✅ **Live Statistics** - Real-time dashboard showing revenue, items, and remaining inventory
✅ **Mobile Friendly** - Responsive design works on phones, tablets, and desktops

## Tech Stack

- **Framework:** Next.js 15 with React 19 & TypeScript
- **UI:** shadcn/ui with Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (recommended)

## Quick Start

### 1. Set Up Supabase

Follow the detailed instructions in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

Quick summary:
1. Create a Supabase project at https://supabase.com
2. Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
3. Get your project URL and anon key from Settings → API

### 2. Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Adding an Order

1. Click the **"New Order"** button in the top right
2. Fill in customer information (name & phone)
3. Enter quantities for menu items
4. (Optional) Click "Show" under Custom Items to add special items like "Mutton Rolls"
5. Select payment status (Paid or Pay Later)
6. Click **"Create Order"**

### Searching for Orders

Use the search bar to find orders by:
- Customer name (e.g., "Ramzy")
- Phone number (e.g., "7546778168")
- Order number (e.g., "7")

### Filtering Orders

- **Order Type Tabs:** Switch between All / Mutton Only / Chicken Only
- **Payment Filter:** Show All / Paid / Pay Later orders

### Editing an Order

1. Click the edit icon (pencil) on any order row
2. Make your changes
3. Click **"Update Order"**

### Marking Orders as Paid

Click the green checkmark icon on pay-later orders to instantly mark them as paid.

### Understanding the Dashboard

**Stats Cards:**
- Total Orders, Total Revenue, Paid Revenue, Outstanding Payments
- Item breakdown showing counts for all menu items

**Remaining Items:**
- Shows total items ordered (useful for kitchen prep)

**Pay Later List:**
- Quick view of all unpaid orders
- Sorted by amount (highest first)
- Click any order to edit it

## Default Prices

The system comes pre-configured with these prices:
- **Full Savan (Mutton/Chicken):** £89
- **Half Savan:** £48
- **Extra Chicken:** £16
- **Extra Wattalpam:** £16

You can update prices in the settings (coming soon) or directly in Supabase.

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

Your app will be live at `https://your-app.vercel.app`

## Importing Existing Data

To import your existing Excel data (`Eid_day2603.xlsx`), you can:

**Option A: Manual Entry** - Use the UI to add orders one by one (recommended for <20 orders)

**Option B: SQL Import** - Write a script to convert your Excel data to SQL INSERT statements and run them in Supabase

## Troubleshooting

**"Missing Supabase environment variables"**
- Make sure `.env.local` exists in the root directory
- Restart the dev server: `npm run dev`

**Orders not showing up**
- Check the browser console for errors
- Verify Supabase connection in the Network tab
- Make sure Row Level Security is disabled (see `SUPABASE_SETUP.md`)

**Dark theme not working**
- The app forces dark mode in `app/layout.tsx`
- Check that Tailwind CSS is compiling correctly

## Future Enhancements

- [ ] Multi-year support (archive old years)
- [ ] Excel/CSV export for backups
- [ ] Print receipt functionality
- [ ] Delivery tracking
- [ ] SMS reminders for pay-later customers
- [ ] Analytics dashboard (busiest hours, popular items)

## Support

Need help? Check:
1. [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for database setup
2. Browser console for error messages
3. Supabase dashboard → Logs for backend errors

## License

MIT - Feel free to use and modify for your needs!

---

Built with ❤️ for efficient Eid order management
