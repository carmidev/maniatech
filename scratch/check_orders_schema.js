const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oroqqrrdhqzaftqsuopt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w'
);

async function testInsert() {
    const { error } = await supabase.from('orders').insert({
        customer_name: 'Test All',
        customer_email: 'test@example.com',
        total_amount: 1,
        payment_method: 'zelle',
        delivery_method: 'DELIVERY',
        pickup_store: 'campoclaro',
        payment_holder: 'Test',
        payment_reference: 'Test',
        payment_cash_amount: 0,
        delivery_address: 'Test',
        customer_phone: 'Test'
    });
    console.log('Error:', JSON.stringify(error, null, 2));
}

testInsert();
