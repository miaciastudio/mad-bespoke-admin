import { Router } from 'express';
import { db } from '../db/client.js';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.name ASC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      categories: result.rows,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { id, name, icon = '✨', description = '', display_order = 0, image_url = '' } = req.body;
    if (!id || !name) {
      return res.status(400).json({ success: false, message: 'Category ID and Name are required.' });
    }

    await db.execute({
      sql: `INSERT INTO categories (id, name, icon, description, display_order, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, name, icon, description, Number(display_order), image_url],
    });

    res.status(201).json({ success: true, message: 'Category created' });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
