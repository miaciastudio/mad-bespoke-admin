import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const url = process.env.TURSO_DATABASE_URL || 'file:./madbespoke.db';
const authToken = process.env.TURSO_AUTH_TOKEN || '';

export const db = createClient({
  url,
  authToken: authToken || undefined,
});

console.log(`[Turso DB] Connected to: ${url.startsWith('file:') ? 'Local SQLite file (' + url + ')' : 'Turso Edge Cloud'}`);
