# สรุปการตั้งค่า Development Environment

## 🎯 สิ่งที่เพิ่มเข้ามา

### 1. แยกฐานข้อมูล Development และ Production

#### ไฟล์ที่แก้ไข: `server/wrangler.toml`
- เพิ่ม `[env.dev]` configuration สำหรับ development
- เพิ่ม `[env.production]` configuration สำหรับ production
- แต่ละ environment ใช้ database แยกกัน:
  - Development: `balogin-db-dev`
  - Production: `balogin-db`

### 2. อัปเดต NPM Scripts

#### ไฟล์ที่แก้ไข: `server/package.json`
```json
{
  "scripts": {
    "dev": "wrangler dev --env dev",
    "deploy": "wrangler deploy --env production",
    "db:create:dev": "wrangler d1 create balogin-db-dev",
    "db:create:prod": "wrangler d1 create balogin-db",
    "db:migrate:dev": "wrangler d1 execute balogin-db-dev --local --file=./migrations/schema.sql",
    "db:migrate:prod": "wrangler d1 execute balogin-db --remote --file=./migrations/schema.sql",
    "db:seed:dev": "wrangler d1 execute balogin-db-dev --local --file=./migrations/seed-dev.sql"
  }
}
```

### 3. Environment Variables

#### ไฟล์ที่แก้ไข: `server/.dev.vars`
เพิ่ม:
- `NODE_ENV=development`
- `DEV_USER_EMAIL=dev@example.com`
- `DEV_USER_PASSWORD=dev123456`
- `DEV_USER_NAME=Dev User`
- Comment out Google/GitHub OAuth credentials (ไม่จำเป็นใน dev)

#### ไฟล์ใหม่: `server/.dev.vars.example`
Template สำหรับ environment variables พร้อมคำอธิบาย

### 4. Auto-seed Development User

#### ไฟล์ใหม่: `server/src/seed.ts`
ฟังก์ชันสำหรับ:
- `seedDevUser()` - สร้าง dev user อัตโนมัติผ่าน Better Auth API
- `logDevCredentials()` - แสดง dev credentials ใน console

#### ไฟล์ใหม่: `server/migrations/seed-dev.sql`
SQL template สำหรับ manual seeding (backup)

#### ไฟล์ที่แก้ไข: `server/src/index.ts`
- เพิ่ม middleware สำหรับเรียก `seedDevUser()` ครั้งแรกที่ server start
- แสดง dev credentials ใน console

### 5. ปรับปรุง Better Auth Configuration

#### ไฟล์ที่แก้ไข: `server/src/auth.ts`
- ตรวจสอบ `NODE_ENV` เพื่อแยก config dev/prod
- ใน development mode:
  - Social providers จะถูกปิดถ้าไม่มี credentials
  - Email/Password login เท่านั้นที่ใช้ได้
- อัปเดต `Env` interface:
  - เพิ่ม `NODE_ENV`, `DEV_USER_*` fields
  - Social provider credentials เป็น optional

### 6. อัปเดต Login UI

#### ไฟล์ที่แก้ไข: `client/src/routes/_auth/login.tsx`
- เพิ่มตรวจสอบ `import.meta.env.MODE`
- ใน development mode:
  - แสดง banner พร้อม dev credentials
  - ซ่อนปุ่ม Google/GitHub login
- ใน production mode:
  - แสดงปุ่ม social login ตามปกติ

### 7. อัปเดต Documentation

#### ไฟล์ที่แก้ไข: `SETUP.md`
- เพิ่มคำแนะนำการสร้าง database แยก dev/prod
- เพิ่มส่วนอธิบาย dev user credentials
- เพิ่ม troubleshooting สำหรับ dev setup

## 🚀 วิธีเริ่มใช้งาน

### ขั้นตอนที่ 1: สร้าง Development Database

```bash
cd server

# สร้าง dev database
npm run db:create:dev

# คัดลอก database_id ที่ได้และใส่ใน wrangler.toml
# ไฟล์ wrangler.toml > [env.dev] > [[env.dev.d1_databases]]
# database_id = "paste-your-id-here"

# รัน migrations
npm run db:migrate:dev
```

### ขั้นตอนที่ 2: ตรวจสอบ Environment Variables

ตรวจสอบไฟล์ `server/.dev.vars` มีค่าต่อไปนี้:

