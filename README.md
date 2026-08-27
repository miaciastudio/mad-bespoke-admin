# 👑 Mad Bespoke — Admin Suite & Cloudflare R2 / Turso API

Complete product catalog manager, Cloudflare R2 media uploader, category manager, and WhatsApp leads tracker for Mad Bespoke.

## 🚀 Features
- **Dashboard & KPIs:** Total catalog items, best-sellers, categories, and real-time WhatsApp order leads.
- **Product CRUD:** Full title, description, price, MRP, variants, and customisation tag builder.
- **Cloudflare R2 Media Upload:** Direct image uploads to Cloudflare R2 S3 storage with presigned URLs & streaming proxy.
- **Turso LibSQL:** Edge database connection with local fallback.
- **WhatsApp Leads Log:** Real-time customer enquiry tracking.
- **Store Settings:** Live WhatsApp routing number and brand banner configuration.

## 🛠️ Deployment
- **Admin Frontend:** Cloudflare Pages (`npm run build` -> `dist`)
- **API Backend:** Cloudflare Workers / Node Server (`PORT=5000`)
