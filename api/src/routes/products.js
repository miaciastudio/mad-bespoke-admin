import { Router } from 'express';
import { db } from '../db/client.js';
import { nanoid } from 'nanoid';

const router = Router();

// Helper to parse JSON fields
function formatProduct(row) {
  if (!row) return null;
  return {
    ...row,
    is_bestseller: Boolean(row.is_bestseller),
    is_featured: Boolean(row.is_featured),
    is_in_stock: Boolean(row.is_in_stock),
    bulk_available: Boolean(row.bulk_available),
    customisation_options: row.customisation_options ? JSON.parse(row.customisation_options) : [],
    variants: row.variants ? JSON.parse(row.variants) : [],
    add_ons: row.add_ons ? JSON.parse(row.add_ons) : [],
    images: row.images ? JSON.parse(row.images) : [],
  };
}

// GET /api/products (supports category, search, sort, bestsellers)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, bestseller, featured } = req.query;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const args = [];

    if (category && category !== 'all') {
      query += ` AND p.category_id = ?`;
      args.push(category);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      args.push(`%${search}%`, `%${search}%`);
    }

    if (bestseller === 'true' || bestseller === '1') {
      query += ` AND p.is_bestseller = 1`;
    }

    if (featured === 'true' || featured === '1') {
      query += ` AND p.is_featured = 1`;
    }

    if (sort === 'price_asc') {
      query += ` ORDER BY p.price ASC`;
    } else if (sort === 'price_desc') {
      query += ` ORDER BY p.price DESC`;
    } else if (sort === 'name_asc') {
      query += ` ORDER BY p.name ASC`;
    } else {
      query += ` ORDER BY p.is_bestseller DESC, p.is_featured DESC, p.created_at DESC`;
    }

    const result = await db.execute({ sql: query, args });
    const products = result.rows.map(formatProduct);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/:idOrSlug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: `
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      product: formatProduct(result.rows[0]),
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/products (Admin Create)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category_id,
      price,
      mrp,
      description,
      customisation_options = [],
      variants = [],
      packaging = 'Standard Packaging',
      add_ons = [],
      images = [],
      is_bestseller = 0,
      is_featured = 0,
      is_in_stock = 1,
      bulk_available = 1,
    } = req.body;

    if (!name || !category_id || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required.' });
    }

    // Generate slug id
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `${baseSlug}-${nanoid(5)}`;

    await db.execute({
      sql: `
        INSERT INTO products (
          id, name, category_id, price, mrp, description,
          customisation_options, variants, packaging, add_ons,
          images, is_bestseller, is_featured, is_in_stock, bulk_available
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        name,
        category_id,
        Number(price),
        mrp ? Number(mrp) : Number(price) * 1.3,
        description || '',
        JSON.stringify(customisation_options),
        JSON.stringify(variants),
        packaging,
        JSON.stringify(add_ons),
        JSON.stringify(images.length > 0 ? images : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80']),
        is_bestseller ? 1 : 0,
        is_featured ? 1 : 0,
        is_in_stock ? 1 : 0,
        bulk_available ? 1 : 0,
      ],
    });

    const created = await db.execute({ sql: `SELECT * FROM products WHERE id = ?`, args: [id] });
    res.status(201).json({ success: true, product: formatProduct(created.rows[0]) });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/products/:id (Admin Update)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category_id,
      price,
      mrp,
      description,
      customisation_options,
      variants,
      packaging,
      add_ons,
      images,
      is_bestseller,
      is_featured,
      is_in_stock,
      bulk_available,
    } = req.body;

    const existing = await db.execute({ sql: `SELECT * FROM products WHERE id = ?`, args: [id] });
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const current = existing.rows[0];

    await db.execute({
      sql: `
        UPDATE products SET
          name = ?,
          category_id = ?,
          price = ?,
          mrp = ?,
          description = ?,
          customisation_options = ?,
          variants = ?,
          packaging = ?,
          add_ons = ?,
          images = ?,
          is_bestseller = ?,
          is_featured = ?,
          is_in_stock = ?,
          bulk_available = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        name !== undefined ? name : current.name,
        category_id !== undefined ? category_id : current.category_id,
        price !== undefined ? Number(price) : current.price,
        mrp !== undefined ? Number(mrp) : current.mrp,
        description !== undefined ? description : current.description,
        customisation_options !== undefined ? JSON.stringify(customisation_options) : current.customisation_options,
        variants !== undefined ? JSON.stringify(variants) : current.variants,
        packaging !== undefined ? packaging : current.packaging,
        add_ons !== undefined ? JSON.stringify(add_ons) : current.add_ons,
        images !== undefined ? JSON.stringify(images) : current.images,
        is_bestseller !== undefined ? (is_bestseller ? 1 : 0) : current.is_bestseller,
        is_featured !== undefined ? (is_featured ? 1 : 0) : current.is_featured,
        is_in_stock !== undefined ? (is_in_stock ? 1 : 0) : current.is_in_stock,
        bulk_available !== undefined ? (bulk_available ? 1 : 0) : current.bulk_available,
        id,
      ],
    });

    const updated = await db.execute({ sql: `SELECT * FROM products WHERE id = ?`, args: [id] });
    res.json({ success: true, product: formatProduct(updated.rows[0]) });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/products/:id (Admin Delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({ sql: `DELETE FROM products WHERE id = ?`, args: [id] });
    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
