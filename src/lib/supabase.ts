import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ektveadayckcuucrbidl.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjljODQ4YTc0LWFhOGUtNGQ2Yi05NzM2LWViNDVmMDU2ZDMzNSJ9.eyJwcm9qZWN0SWQiOiJla3R2ZWFkYXlja2N1dWNyYmlkbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY0MDEyNTQ5LCJleHAiOjIwNzkzNzI1NDksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.wV0k2vTAcF4aUGlMwtkPCOWfeRk300E2DCaE3Rv_yjI';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };