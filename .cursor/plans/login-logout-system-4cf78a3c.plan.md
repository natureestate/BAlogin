<!-- 4cf78a3c-f57a-450a-bcbd-e20fe5df473b e381c38c-de99-4098-9e0b-30ccf2470814 -->
# แผนการพัฒนาระบบ Login/Logout

## 1. โครงสร้าง Monorepo

สร้างโครงสร้างโปรเจกต์แบบ Monorepo:

```
/Users/macbooknow/BAlogin/
├── client/               # Frontend (React + Vite + TypeScript)
├── server/              # Backend (Hono + Cloudflare Workers)
├── shared/              # Shared types และ utilities
└── package.json         # Root package.json สำหรับ workspace
```

## 2. ตั้งค่า Frontend

### 2.1 สร้างโปรเจกต์ Frontend ด้วย TanStack Router template

- ใช้คำสั่ง: `npx create-tsrouter-app@latest client --template file-router --tailwind --add-ons shadcn`
- Template นี้จะติดตั้ง TanStack Router, Tailwind CSS และ shadcn/ui ให้อัตโนมัติ

### 2.2 ติดตั้ง Dependencies เพิ่มเติม

- `@tanstack/react-query` - สำหรับ data fetching และ caching
- `better-auth` - สำหรับ authentication client
- `@better-auth/react` - React hooks สำหรับ Better Auth

### 2.3 เพิ่ม shadcn/ui components

- รัน `npx shadcn@latest add sidebar-05` สำหรับ dashboard sidebar
- เพิ่ม components อื่นๆ: `button`, `input`, `form`, `card`, `avatar`, `dropdown-menu`, `separator`, `label`

### 2.4 สร้างโครงสร้าง Routes

สร้าง file-based routes ใน `client/src/routes/`:

- `__root.tsx` - Root layout
- `index.tsx` - Landing page
- `_auth.tsx` - Auth layout (สำหรับ login/register)
- `_auth/login.tsx` - Login page
- `_auth/register.tsx` - Register page
- `_protected.tsx` - Protected layout (ตรวจสอบ authentication)
- `_protected/dashboard.tsx` - Dashboard page
- `_protected/profile.tsx` - Profile page
- `_protected/settings.tsx` - Settings page

## 3. ตั้งค่า Backend

### 3.1 สร้างโปรเจกต์ Cloudflare Workers

- ในโฟลเดอร์ `server/` สร้างไฟล์ `wrangler.toml`
- ติดตั้ง: `hono`, `better-auth`, `@better-auth/cloudflare`
- ติดตั้ง dev dependencies: `wrangler`, `@cloudflare/workers-types`

### 3.2 ตั้งค่า Cloudflare D1 Database

- สร้าง D1 database schema สำหรับ Better Auth:
  - `user` table: id, email, emailVerified, name, image, createdAt, updatedAt
  - `session` table: id, userId, expiresAt, token, ipAddress, userAgent
  - `account` table: id, userId, provider, providerAccountId, accessToken, refreshToken
  - `verification` table: id, identifier, value, expiresAt

### 3.3 สร้าง Hono API

สร้างไฟล์ `server/src/index.ts`:

- ตั้งค่า Hono app
- ติดตั้ง CORS middleware
- สร้าง Better Auth instance พร้อม providers:
  - Email/Password provider
  - Google OAuth provider
  - GitHub OAuth provider
- Mount Better Auth routes ที่ `/api/auth/*`
- สร้าง protected API routes สำหรับ user data

## 4. Better Auth Configuration

### 4.1 Backend Configuration

ใน `server/src/auth.ts`:

- ตั้งค่า Better Auth พร้อม:
  - Database adapter สำหรับ Cloudflare D1
  - Email/Password plugin
  - Social login plugins (Google, GitHub)
  - Session management
  - CSRF protection

### 4.2 Frontend Configuration

ใน `client/src/lib/auth.ts`:

- สร้าง Better Auth client
- ตั้งค่า base URL ชี้ไปที่ backend API
- Export hooks: `useSession`, `useSignIn`, `useSignUp`, `useSignOut`

## 5. สร้าง UI Components

### 5.1 Auth Components

- `LoginForm.tsx` - ฟอร์มเข้าสู่ระบบพร้อม email/password และปุ่ม social login
- `RegisterForm.tsx` - ฟอร์มลงทะเบียนพร้อมการ validate
- `SocialButtons.tsx` - ปุ่ม Sign in with Google/GitHub

### 5.2 Dashboard Components

- ใช้ `sidebar-05` component จาก shadcn/ui
- สร้าง `DashboardLayout.tsx` ที่รวม sidebar และ main content area
- เพิ่ม navigation items: Dashboard, Profile, Settings, Logout

