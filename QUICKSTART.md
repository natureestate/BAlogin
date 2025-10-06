# 🚀 Quick Start Guide

เริ่มต้นใช้งาน BAlogin ภายใน 5 นาที!

## 1. ติดตั้ง Dependencies

```bash
npm install
```

## 2. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8787

## 3. ทดสอบระบบ

### สมัครสมาชิก
1. ไปที่ http://localhost:5173
2. คลิก "สมัครสมาชิก"
3. กรอกข้อมูล:
   - ชื่อ: Test User
   - อีเมล: test@example.com
   - รหัสผ่าน: password123
4. คลิก "สมัครสมาชิก"

### เข้าสู่ระบบ
1. คุณจะถูก redirect ไปที่ Dashboard อัตโนมัติ
2. ทดลองใช้งาน:
   - ดู Dashboard
   - แก้ไข Profile
   - เปลี่ยนการตั้งค่า
   - Logout

## 4. ตั้งค่า Database (Optional สำหรับ Production)

### สร้าง Local Database
```bash
cd server
npx wrangler d1 create balogin-db --local
npm run db:migrate
```

### สร้าง Production Database
```bash
cd server
npx wrangler login
npx wrangler d1 create balogin-db
# คัดลอก database_id และใส่ใน wrangler.toml
npm run db:migrate:prod
```

## 5. ตั้งค่า Social Login (Optional)

### Google Login
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง OAuth credentials
3. เพิ่ม redirect URI: `http://localhost:8787/api/auth/callback/google`
4. แก้ไข `server/.dev.vars`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### GitHub Login
1. ไปที่ [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. สร้าง OAuth App
3. เพิ่ม callback URL: `http://localhost:8787/api/auth/callback/github`
4. แก้ไข `server/.dev.vars`:
   ```env
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```

## 🎯 เสร็จแล้ว!

ระบบพร้อมใช้งานแล้ว! ดูเอกสารเพิ่มเติมที่:
- [SETUP.md](./SETUP.md) - คู่มือการติดตั้งแบบละเอียด
- [SUMMARY.md](./SUMMARY.md) - สรุประบบทั้งหมด
- [README.md](./README.md) - ข้อมูลโปรเจกต์

## ⚠️ หมายเหตุสำคัญ

- **Better Auth Secret**: ในการใช้งานจริง ต้องสร้าง secret ใหม่ด้วย `openssl rand -base64 32`
- **Database**: ตอนนี้ใช้ in-memory database สำหรับ development ข้อมูลจะหายเมื่อ restart server
- **Social Login**: ต้องตั้งค่า OAuth credentials ก่อนใช้งาน

