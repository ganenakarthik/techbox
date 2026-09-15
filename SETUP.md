# TechBox Setup & Development Guide

Follow these simple steps to run and test TechBox locally:

### 1. Prerequisites
- Node.js 18+ (Node v24 recommended)
- npm 10+

### 2. Installation
```powershell
# Navigate to the project folder
cd techbox

# Install dependencies (if not already installed)
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```powershell
cp .env.example .env
```
Default configuration runs with local storage, mock transactional logging, and the interactive Test Mode payment sandbox.

### 4. Running the Development Server
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### 5. Building for Production
```powershell
npm run build
npm run start
```

### 6. Database Operations (PostgreSQL + Prisma)
When connecting to a live PostgreSQL instance (e.g. Supabase, Neon, RDS, or local Postgres):
```powershell
# Push the canonical schema to your database
npx prisma db push

# Seed the database with 50+ components, 8 kits, and campus hubs
npm run db:seed
```

### 7. Demo Accounts & Role Switcher
- **Student / Customer**: `student@campus.edu` (Password: `password123`)
- **Admin / Staff Lead**: `admin@techbox.com` (Password: `password123`)
- Quick role switching is also available via the user menu in the navbar and on the `/account` page.
