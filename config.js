// Replace these values with your Supabase project credentials
// For Vercel deployment, these will be replaced by build.js using environment variables
const SUPABASE_URL = 'https://lejbehjavxahhoowqlkq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlamJlaGphdnhhaGhvb3dxbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg5MzYsImV4cCI6MjA4MzcyNDkzNn0.mMYhyu3m_2wqEP-ly00YCFnD405KlqYqxPKLvZjcSMU';

// Validate configuration
if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_URL.trim() === '') {
  console.error('❌ SUPABASE_URL is not configured. Please set SUPABASE_URL in config.js or as an environment variable.');
  throw new Error('SUPABASE_URL is required');
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY' || SUPABASE_ANON_KEY.trim() === '') {
  console.error('❌ SUPABASE_ANON_KEY is not configured. Please set SUPABASE_ANON_KEY in config.js or as an environment variable.');
  throw new Error('SUPABASE_ANON_KEY is required');
}

// Initialize Supabase client and make it globally accessible
// Note: window.supabase is the Supabase library loaded from CDN
// We create a client instance and store it in window.supabaseClient
if (!window.supabase) {
  console.error('❌ Supabase library not loaded. Make sure the CDN script is loaded before config.js');
  throw new Error('Supabase library not found');
}

try {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error);
  throw error;
}