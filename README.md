# Account Deletion Request System

A modern web application where users can log in and request account deletion. The system stores deletion requests in Supabase and shows a 10-day countdown before account deletion.

## Features

- 🔐 Supabase Authentication (Login/Logout)
- 📝 Account Deletion Request Submission
- ⏰ 10-Day Deletion Countdown Display
- 📊 Deletion Request Status Tracking
- 🗑️ Cancel Deletion Request Option
- 📱 Responsive Design (Mobile, Tablet, Desktop)
- 🎨 Modern UI with Tailwind CSS

## Setup Instructions

### 1. Supabase Configuration

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

### 2. Configure the Application

Open `config.js` and replace the placeholder values:

```javascript
window.SUPABASE_URL = 'YOUR_SUPABASE_URL';  // Replace with your Supabase URL
window.SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // Replace with your anon key
```

### 3. Set Up the Database

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click **Run** to execute the SQL script

This will create:
- `account_deletion_requests` table to store deletion requests
- Row Level Security (RLS) policies for user data protection
- Indexes for better query performance
- Automatic timestamp updates

### 4. Running the Application

Simply open `index.html` in a web browser, or use a local server:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## How It Works

1. **User Login**: Users sign in with their Supabase credentials
2. **Deletion Request**: After login, users can request account deletion
3. **10-Day Countdown**: The system calculates deletion date (10 days from request)
4. **Status Display**: Users see their deletion date and days remaining
5. **Cancel Option**: Users can cancel their deletion request anytime
6. **Database Storage**: All requests are stored in `account_deletion_requests` table

## Database Schema

The `account_deletion_requests` table contains:

- `id` - Unique identifier (UUID)
- `user_id` - Reference to auth.users (UUID)
- `email` - User's email address
- `requested_at` - When the deletion was requested
- `deletion_date` - When the account will be deleted (10 days from request)
- `status` - Request status (pending, completed, cancelled)
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

## User Flow

1. User visits the website
2. User logs in with email and password
3. System checks for existing deletion request
4. If no request exists:
   - User sees deletion request form
   - User confirms deletion
   - Request is saved with 10-day deletion date
5. If request exists:
   - User sees countdown timer
   - User can cancel the request
   - System shows deletion date

## Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own deletion requests
- ✅ Authentication required for all operations
- ✅ Secure Supabase integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- HTML5
- Tailwind CSS (via CDN)
- Supabase JavaScript Client
- Vanilla JavaScript

## Notes

- The actual account deletion from Supabase Auth must be handled separately (via cron job, Edge Function, or admin panel)
- This application only handles the deletion request and stores it in the database
- You'll need to implement a backend process to actually delete accounts after 10 days

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts to link your project.

4. **Set Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add:
     - `SUPABASE_URL` = Your Supabase project URL
     - `SUPABASE_ANON_KEY` = Your Supabase anon key

5. **Update config.js** to use environment variables (see below)

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **Add New Project**
   - Import your GitHub repository
   - Vercel will auto-detect it as a static site

3. **Set Environment Variables**:
   - In your Vercel project settings
   - Go to **Environment Variables**
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

4. **Deploy**: Vercel will automatically deploy on every push to your main branch

### Using Environment Variables

For production deployment, update `config.js` to use environment variables:

```javascript
// Supabase Configuration
// Uses environment variables for production, fallback for local development
window.SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
window.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
window.supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
```

**Note**: Since this is a client-side app, environment variables need to be injected at build time. For Vercel, you can use `@vercel/env` or inject them via build-time replacement.

### Alternative: Use Vercel Environment Variables with Build Script

Create a simple build script that replaces placeholders:

1. Create `build.js`:
```javascript
const fs = require('fs');
const config = fs.readFileSync('config.js', 'utf8');
const updated = config
  .replace('YOUR_SUPABASE_URL', process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL')
  .replace('YOUR_SUPABASE_ANON_KEY', process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY');
fs.writeFileSync('config.js', updated);
```

2. Update `package.json`:
```json
{
  "scripts": {
    "build": "node build.js"
  }
}
```

**Recommended Approach**: Keep your Supabase credentials in `config.js` but add it to `.gitignore`, then manually add it on Vercel or use Vercel's environment variable injection.

## License

MIT License - feel free to use this project for your needs.
