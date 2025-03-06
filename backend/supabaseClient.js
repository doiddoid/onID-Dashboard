import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://fujskhtscwigmookcctd.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1anNraHRzY3dpZ21vb2tjY3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExODYxNDYsImV4cCI6MjA1Njc2MjE0Nn0.wIW_WkUcIXEmLJmBrMEArO5QIdkWs_6M2fpYym0a978';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
