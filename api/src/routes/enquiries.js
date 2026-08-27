import { Router } from 'express';
import { db } from '../db/client.js';
import { nanoid } from 'nanoid';

const router = Router();

// GET /api/enquiries (Admin List)
router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = `SELECT * FROM enquiries WHERE 1=1`;
    const args = [];

    if (status && status !== 'all') {
      query += ` AND status = ?`;
      args.push(status);
    }

    if (type && type !== 'all') {
      query += ` AND type = ?`;
      args.push(type);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await db.execute({ sql: query, args });
    res.json({
      success: true,
      count: result.rows.length,
      enquiries: result.rows,
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/enquiries (Storefront log before WhatsApp redirect)
router.post('/', async (req, res) => {
  try {
    const {
      product_id = null,
      product_name = 'Custom Bespoke Order',
      customer_name = 'Guest Customer',
      phone = '',
      customisation_note = '',
      quantity = 1,
      type = 'retail',
    } = req.body;

    const id = `enq_${nanoid(8)}`;

    await db.execute({
      sql: `
        INSERT INTO enquiries (id, product_id, product_name, customer_name, phone, customisation_note, quantity, type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
      `,
      args: [id, product_id, product_name, customer_name, phone, customisation_note, Number(quantity), type],
    });

    res.status(201).json({
      success: true,
      enquiry_id: id,
      message: 'Enquiry logged successfully',
    });
  } catch (error) {
    console.error('Error logging enquiry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/enquiries/:id/status (Admin update status)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'converted', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await db.execute({
      sql: `UPDATE enquiries SET status = ? WHERE id = ?`,
      args: [status, id],
    });

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
