// Build script for Vercel deployment
// Replaces environment variables in config.js at build time

const fs = require('fs');
const path = require('path');

// Read config.js
const configPath = path.join(__dirname, 'config.js');
let config = fs.readFileSync(configPath, 'utf8');

// Get environment variables from Vercel
// Vercel automatically provides these during build
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
    // Replace placeholders or actual values with environment variables
    // This regex matches: const SUPABASE_URL = 'any-value-here';
    config = config.replace(
        /const SUPABASE_URL = ['"](.*?)['"];?/g,
        `const SUPABASE_URL = '${supabaseUrl}';`
    );
    config = config.replace(
        /const SUPABASE_ANON_KEY = ['"](.*?)['"];?/g,
        `const SUPABASE_ANON_KEY = '${supabaseKey}';`
    );
    console.log('✅ Environment variables injected into config.js');
} else {
    console.warn('⚠️  Environment variables not found. Using values from config.js.');
    console.warn('   Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel.');
}

// Write updated config
fs.writeFileSync(configPath, config);
