import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zhoexoqdfhkxhjilleuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpob2V4b3FkZmhreGhqaWxsZXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzgwMDAsImV4cCI6MjA4MDA1NDAwMH0.lqnPd3ZqK9GfexNtyPEgTKnTPUzAkw9B3yhVGGz_5q8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
