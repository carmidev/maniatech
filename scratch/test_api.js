const https = require('https');

https.get('https://pydolarve.org/api/v1/euro?monitor=bcv', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("EURO:", data); });
}).on("error", (err) => { console.log("Error: " + err.message); });

https.get('https://pydolarve.org/api/v1/dollar?page=bcv', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("DOLLAR PAGE:", data); });
}).on("error", (err) => { console.log("Error: " + err.message); });
