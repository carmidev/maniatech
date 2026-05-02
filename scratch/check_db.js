const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzU0MTksImV4cCI6MjA5MjQ1MTQxOX0.NVH7dV-X2WRFB_NsjwWDPoX8YVacOS5Sy3ebx2Vc9iE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  try {
    const { data, error } = await supabase.from('customers').select('*').limit(1);
    if (error) {
      console.error('Error fetching customers:', error);
      return;
    }
    if (data && data.length >= 0) {
      console.log('Columns found in customers table:');
      // To get columns from an empty table or one with data
      // We can look at the first row if exists
      if (data.length > 0) {
        console.log(Object.keys(data[0]));
      } else {
        console.log('Table is empty. Trying to insert a dummy to see error or schema...');
        // Another way is to use the RPC to get column names if available, 
        // but let's try a simple select with a non-existent column to see if it lists others? No.
        // Let's just try to select some known columns.
        const { data: cols, error: err2 } = await supabase.from('customers').select('id,full_name,phone,address,email,updated_at').limit(0);
        if (err2) {
          console.log('Error selecting specific columns:', err2.message);
        } else {
          console.log('All requested columns (id, full_name, phone, address, email, updated_at) exist!');
        }
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkColumns();
