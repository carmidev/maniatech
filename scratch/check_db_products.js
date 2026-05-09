const https = require('https');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co/rest/v1/products?select=*';
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';

https.get(url, { headers: { 'apikey': apikey, 'Authorization': `Bearer ${apikey}` } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('Products:', JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Error parsing JSON:', err);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching:', err);
});
