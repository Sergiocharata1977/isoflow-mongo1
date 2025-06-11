// loadEnv.js
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`[ERROR] Failed to load .env file from ${envPath}:`, result.error);
  // Consider exiting the process if .env is critical and not found/parsable
  // process.exit(1);
} else if (!result.parsed || Object.keys(result.parsed).length === 0) {
  console.warn(`[WARN] .env file loaded from ${envPath}, but no variables were parsed or it was empty.`);
} else {
  // console.log('[INFO] .env file loaded successfully.'); // Optional: for very minimal logging
}

