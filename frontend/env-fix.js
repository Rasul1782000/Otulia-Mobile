const fs = require('fs');

// Read the current .env file
const content = fs.readFileSync('.env', 'utf-8');

// Define required environment variables
const envVars = [
  'VITE_BACKEND_URL=http://localhost:5001',
  'VITE_GOOGLE_CLIENT_ID=615268796577-b83im8gi625mq8jvk3ntisfn7bgmqod.apps.googleusercontent.com',
  'VITE_WHATSAPP_NUMBER=',
  'EXPO_PUBLIC_BACKEND_URL=http://localhost:5001'
];

const contentLines = content.split('\n');
let updated = false;

// Check and add missing variables
for (const envVar of envVars) {
  const key = envVar.split('=')[0];
  const exists = contentLines.some(line => line.startsWith(key + '='));
  
  if (!exists) {
    fs.appendFileSync('.env', '\n' + envVar);
    updated = true;
    console.log('Added:', key);
  }
}

if (updated) {
  console.log('Created missing env variables in .env file');
} else {
  console.log('.env file already has all required variables');
}

// Show the current .env content
console.log('\nCurrent .env content:');
console.log(fs.readFileSync('.env', 'utf-8'));