### 5.3 Profile & Settings Components

- `ProfileCard.tsx` - แสดงข้อมูล user profile
- `EditProfileForm.tsx` - แก้ไข profile
- `SettingsForm.tsx` - จัดการการตั้งค่าบัญชี

## 6. Protected Routes & Navigation Guards

### 6.1 สร้าง Auth Context

ใน `client/src/contexts/AuthContext.tsx`:

- ใช้ TanStack Query เพื่อ fetch session
- Provide session data ให้ทั้ง app

### 6.2 Protected Route Layout

ใน `client/src/routes/_protected.tsx`:

- ใช้ `beforeLoad` hook เพื่อตรวจสอบ authentication
- Redirect ไป `/login` หากไม่ได้ login
- แสดง loading state ระหว่างตรวจสอบ

## 7. State Management & Data Fetching

### 7.1 TanStack Query Setup

- สร้าง `QueryClient` ใน `client/src/main.tsx`
- ตั้งค่า default options (staleTime, cacheTime, retry)

### 7.2 สร้าง Custom Hooks

- `useAuth.ts` - hook สำหรับ authentication state
- `useUser.ts` - hook สำหรับ fetch user data
- `useUpdateProfile.ts` - hook สำหรับ update profile

## 8. Environment Variables & Configuration

### 8.1 Backend Environment

ใน `server/wrangler.toml`:

- `DATABASE` binding สำหรับ D1
- `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` และ `GITHUB_CLIENT_SECRET`
- `BETTER_AUTH_SECRET` สำหรับ session encryption

### 8.2 Frontend Environment

ใน `client/.env`:

- `VITE_API_URL` - URL ของ backend API

## 9. Shared Types

ใน `shared/types/`:

- `user.ts` - User interface
- `session.ts` - Session interface
- `auth.ts` - Auth request/response types

## 10. Development & Build Scripts

### 10.1 Root package.json scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build"
  }
}
```

## Files ที่สำคัญที่สุด

1. **server/src/index.ts** - Hono API entry point พร้อม Better Auth routes
2. **server/src/auth.ts** - Better Auth configuration พร้อม D1 adapter
3. **client/src/routes/_protected.tsx** - Protected route layout พร้อม auth guard
4. **client/src/lib/auth.ts** - Better Auth client และ React hooks
5. **client/src/routes/_auth/login.tsx** - Login page พร้อม social login
6. **client/src/routes/_protected/dashboard.tsx** - Dashboard พร้อม sidebar-05

## การทำงานของระบบ

1. User เข้า `/login` และเลือก login ด้วย email/password หรือ social login
2. Better Auth จัดการ authentication flow และสร้าง session
3. Session ถูกเก็บใน D1 database และส่ง cookie กลับไป client
4. Client redirect ไป `/dashboard` (protected route)
5. Protected layout ตรวจสอบ session ก่อน render
6. Dashboard แสดงพร้อม sidebar navigation
7. User สามารถไป Profile, Settings หรือ Logout ได้
8. Logout จะลบ session และ redirect กลับไป landing page

### To-dos

- [ ] สร้างโครงสร้าง Monorepo และตั้งค่า workspaces
- [ ] สร้าง frontend ด้วย TanStack Router template พร้อม Tailwind และ shadcn/ui
- [ ] เพิ่ม shadcn/ui components (sidebar-05, button, input, form, etc.)
- [ ] สร้าง file-based routes สำหรับทุกหน้า (login, register, dashboard, profile, settings)
- [ ] สร้าง Cloudflare Workers backend ด้วย Hono และตั้งค่า wrangler.toml
- [ ] สร้าง D1 database และ schema สำหรับ Better Auth
- [ ] ตั้งค่า Better Auth ใน backend พร้อม email/password และ social providers
- [ ] ตั้งค่า Better Auth client ใน frontend พร้อม React hooks
- [ ] สร้าง LoginForm, RegisterForm และ SocialButtons components
- [ ] สร้าง Dashboard layout พร้อม sidebar-05 และ navigation
- [ ] สร้าง protected route layout พร้อม authentication guards
- [ ] สร้างหน้า Profile และ Settings พร้อมฟอร์มแก้ไขข้อมูล
- [ ] ตั้งค่า TanStack Query และสร้าง custom hooks สำหรับ data fetching
- [ ] สร้าง shared types สำหรับ user, session และ auth
- [ ] ตั้งค่า environment variables สำหรับทั้ง frontend และ backend
- [ ] สร้าง development scripts ใน root package.json