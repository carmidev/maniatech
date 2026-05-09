const https = require('https');

https.get('https://pydolarvenezuela.com/api/v1/euro?monitor=bcv', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("EURO:", data); });
}).on("error", (err) => { console.log("Error euro: " + err.message); });

https.get('https://pydolarvenezuela.com/api/v1/dollar?monitor=bcv', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("DOLLAR:", data); });
}).on("error", (err) => { console.log("Error dollar: " + err.message); });
