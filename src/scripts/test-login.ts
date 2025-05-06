import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    return null;
  }

  return data;
}

async function main() {
  const email = 'alice@example.com';
  const password = 'password123';

  console.log('Attempting to sign in...');
  const result = await signIn(email, password);

  if (result) {
    console.log('Signed in successfully!');
    console.log('User:', result.user);
    console.log('Session:', result.session);
  } else {
    console.log('Failed to sign in');
  }
}

main().catch(console.error); 