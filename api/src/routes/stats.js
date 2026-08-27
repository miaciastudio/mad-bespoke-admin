import { Router } from 'express';
import { db } from '../db/client.js';

const router = Router();

// GET /api/stats (Admin Dashboard Analytics)
router.get('/', async (req, res) => {
  try {
    const productsCount = await db.execute('SELECT COUNT(*) as count FROM products');
    const bestsellersCount = await db.execute('SELECT COUNT(*) as count FROM products WHERE is_bestseller = 1');
    const categoriesCount = await db.execute('SELECT COUNT(*) as count FROM categories');
    const enquiriesTotal = await db.execute('SELECT COUNT(*) as count FROM enquiries');
    const enquiriesNew = await db.execute("SELECT COUNT(*) as count FROM enquiries WHERE status = 'new'");
    const enquiriesConverted = await db.execute("SELECT COUNT(*) as count FROM enquiries WHERE status = 'converted'");

    const recentEnquiries = await db.execute('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5');

    res.json({
      success: true,
      stats: {
        totalProducts: productsCount.rows[0].count,
        bestsellers: bestsellersCount.rows[0].count,
        totalCategories: categoriesCount.rows[0].count,
        totalEnquiries: enquiriesTotal.rows[0].count,
        newEnquiries: enquiriesNew.rows[0].count,
        convertedEnquiries: enquiriesConverted.rows[0].count,
      },
      recentEnquiries: recentEnquiries.rows,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
