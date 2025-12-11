import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://msaadrpyttiiejglqbbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zYWFkcnB5dHRpaWVqZ2xxYmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMjIwMTUsImV4cCI6MjA3OTU5ODAxNX0.z5a_27i5K-U5Gx9f1YnVoqnEtQjME2fjXNVy5SlGO-U';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };