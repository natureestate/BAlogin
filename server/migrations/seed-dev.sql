-- Development User Seed Script
-- สคริปต์นี้สำหรับสร้าง development user ผ่าน SQL (ใช้เป็น backup)
-- โดยปกติจะใช้ seed function ใน TypeScript แทน

-- หมายเหตุ: Better Auth จัดการ password hashing ให้เอง
-- ไฟล์นี้เป็นเพียง template สำหรับอ้างอิง
-- การ seed จริงจะทำผ่าน server/src/seed.ts

-- ตัวอย่างการตรวจสอบว่ามี dev user อยู่แล้วหรือไม่
-- SELECT COUNT(*) FROM user WHERE email = 'dev@example.com';

