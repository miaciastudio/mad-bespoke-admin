import { Router } from 'express';
import { db } from '../db/client.js';

const router = Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM settings');
    const settings = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/settings (Admin Update)
router.post('/', async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await db.execute({
        sql: `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
        args: [key, String(value)],
      });
    }

    const result = await db.execute('SELECT * FROM settings');
    const settings = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }

    res.json({ success: true, settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
