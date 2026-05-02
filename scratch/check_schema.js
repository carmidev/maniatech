const https = require('https');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co/rest/v1/';
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzU0MTksImV4cCI6MjA5MjQ1MTQxOX0.NVH7dV-X2WRFB_NsjwWDPoX8YVacOS5Sy3ebx2Vc9iE';

https.get(url, { headers: { 'apikey': apikey } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('Result:', result);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching:', err);
});