```env
NODE_ENV=development
BETTER_AUTH_SECRET=development-secret-key-please-change-in-production
DEV_USER_EMAIL=dev@example.com
DEV_USER_PASSWORD=dev123456
DEV_USER_NAME=Dev User
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:8787
```

### ขั้นตอนที่ 3: รัน Development Server

```bash
# จาก root directory
npm run dev

# หรือรันแยกกัน
npm run dev:client  # Terminal 1
npm run dev:server  # Terminal 2
```

### ขั้นตอนที่ 4: ทดสอบ Login

1. เปิดเบราว์เซอร์ไปที่ http://localhost:5173
2. คลิก "เข้าสู่ระบบ"
3. จะเห็น banner สีฟ้าแสดง dev credentials
4. ใส่:
   - Email: `dev@example.com`
   - Password: `dev123456`
5. Login ควรสำเร็จและ redirect ไป dashboard

## 📝 สิ่งที่ควรทราบ

### Development Mode Features

1. **Auto-seed User**: Dev user จะถูกสร้างอัตโนมัติครั้งแรกที่ server start
2. **No Social Login**: ปุ่ม Google/GitHub จะถูกซ่อนใน dev mode
3. **Dev Credentials Banner**: หน้า login จะแสดงข้อมูล dev user
4. **Separate Database**: ใช้ database แยกจาก production
5. **Console Logs**: Server จะแสดง dev credentials ใน console เมื่อ start

### Production Mode Features

1. **No Auto-seed**: ไม่มีการสร้าง user อัตโนมัติ
2. **Social Login Enabled**: แสดงปุ่ม Google/GitHub login
3. **No Dev Banner**: ไม่แสดง dev credentials
4. **Production Database**: ใช้ database production
5. **Secure Environment**: ต้องตั้งค่า environment variables บน Cloudflare

## 🔧 การปรับแต่ง Dev Credentials

แก้ไขไฟล์ `server/.dev.vars`:

```env
DEV_USER_EMAIL=myemail@example.com
DEV_USER_PASSWORD=mypassword123
DEV_USER_NAME=My Name
```

จากนั้นลบ `.wrangler/state` และรัน server ใหม่:

```bash
cd server
rm -rf .wrangler/state
npm run dev
```

## 🐛 Troubleshooting

### ปัญหา: Dev user ไม่ถูกสร้าง

**แก้ไข**:
1. ตรวจสอบ `NODE_ENV=development` ใน `.dev.vars`
2. ตรวจสอบ console logs เมื่อ server start
3. ลบ `.wrangler/state` และรัน server ใหม่
4. ตรวจสอบว่ารัน `npm run db:migrate:dev` แล้ว

### ปัญหา: Social login ยังแสดงใน dev mode

**แก้ไข**:
1. ตรวจสอบว่า frontend running ใน development mode
2. เช็ค `import.meta.env.MODE` ใน browser console
3. ถ้ารัน `npm run build` ให้รัน `npm run dev` แทน

### ปัญหา: Database not found

**แก้ไข**:
1. สร้าง dev database: `npm run db:create:dev`
2. คัดลอก database_id ใส่ใน `wrangler.toml`
3. รัน migrations: `npm run db:migrate:dev`

## 📦 ไฟล์ที่ถูกสร้าง/แก้ไข

### ไฟล์ใหม่
- `server/src/seed.ts` - Auto-seed functions
- `server/migrations/seed-dev.sql` - SQL seed template
- `server/.dev.vars.example` - Environment variables template
- `DEV_SETUP_SUMMARY.md` - เอกสารนี้

### ไฟล์ที่แก้ไข
- `server/wrangler.toml` - เพิ่ม dev/prod environments
- `server/package.json` - เพิ่ม scripts ใหม่
- `server/.dev.vars` - เพิ่ม dev credentials
- `server/src/auth.ts` - ปรับปรุง auth config
- `server/src/index.ts` - เพิ่ม auto-seed middleware
- `client/src/routes/_auth/login.tsx` - เพิ่ม dev mode UI
- `SETUP.md` - อัปเดต documentation

## ✅ Next Steps

1. **ทดสอบระบบ**: Login ด้วย dev credentials
2. **ปรับแต่ง Credentials**: เปลี่ยน dev user ตามต้องการ
3. **Setup Production**: สร้าง production database และตั้งค่า env vars
4. **Deploy**: Deploy to Cloudflare Workers

---

**Happy Coding! 🎉**

