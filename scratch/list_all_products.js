const https = require('https');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co/rest/v1/products?select=id,name,category';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';

https.get(url, { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const products = JSON.parse(data);
      console.log('Total Products:', products.length);
      products.forEach(p => {
        console.log(`- [${p.id}] ${p.name}: ${JSON.stringify(p.category)}`);
      });
    } catch (err) {
      console.error('Error:', err);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err);
});
