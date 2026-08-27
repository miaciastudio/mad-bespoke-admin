import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading root .env first, then apps/api/.env
const rootEnv = path.resolve(__dirname, '../../../../.env');
const workspaceEnv = path.resolve(__dirname, '../../../.env');
const localEnv = path.resolve(__dirname, '../../.env');

if (fs.existsSync(workspaceEnv)) {
  dotenv.config({ path: workspaceEnv });
} else if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else {
  dotenv.config();
}

const url = process.env.TURSO_DATABASE_URL || 'file:./madbespoke.db';
const authToken = process.env.TURSO_AUTH_TOKEN || '';

export const db = createClient({
  url,
  authToken: authToken || undefined,
});

console.log(`[Turso DB] Connected to: ${url.startsWith('file:') ? 'Local SQLite file (' + url + ')' : 'Turso Edge Cloud (' + url.replace(/libsql:\/\//, '').split('.')[0] + ')'}`);
