# License Tracking System - Supabase Setup

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project

## Setup Instructions

### 1. Get Supabase Credentials

After creating your project:
1. Go to Project Settings → API
2. Copy the following values:
   - `Project URL` (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - `anon public` key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 2. Configure Environment Variables

Create or update `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create Database Table

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click "Run" to execute the SQL

This will:
- Create the `licenses` table
- Add indexes for better query performance
- Insert the initial mock data

### 4. Run the Application

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Verifying the Setup

1. The application should load without errors
2. You should see 10 license records in the dashboard
3. The stats cards should show correct counts
4. Filtering and grouping should work properly

## Troubleshooting

- **"Failed to fetch licenses"**: Check that your environment variables are correct
- **No data showing**: Verify the SQL script ran successfully in Supabase
- **Build errors**: Make sure all dependencies are installed with `npm install`
