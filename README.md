# BAlogin

ระบบ Authentication ที่สมบูรณ์แบบด้วย Better Auth + Cloudflare

## 🚀 Features

- ✅ **Email/Password Authentication** - ระบบ login/register แบบดั้งเดิม
- ✅ **Social Login** (Ready) - Google และ GitHub OAuth
- ✅ **Session Management** - Cookie-based sessions ที่ปลอดภัย
- ✅ **Protected Routes** - TanStack Router guards
- ✅ **Development Environment** - Dev credentials และ database แยกกัน
- ✅ **Modern UI** - Shadcn/ui components พร้อม Tailwind CSS
- ✅ **Cloudflare Workers** - Serverless backend บน edge
- ✅ **D1 Database** - SQLite on edge

## 📦 Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TanStack Router** - Type-safe routing
- **Shadcn/ui** - UI components
- **Tailwind CSS** - Styling

### Backend
- **Hono** - Web framework สำหรับ Cloudflare Workers
- **Better Auth** - Authentication framework
- **Cloudflare D1** - SQLite database on edge
- **Cloudflare Workers** - Serverless compute

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn
- Cloudflare account (สำหรับ production)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd BAlogin

# Install dependencies
npm install

# Setup environment variables
cd server
cp .dev.vars.example .dev.vars
# แก้ไข .dev.vars ตามต้องการ
```

### Database Setup

```bash
cd server

# สร้าง development database
npm run db:create:dev

# อัปเดต database_id ใน wrangler.toml
# คัดลอก database_id จาก output ของคำสั่งด้านบน

# รัน migrations
npm run db:migrate:dev
```

### Development

```bash
# จาก root directory
npm run dev

# หรือรันแยกกัน:
# Terminal 1 - Frontend
npm run dev:client

# Terminal 2 - Backend
npm run dev:server
```

เข้าถึง:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8787

## 👤 Development Credentials

ระบบจะแสดง dev credentials ใน console เมื่อ server start:

```
📧 Email: dev@example.com
🔑 Password: dev123456
👤 Name: Dev User
```

คุณสามารถเปลี่ยนได้ที่ `server/.dev.vars`

## 📁 Project Structure

```
BAlogin/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # UI Components (Shadcn/ui)
│   │   ├── routes/        # TanStack Router routes
│   │   │   ├── _auth/     # Public auth routes (login, register)
│   │   │   └── _protected/ # Protected routes (dashboard, profile)
│   │   ├── lib/           # Utilities & auth client
│   │   └── main.tsx       # Entry point
│   └── package.json
│
├── server/                 # Backend (Hono + Workers)
│   ├── src/
│   │   ├── index.ts       # API entry point
│   │   ├── auth.ts        # Better Auth config
│   │   ├── simple-auth.ts # Simple auth implementation
│   │   └── seed.ts        # Dev user seeding
│   ├── migrations/        # Database migrations
│   │   └── schema.sql     # Database schema
│   └── wrangler.toml      # Cloudflare config
│
├── shared/                 # Shared types
│   └── src/types/         # TypeScript interfaces
│
└── package.json           # Root workspace config
```

## 🌍 Environment Variables

### Development (`.dev.vars`)

```env
NODE_ENV=development
BETTER_AUTH_SECRET=your-secret-key
DEV_USER_EMAIL=dev@example.com
DEV_USER_PASSWORD=dev123456
DEV_USER_NAME=Dev User
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:8787
```

### Production (Cloudflare Dashboard)

ตั้งค่าผ่าน Cloudflare Dashboard:
- `NODE_ENV=production`
- `BETTER_AUTH_SECRET` (ใช้ค่าที่แข็งแกร่ง)
- `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` และ `GITHUB_CLIENT_SECRET`
- `FRONTEND_URL` (production URL)
- `BASE_URL` (worker URL)

## 🚢 Deployment

### Production Database

```bash
cd server

# สร้าง production database
npm run db:create:prod

# อัปเดต database_id ใน wrangler.toml [env.production]

# รัน migrations
npm run db:migrate:prod
```

### Deploy

```bash
# Login to Cloudflare
npx wrangler login

# Deploy backend
cd server
npm run deploy

# Build frontend (deploy to your hosting)
cd ../client
npm run build
```

## 📚 Documentation

- [SETUP.md](./SETUP.md) - คู่มือการติดตั้งโดยละเอียด
- [DEV_SETUP_SUMMARY.md](./DEV_SETUP_SUMMARY.md) - สรุป dev environment setup
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/sign-up/email` - สมัครสมาชิก
- `POST /api/auth/sign-in/email` - เข้าสู่ระบบ
- `GET /api/auth/get-session` - ดึงข้อมูล session
- `POST /api/auth/sign-out` - ออกจากระบบ

### Protected
- `GET /api/me` - ดึงข้อมูลผู้ใช้ปัจจุบัน
- `PUT /api/user/profile` - อัปเดต profile

## 🤝 Contributing

Pull requests are welcome! สำหรับการเปลี่ยนแปลงใหญ่ กรุณาเปิด issue ก่อน

## 📄 License

MIT License - ดูไฟล์ [LICENSE](./LICENSE)

## 🙏 Acknowledgments

- [Better Auth](https://www.better-auth.com/) - Authentication framework
- [Cloudflare](https://www.cloudflare.com/) - Edge platform
- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Hono](https://hono.dev/) - Web framework

---

**Made with ❤️ for the developer community**
