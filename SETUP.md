# คู่มือการติดตั้งและใช้งาน BAlogin

## ข้อกำหนดเบื้องต้น

- Node.js 18+ และ npm
- บัญชี Cloudflare (สำหรับ production deployment)
- Google OAuth credentials (ถ้าต้องการ Google Login)
- GitHub OAuth App (ถ้าต้องการ GitHub Login)

## การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies ทั้งหมด
npm install

# หรือติดตั้งแยกแต่ละส่วน
cd client && npm install
cd ../server && npm install
cd ../shared && npm install
```

### 2. ตั้งค่า Backend Environment Variables

สร้างไฟล์ `.dev.vars` ใน `server/`:

```bash
cd server
cp .dev.vars.example .dev.vars
```

แก้ไขไฟล์ `.dev.vars`:

```env
# สร้าง secret key ด้วย: openssl rand -base64 32
BETTER_AUTH_SECRET=your-secret-key-here

# Google OAuth (ถ้าต้องการใช้งาน)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (ถ้าต้องการใช้งาน)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# URLs
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:8787
```

### 3. สร้าง Cloudflare D1 Database

#### Development Database

```bash
cd server

# สร้าง development database
npm run db:create:dev

# คัดลอก database_id จากผลลัพธ์และใส่ใน wrangler.toml
# แก้ไข env.dev.d1_databases.database_id:
# database_id = "your-dev-database-id-here"

# รัน migrations สำหรับ development
npm run db:migrate:dev
```

#### Production Database

```bash
cd server

# Login เข้า Cloudflare
npx wrangler login

# สร้าง production database
npm run db:create:prod

# คัดลอก database_id จากผลลัพธ์และใส่ใน wrangler.toml
# แก้ไข env.production.d1_databases.database_id:
# database_id = "your-prod-database-id-here"

# รัน migrations สำหรับ production
npm run db:migrate:prod
```

**หมายเหตุ**: ระบบใช้ database แยกกันระหว่าง development และ production

## การรันโปรเจกต์

### Development Mode

รัน frontend และ backend พร้อมกัน:

```bash
# จาก root directory
npm run dev
```

หรือรันแยกกัน:

```bash
# Terminal 1: รัน frontend
npm run dev:client

# Terminal 2: รัน backend
npm run dev:server
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8787

#### Development User Credentials

ระบบจะสร้าง development user อัตโนมัติเมื่อ server เริ่มทำงาน:

- **Email**: `dev@example.com`
- **Password**: `dev123456`
- **Name**: `Dev User`

คุณสามารถเปลี่ยนค่าเหล่านี้ได้ที่ไฟล์ `.dev.vars`:
```env
DEV_USER_EMAIL=your-email@example.com
DEV_USER_PASSWORD=your-password
DEV_USER_NAME=Your Name
```

**หมายเหตุ**: ใน development mode, ปุ่ม Google/GitHub login จะถูกซ่อน (ใช้เฉพาะ email/password)

### Production Build

```bash
# Build ทั้งหมด
npm run build

# Build แยกส่วน
npm run build:client
npm run build:server
```

### Deploy to Cloudflare

```bash
cd server

# Deploy to production
npm run deploy
```

**สำคัญ**: ก่อน deploy ต้องตั้งค่า environment variables บน Cloudflare Dashboard:
1. ไปที่ Workers & Pages > balogin-api > Settings > Variables
2. เพิ่ม environment variables:
   - `NODE_ENV=production`
   - `BETTER_AUTH_SECRET` (ใช้ค่าที่แข็งแกร่ง)
   - `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID` และ `GITHUB_CLIENT_SECRET`
   - `FRONTEND_URL` (URL ของ frontend production)
   - `BASE_URL` (URL ของ worker)

## การตั้งค่า OAuth Providers

### Google OAuth

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง project ใหม่หรือเลือก project ที่มีอยู่
3. ไปที่ "APIs & Services" > "Credentials"
4. สร้าง "OAuth 2.0 Client ID"
5. เพิ่ม Authorized redirect URIs:
   - Development: `http://localhost:8787/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
6. คัดลอก Client ID และ Client Secret ไปใส่ใน `.dev.vars`

### GitHub OAuth

1. ไปที่ [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. คลิก "New OAuth App"
3. กรอกข้อมูล:
   - Application name: BAlogin
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:8787/api/auth/callback/github`
4. คัดลอก Client ID และสร้าง Client Secret
5. ใส่ใน `.dev.vars`

## โครงสร้างโปรเจกต์

```
BAlogin/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── routes/        # TanStack Router routes
│   │   ├── lib/           # Utilities และ auth client
│   │   └── main.tsx       # Entry point
│   └── package.json
│
├── server/                 # Backend (Hono + Cloudflare Workers)
│   ├── src/
│   │   ├── index.ts       # API entry point
│   │   └── auth.ts        # Better Auth configuration
│   ├── migrations/        # Database migrations
│   └── wrangler.toml      # Cloudflare configuration
│
├── shared/                 # Shared types
│   └── src/types/         # TypeScript types
│
└── package.json           # Root workspace configuration
```

## Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Register page

### Protected Routes (ต้อง login)
- `/dashboard` - Dashboard หลัก
- `/profile` - หน้าแก้ไข profile
- `/settings` - หน้าการตั้งค่า

## API Endpoints

### Authentication
- `POST /api/auth/sign-in/email` - Login ด้วย email/password
- `POST /api/auth/sign-up/email` - Register ด้วย email/password
- `GET /api/auth/sign-in/google` - Login ด้วย Google
- `GET /api/auth/sign-in/github` - Login ด้วย GitHub
- `POST /api/auth/sign-out` - Logout

### User Management
- `GET /api/me` - ดึงข้อมูล user ปัจจุบัน
- `PUT /api/user/profile` - อัปเดต profile

## Troubleshooting

### ปัญหา: Database ไม่ถูกสร้าง

ตรวจสอบว่ารัน migrations แล้ว:
```bash
cd server
# Development
npm run db:migrate:dev

# Production
npm run db:migrate:prod
```

### ปัญหา: Dev user ไม่ถูกสร้างอัตโนมัติ

1. ตรวจสอบว่า `NODE_ENV=development` ใน `.dev.vars`
2. ตรวจสอบว่ามี `DEV_USER_EMAIL` และ `DEV_USER_PASSWORD` ใน `.dev.vars`
3. ลองลบ `.wrangler/state` และรัน server ใหม่
4. ดู console log เมื่อ server start ควรเห็นข้อความ dev credentials

### ปัญหา: OAuth ไม่ทำงาน

1. ตรวจสอบว่า redirect URLs ถูกต้อง
2. ตรวจสอบว่า Client ID และ Secret ถูกต้องใน `.dev.vars`
3. ตรวจสอบว่า BASE_URL และ FRONTEND_URL ถูกต้อง

### ปัญหา: CORS Error

ตรวจสอบว่า FRONTEND_URL ใน `.dev.vars` ตรงกับ URL ของ frontend

## การพัฒนาต่อ

### เพิ่ม Protected Route ใหม่

1. สร้างไฟล์ใน `client/src/routes/_protected/`
2. Export `Route` จาก `createFileRoute`
3. Route จะถูกป้องกันอัตโนมัติ

### เพิ่ม API Endpoint ใหม่

1. แก้ไข `server/src/index.ts`
2. เพิ่ม route ใหม่ใน Hono app
3. ใช้ `createAuth(c.env)` เพื่อเข้าถึง Better Auth

## License

MIT

