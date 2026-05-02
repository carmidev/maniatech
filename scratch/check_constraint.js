const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oroqqrrdhqzaftqsuopt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w'
);

async function findRequiredColumns() {
  const testId = '00000000-0000-0000-0000-000000000001';
  
  // Try inserting all fields except one, to find what's blocking
  const allFields = {
    id: testId,
    first_name: 'Test',
    last_name: 'User',
    phone: '+580000000000',
    id_number: '00000000',
    gender: 'Otro',
    address: 'Test address',
    email: null,
    auth_provider: 'google',
  };

  // Try with all fields
  const { error: fullError } = await supabase.from('customers').upsert(allFields);
  if (fullError) {
    console.log('❌ Full payload error:', fullError.message);
  } else {
    console.log('✅ Full payload WORKS! Cleaning up...');
    // Delete the test row
    await supabase.from('customers').delete().eq('id', testId);
  }

  // Now test removing each optional field
  const fields = ['phone', 'id_number', 'gender', 'address', 'email', 'auth_provider'];
  
  console.log('\nTesting which fields can be NULL...');
  for (const field of fields) {
    const payload = { ...allFields };
    delete payload[field];
    const { error } = await supabase.from('customers').upsert(payload);
    if (error) {
      console.log(`❌ ${field} is REQUIRED (NOT NULL): ${error.message}`);
    } else {
      console.log(`✅ ${field} is OPTIONAL (can be null)`);
      await supabase.from('customers').delete().eq('id', testId);
    }
  }
}

findRequiredColumns();
