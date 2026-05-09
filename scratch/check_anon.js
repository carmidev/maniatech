const { createClient } = require('@supabase/supabase-js');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzU0MTksImV4cCI6MjA5MjQ1MTQxOX0.NVH7dV-X2WRFB_NsjwWDPoX8YVacOS5Sy3ebx2Vc9iE';

const supabase = createClient(url, anonKey);

async function check() {
  const { data, error } = await supabase.from('products').select('*, inventory(quantity)').limit(3);
  console.log('Anon Data:', JSON.stringify(data, null, 2));
  if (error) console.error('Error:', error);
}

check();
