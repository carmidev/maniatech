const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzU0MTksImV4cCI6MjA5MjQ1MTQxOX0.NVH7dV-X2WRFB_NsjwWDPoX8YVacOS5Sy3ebx2Vc9iE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  const { data, error } = await supabase.from('products').select('*').limit(5);
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Columns:', Object.keys(data[0] || {}));
    console.log('Sample Data:', JSON.stringify(data, null, 2));
  }
}
checkDb();
