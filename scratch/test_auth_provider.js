const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oroqqrrdhqzaftqsuopt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w'
);

async function testCheckConstraint() {
  const testId = '00000000-0000-0000-0000-000000000001';
  
  const basePayload = {
    id: testId,
    first_name: 'Test',
    last_name: 'User',
    id_number: '12345678', // REQUIRED
  };

  const possibleValues = ['google', 'whatsapp', 'phone', 'email'];
  
  console.log('Testing values for auth_provider...');
  for (const val of possibleValues) {
    const { error } = await supabase.from('customers').upsert({
      ...basePayload,
      auth_provider: val
    });
    
    if (error) {
      console.log(`❌ "${val}" -> ${error.message}`);
    } else {
      console.log(`✅ "${val}" -> Valid!`);
      await supabase.from('customers').delete().eq('id', testId);
    }
  }
}

testCheckConstraint();
