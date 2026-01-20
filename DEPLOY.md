# Deploying to Vercel

This guide will help you deploy your Account Deletion Request application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your Supabase project URL and anon key
- Your code pushed to GitHub (recommended) or ready to deploy via CLI

## Quick Deploy Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **Import Git Repository**
   - Select your repository
   - Click **Import**

3. **Configure Project**
   - **Framework Preset**: Other (or leave as default)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (optional, but recommended)
   - **Output Directory**: Leave empty (static site)
   - Click **Deploy**

4. **Add Environment Variables**
   - After deployment, go to your project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add the following:
     ```
     SUPABASE_URL = https://lejbehjavxahhoowqlkq.supabase.co
     SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - Select **Production**, **Preview**, and **Development** environments
   - Click **Save**

5. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**
   - Your site will rebuild with the environment variables

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No** (first time) or **Yes** (subsequent)
   - Project name? Enter a name or press Enter for default
   - Directory? Press Enter for current directory
   - Override settings? **No**

4. **Set Environment Variables**
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   ```
   
   Enter the values when prompted.

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Environment Variables Setup

Your `config.js` file uses placeholders that get replaced during build. Make sure to set these in Vercel:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Where to Find Your Supabase Credentials

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon public** key → Use as `SUPABASE_ANON_KEY`

## Post-Deployment Checklist

- [ ] Environment variables are set in Vercel
- [ ] Site is accessible at your Vercel URL
- [ ] Can log in with Supabase credentials
- [ ] Database table `account_deletion_requests` exists (run `supabase-setup.sql`)
- [ ] Deletion requests are being saved to database

## Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that `build.js` exists and is executable
- Verify Node.js version in Vercel settings (use Node 18+)
- Check build logs in Vercel dashboard

### Environment Variables Not Working

- Make sure variables are set for all environments (Production, Preview, Development)
- Redeploy after adding environment variables
- Check that variable names match exactly: `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### Database Connection Issues

- Verify Supabase URL and key are correct
- Check that Row Level Security (RLS) policies are set up
- Ensure the `account_deletion_requests` table exists

### CORS Errors

- Add your Vercel domain to Supabase allowed origins
- Go to Supabase Dashboard → **Settings** → **API** → **Allowed Origins**

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Use production environment variables for main branch
- Use preview environment variables for PRs

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- Check your Vercel deployment logs for detailed error messages
