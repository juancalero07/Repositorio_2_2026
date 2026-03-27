import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kjldntnpvmkrsgfqyesm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbGRudG5wdm1rcnNnZnF5ZXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTQwNDAsImV4cCI6MjA4ODgzMDA0MH0.mdLMxJT5KF8M5_goDE5H8kIVa0Tagp8c8Lq6Y8EF2nY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
