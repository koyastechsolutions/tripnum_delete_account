// Supabase Configuration
// Replace these values with your Supabase project credentials
// For Vercel deployment, these will be replaced by build.js using environment variables
window.SUPABASE_URL = 'YOUR_SUPABASE_URL';
window.SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client and make it globally accessible
window.supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
