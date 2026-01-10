#!/usr/bin/env node

/**
 * Generate Firebase Service Worker with Environment Variables
 *
 * This script reads the firebase-messaging-sw.template.js and replaces
 * placeholders with actual values from .env file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found at:', envPath);
    console.error('   Please create a .env file with Firebase configuration');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) {
      return;
    }

    // Parse KEY=VALUE
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      envVars[key] = value;
    }
  });

  return envVars;
}

// Generate service worker file
function generateServiceWorker() {
  console.log('\n🔥 Generating Firebase Service Worker for Admin App...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Load environment variables
  const envVars = loadEnvFile();

  // Read template
  const templatePath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.template.js');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Template file not found at:', templatePath);
    process.exit(1);
  }

  let template = fs.readFileSync(templatePath, 'utf-8');

  // Replace placeholders
  const replacements = {
    '__FIREBASE_API_KEY__': envVars.VITE_FIREBASE_API_KEY || '',
    '__FIREBASE_AUTH_DOMAIN__': envVars.VITE_FIREBASE_AUTH_DOMAIN || '',
    '__FIREBASE_PROJECT_ID__': envVars.VITE_FIREBASE_PROJECT_ID || '',
    '__FIREBASE_STORAGE_BUCKET__': envVars.VITE_FIREBASE_STORAGE_BUCKET || '',
    '__FIREBASE_MESSAGING_SENDER_ID__': envVars.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    '__FIREBASE_APP_ID__': envVars.VITE_FIREBASE_APP_ID || '',
    '__FIREBASE_MEASUREMENT_ID__': envVars.VITE_FIREBASE_MEASUREMENT_ID || '',
  };

  console.log('\n📋 Configuration:');
  Object.entries(replacements).forEach(([key, value]) => {
    const displayValue = value ? (value.length > 30 ? value.substring(0, 30) + '...' : value) : '❌ Missing';
    console.log(`   ${key.replace(/__/g, '')}: ${displayValue}`);
    template = template.replace(new RegExp(key, 'g'), value);
  });

  // Write generated service worker
  const outputPath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js');
  fs.writeFileSync(outputPath, template, 'utf-8');

  console.log('\n✅ Service worker generated successfully!');
  console.log(`   Output: ${outputPath}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the generator
try {
  generateServiceWorker();
} catch (error) {
  console.error('\n❌ Failed to generate service worker:', error.message);
  process.exit(1);
}
