#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const NDF_URL = 'https://elixxir-bins.s3.us-west-1.amazonaws.com/ndf/mainnet.json';
const TARGET_PATHS = [
  path.join(__dirname, '..', 'public', 'ndf.json'),
  path.join(__dirname, '..', 'node_modules', 'xxdk-wasm', 'ndf.json')
];

console.log('[XXDK Setup] Downloading mainnet NDF...');

https.get(NDF_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`[XXDK Setup] Failed to download NDF: HTTP ${response.statusCode}`);
    process.exit(1);
  }

  const chunks = [];
  response.on('data', (chunk) => chunks.push(chunk));
  response.on('end', () => {
    const ndfData = Buffer.concat(chunks);
    console.log(`[XXDK Setup] Downloaded ${ndfData.length} bytes`);

    TARGET_PATHS.forEach((targetPath) => {
      try {
        // Ensure directory exists
        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Write the NDF file
        fs.writeFileSync(targetPath, ndfData);
        console.log(`[XXDK Setup] ✓ Saved to ${targetPath}`);
      } catch (err) {
        console.warn(`[XXDK Setup] ⚠ Failed to write ${targetPath}:`, err.message);
      }
    });

    console.log('[XXDK Setup] Complete!');
  });
}).on('error', (err) => {
  console.error('[XXDK Setup] Download error:', err.message);
  console.warn('[XXDK Setup] Continuing without NDF - you may need to download it manually');
  // Don't fail the install, just warn
});
