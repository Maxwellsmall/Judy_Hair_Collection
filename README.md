# 💇 Judy Hair Collection

A premium e-commerce platform for luxury hair products (wigs, bundles, and hair care).

---

## 🚀 Quick Start (Run Locally)

### One Command to Start Everything:

```bash
npm run dev:all
```

Then open your browser to: **http://localhost:5173**

---

## 📚 Documentation

| Guide | For |
|-------|-----|
| **[SIMPLE_DEPLOYMENT_GUIDE.md](./SIMPLE_DEPLOYMENT_GUIDE.md)** | ⭐ **Start here!** Explains everything in simple terms |
| **[NEXTJS_MIGRATION_PLAN.md](./NEXTJS_MIGRATION_PLAN.md)** | 🎯 **For Vercel deployment** - Single deployment plan |
| [QUICKSTART.md](./QUICKSTART.md) | Deploy to Vercel (online) - Current setup |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Detailed deployment guide |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Quick cheat sheet |

---

## 🎯 Want to Deploy to Vercel as ONE Project?

**Read:** [`NEXTJS_MIGRATION_PLAN.md`](./NEXTJS_MIGRATION_PLAN.md)

This plan shows you how to migrate from React + Express to **Next.js** for single-click deployment on Vercel.

**Why migrate?**
- ✅ Frontend + Backend in ONE deployment
- ✅ No need for separate services (Render, Railway, etc.)
- ✅ Vercel is optimized for Next.js
- ✅ Free tier available

**When you're ready, just say:** "Start the Next.js migration"

---

## 🛠️ What This Project Uses

| Part | Technology |
|------|-----------|
| Frontend | React + TypeScript + Vite |
| Backend | Express + Node.js |
| Database | MongoDB Atlas |
| Images | Cloudinary |
| Styling | Tailwind CSS |

---

## 📦 Available Commands

```bash
# Start everything (frontend + backend)
npm run dev:all

# Start backend only
npm run server:dev

# Start frontend only
npm run dev

# Add sample products to database
npm run seed

# Build for production
npm run build

# Run tests/linting
npm run lint
```

---

## 🔐 Admin Access

**URL:** http://localhost:5173/admin

**Login:**
- Email: `admin@judyhaircollection.com`
- Password: `JudyHair2026!`

---

## 📁 Project Structure

```
Judy_Hair_Collection/
├── src/                    # Frontend code (React)
│   ├── components/         # UI components
│   ├── pages/             # Pages (Home, Admin, etc.)
│   └── lib/               # Utilities & API
├── server/                 # Backend code (Express)
│   ├── routes/            # API endpoints
│   ├── models/            # Database models
│   └── config/            # Database & Cloudinary config
├── SIMPLE_DEPLOYMENT_GUIDE.md  # 📖 Read this first!
└── .env                   # Environment variables
```

---

## 🆘 Need Help?

1. **MongoDB connection error?** → Check [SIMPLE_DEPLOYMENT_GUIDE.md](./SIMPLE_DEPLOYMENT_GUIDE.md#troubleshooting)
2. **Don't understand deployment?** → Read the explanation with analogies
3. **Want to go online?** → Follow [QUICKSTART.md](./QUICKSTART.md)

---

## 💡 Understanding Deployment (Simple Terms)

**Deployment** = Making your website accessible

- **Local deployment** = Only YOU can access (on your PC)
- **Online deployment** = EVERYONE can access (on the internet)

**ngrok** = A tool that creates a "window" so people on the internet can see your local computer

**For local testing, you DON'T need ngrok!** Just run `npm run dev:all`

👉 **Read [SIMPLE_DEPLOYMENT_GUIDE.md](./SIMPLE_DEPLOYMENT_GUIDE.md) for the full explanation**

---

**Built with ❤️ for Judy Hair Collection**
