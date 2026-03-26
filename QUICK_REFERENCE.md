# 🎯 Judy Hair Collection - Quick Reference Card

## ⚡ One Command to Start

```bash
npm run dev:all
```

**Then visit:** http://localhost:5173

---

## 📖 Key Files to Read

| File | Read When... |
|------|-------------|
| **SIMPLE_DEPLOYMENT_GUIDE.md** | ⭐ You want to understand deployment in simple terms |
| **README.md** | You need quick project overview |
| **QUICKSTART.md** | You want to deploy online (Vercel) |

---

## 🔑 Important URLs

| Page | URL |
|------|-----|
| Homepage | http://localhost:5173 |
| Admin Panel | http://localhost:5173/admin |
| API (Backend) | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## 🔐 Admin Login

```
Email: admin@judyhaircollection.com
Password: JudyHair2026!
```

---

## 📦 Common Commands

| Command | What It Does |
|---------|-------------|
| `npm run dev:all` | Start frontend + backend together |
| `npm run seed` | Add 14 sample products to database |
| `npm run build` | Build for production |
| `Ctrl + C` | Stop the server |

---

## 🗂️ What Each Part Does

```
┌─────────────────────────────────────────────┐
│  Frontend (React/Vite)                      │
│  - What customers see                       │
│  - Runs on port 5173                        │
│  - Command: npm run dev                     │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│  Backend (Express/Node.js)                  │
│  - Processes requests                       │
│  - Runs on port 5000                        │
│  - Command: npm run server:dev              │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│  MongoDB Atlas (Online Database)            │
│  - Stores products, categories              │
│  - Already configured                       │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│  Cloudinary (Online Image Storage)          │
│  - Stores product images                    │
│  - Already configured                       │
└─────────────────────────────────────────────┘
```

---

## ❓ What is...?

| Term | Simple Explanation |
|------|-------------------|
| **Deployment** | Making your website accessible |
| **Local** | Only on YOUR computer |
| **Online/Production** | On the internet for everyone |
| **localhost** | Your own computer (address: 127.0.0.1) |
| **ngrok** | Tool to let internet see your local PC |
| **Port** | A "door" for communication (5173, 5000) |
| **Database** | Storage for your products |
| **API** | How frontend talks to backend |

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to MongoDB | Add `0.0.0.0/0` in MongoDB Atlas Network Access |
| Port already in use | Run `taskkill /F /IM node.exe` then try again |
| Images not loading | Check internet connection (Cloudinary needs it) |
| Blank page | Open browser console (F12) to see errors |

---

## ✅ Daily Workflow

```bash
# 1. Navigate to project
cd C:\Users\PASCHAL\Documents\GitHub\Judy_Hair_Collection

# 2. Start everything
npm run dev:all

# 3. Open browser
# Go to: http://localhost:5173

# 4. Work on website

# 5. When done, press Ctrl + C to stop
```

---

## 🌐 Local vs Online Deployment

| | Local | Online |
|---|-------|--------|
| **Where** | Your PC | Internet |
| **Who can access** | Only you | Everyone |
| **Frontend** | localhost:5173 | your-domain.vercel.app |
| **Backend** | localhost:5000 | your-api.onrender.com |
| **Need ngrok?** | ❌ No | ✅ Yes (if backend is local) |
| **Cost** | Free | Free tier available |

---

## 📞 Environment Variables

All configured in `.env`:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=... (already set)
CLOUDINARY_... (already set)
ADMIN_EMAIL=admin@judyhaircollection.com
ADMIN_PASSWORD=JudyHair2026!
```

**Don't change these unless you know what you're doing!**

---

## 🎓 Learning Path

1. ✅ Run `npm run dev:all` and explore the website
2. ✅ Read **SIMPLE_DEPLOYMENT_GUIDE.md** to understand concepts
3. ✅ Login to admin and add a test product
4. ✅ Experiment with features
5. ✅ When ready, read **QUICKSTART.md** for online deployment

---

**Remember:** Start with `npm run dev:all` and visit http://localhost:5173

Everything else is just details! 🚀
