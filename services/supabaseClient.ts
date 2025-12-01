
// Initialize Supabase client
const SUPABASE_URL = 'https://ubvqjnxjzvrspeljmsgg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidnFqbnhqenZyc3BlbGptc2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTk2MDUsImV4cCI6MjA3OTUzNTYwNX0.yYxUWtQIvOu0bHuGTE6SNC9KHUtUTIylkVNPpvJcXXw';

// @ts-ignore
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
