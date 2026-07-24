import { createClient } from '@supabase/supabase-js';

const supabaseUrlRef = import.meta.env.VITE_SUPABASE_URL || 'https://opuavcxbgxlqyxnzzwem.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWF2Y3hiZ3hscXl4bnp6d2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjkzMjMsImV4cCI6MjEwMDIwNTMyM30.QXh_hnVgkcGyY95MdjMJn554lzyfx0GZuDHiTYq_XvA';

// Handle both standard URLs and project reference IDs in env config
const supabaseUrl = supabaseUrlRef.startsWith('http')
  ? supabaseUrlRef
  : `https://${supabaseUrlRef}.supabase.co`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
