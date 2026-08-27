const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if credentials exist to assist beginner developers with debugging
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn(
    '\n⚠️  [Supabase Warning] SUPABASE_URL or SUPABASE_ANON_KEY is not configured or using placeholder values in /server/.env.'
  );
  console.warn('   To connect to your real Supabase project:');
  console.warn('   1. Create a project at https://database.new or https://supabase.com');
  console.warn('   2. Copy Project URL and Anon/Public API Key from Project Settings -> API');
  console.warn('   3. Paste them into your /server/.env file\n');
}

/**
 * Initialize and export the Supabase client instance.
 *
 * How it works:
 * - `supabaseUrl`: The unique REST API endpoint for your PostgreSQL database hosted on Supabase.
 * - `supabaseAnonKey`: The public anonymous key. It is safe to use in client/server code and respects
 *   Row Level Security (RLS) policies configured in PostgreSQL.
 */
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-anon-key');

module.exports = {
  supabase,
};
