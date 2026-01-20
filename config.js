// Replace these values with your Supabase project credentials
// For Vercel deployment, these will be replaced by build.js using environment variables
const SUPABASE_URL = 'https://lejbehjavxahhoowqlkq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlamJlaGphdnhhaGhvb3dxbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg5MzYsImV4cCI6MjA4MzcyNDkzNn0.mMYhyu3m_2wqEP-ly00YCFnD405KlqYqxPKLvZjcSMU';

// Initialize Supabase client and make it globally accessible
window.supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

// Make it global if needed
window.supabaseClient = supabaseClient;