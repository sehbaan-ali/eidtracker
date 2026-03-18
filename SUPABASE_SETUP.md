# Supabase Setup Instructions

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: Eid Order Tracker
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
5. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Run the Database Migration

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned" - this is correct!

## Step 3: Get Your API Keys

1. In your Supabase project, go to **Settings** → **API** (left sidebar)
2. Find these two values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
3. Copy both values

## Step 4: Configure Your Environment

1. In your eid tracker project, create a file called `.env.local` in the root directory
2. Add your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual URL and key from Step 3.

## Step 5: Create a Test User (Optional for now)

Since this is a single-user app, you can either:

**Option A: Public Access (Simple)**
- Comment out the RLS policies in the migration
- Anyone with the URL can access (fine for internal use)

**Option B: Password Protected (Recommended)**
- Go to **Authentication** → **Users** in Supabase
- Click "Add User"
- Create an email/password
- We'll add a simple login screen

For now, let's go with **Option A** and you can add auth later. To disable RLS temporarily:

Run this SQL query in Supabase SQL Editor:
```sql
-- Disable RLS for testing (single user)
alter table orders disable row level security;
alter table settings disable row level security;
```

## Step 6: Verify Setup

Once you've completed the above:
1. Start your development server: `npm run dev`
2. Open http://localhost:3000
3. The app should connect to Supabase without errors

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure `.env.local` is in the root directory
- Restart the dev server after creating `.env.local`
- Check that the variable names match exactly

**Error: "relation 'orders' does not exist"**
- The migration SQL didn't run successfully
- Go back to Step 2 and run the migration again

**Error: "new row violates row-level security policy"**
- RLS is enabled but no user is authenticated
- Either disable RLS (Step 5, Option A) or create a user and add auth

Need help? Check the error messages and refer to this guide.
