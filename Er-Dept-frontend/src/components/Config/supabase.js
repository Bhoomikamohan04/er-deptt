import { createClient } from "@supabase/supabase-js";

// Direct configuration for testing - replace these with your actual Supabase URL and anon key
const supabaseUrl = "https://tcpzfkrpyjgsfrzxddta.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcHpma3JweWpnc2ZyenhkZHRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDQ3OTEsImV4cCI6MjA3NTIyMDc5MX0.6sY3WOe9GdrMbpBnEo-a3t9WaaD6zkT6NxJi3U7zAQw";

console.log("Initializing Supabase with URL:", supabaseUrl);

export const supabaseclient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection on startup
(async () => {
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabaseclient.from('users').select('*').limit(1);
    if (error) {
      console.error("Supabase connection error:", error);
    } else {
      console.log("Supabase connected successfully!");
    }
  } catch (err) {
    console.error("Error testing Supabase connection:", err);
  }
})();
