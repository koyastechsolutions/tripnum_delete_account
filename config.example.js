// Supabase Configuration Example
// Copy this file to config.js and fill in your Supabase credentials

const SUPABASE_URL = 'https://lejbehjavxahhoowqlkq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlamJlaGphdnhhaGhvb3dxbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg5MzYsImV4cCI6MjA4MzcyNDkzNn0.mMYhyu3m_2wqEP-ly00YCFnD405KlqYqxPKLvZjcSMU';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
