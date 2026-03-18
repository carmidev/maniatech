const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('src/app/mock-data.ts', 'utf8');

// Regex to find images arrays
const imagesRegex = /images:\s*\[([\s\S]*?)\]/g;

const newContent = content.replace(imagesRegex, (match, p1) => {
  const paths = p1.split(',').map(p => p.trim().replace(/['"]/g, ''));
  const existingPaths = paths.filter(img => {
    if (!img) return false;
    const fullPath = path.join('public', img.startsWith('/') ? img.substring(1) : img);
    return fs.existsSync(fullPath);
  });
  
  if (existingPaths.length === 0) {
    // If none exist, try to find the fallback .png or .jpg
    return `images: ["/images/catalog/pulparindo.png"]`; // absolute fallback
  }
  
  return `images: [${existingPaths.map(p => `"${p}"`).join(', ')}]`;
});

fs.writeFileSync('src/app/mock-data.ts', newContent);
console.log("Cleaned up mock-data.ts images to only include existing files.");
