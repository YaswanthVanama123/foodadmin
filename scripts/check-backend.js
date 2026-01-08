#!/usr/bin/env node

const http = require('http');
const https = require('https');

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function checkBackend(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const healthCheckUrl = `${url}/api/health`;

    console.log(`${colors.blue}Checking backend at: ${healthCheckUrl}${colors.reset}`);

    protocol.get(healthCheckUrl, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ status: 'online', data: data });
        } else {
          reject(new Error(`Backend returned status ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('\n========================================');
  console.log('   Backend Connection Check');
  console.log('========================================\n');

  try {
    const result = await checkBackend(API_URL);
    console.log(`${colors.green}✓ Backend is online${colors.reset}`);
    console.log(`${colors.green}✓ API URL: ${API_URL}${colors.reset}`);

    try {
      const response = JSON.parse(result.data);
      if (response.database) {
        console.log(`${colors.green}✓ Database: ${response.database}${colors.reset}`);
      }
    } catch (e) {
      // Ignore JSON parse errors
    }

    console.log(`\n${colors.green}Backend is ready!${colors.reset}\n`);
    process.exit(0);
  } catch (error) {
    console.log(`${colors.red}✗ Backend is offline${colors.reset}`);
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    console.log(`\n${colors.yellow}Please make sure:${colors.reset}`);
    console.log(`1. Backend server is running (cd ../backend && npm run dev)`);
    console.log(`2. MongoDB is running`);
    console.log(`3. Backend is configured at ${API_URL}`);
    console.log('');
    process.exit(1);
  }
}

main();
