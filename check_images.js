const fs = require('fs');
const path = require('path');

// Mock data content
const mockDataContent = fs.readFileSync('src/app/mock-data.ts', 'utf8');

// Regex to find all images arrays
const imagesRegex = /images:\s*\[([^\]]+)\]/g;
let match;
const allimages = [];

while ((match = imagesRegex.exec(mockDataContent)) !== null) {
  const paths = match[1].split(',').map(p => p.trim().replace(/['"]/g, ''));
  allimages.push(...paths);
}

console.log(`Found ${allimages.length} unique image paths in mock-data.ts`);

let missingCount = 0;
allimages.forEach(img => {
  const fullPath = path.join('public', img.startsWith('/') ? img.substring(1) : img);
  if (!fs.existsSync(fullPath)) {
    console.log(`MISSING: ${img} (Expected at ${fullPath})`);
    missingCount++;
  } else {
    // console.log(`OK: ${img}`);
  }
});

if (missingCount === 0) {
  console.log("All images found on disk! ✅");
} else {
  console.log(`Total missing: ${missingCount} ❌`);
}
