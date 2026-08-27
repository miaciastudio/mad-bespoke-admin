import { db } from './client.js';

export async function initSchema() {
  console.log('[Turso DB] Initializing schema...');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT NOT NULL,
      price NUMERIC NOT NULL,
      mrp NUMERIC,
      description TEXT,
      customisation_options TEXT, -- JSON array string
      variants TEXT,              -- JSON array string
      packaging TEXT,
      add_ons TEXT,               -- JSON array string
      images TEXT,                -- JSON array string
      is_bestseller INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_in_stock INTEGER DEFAULT 1,
      bulk_available INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      product_name TEXT,
      customer_name TEXT,
      phone TEXT,
      customisation_note TEXT,
      quantity INTEGER DEFAULT 1,
      type TEXT DEFAULT 'retail', -- 'retail' | 'bulk_corporate'
      status TEXT DEFAULT 'new',  -- 'new' | 'contacted' | 'converted'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('[Turso DB] Schema initialized successfully.');
}
