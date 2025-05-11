import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:5175';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

async function main() {
  const email = 'alice@example.com';
  const password = 'password123';

  console.log('Creating test user...');
  const result = await createTestUser(email, password);

  if (result) {
    console.log('User created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } else {
    console.log('Failed to create user');
  }
}

main().catch(console.error); 