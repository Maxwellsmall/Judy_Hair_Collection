# 🚀 Judy Hair Collection - Deployment Guide

## Overview
This guide will help you deploy the Judy Hair Collection e-commerce platform.

---

## 📋 Prerequisites

1. **MongoDB Atlas Account** - Database already configured
2. **Cloudinary Account** - Already configured (`df5dhnjbw`)
3. **Vercel Account** - For frontend deployment
4. **Node.js v18+** - For running scripts

---

## 🌐 Option 1: Deploy Frontend to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `Judy_Hair_Collection`
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Add Environment Variables**:
   - `VITE_API_URL` = Your backend URL (see options below)

### Step 3: Configure Backend URL

#### Option A: Local Backend (Development)
Use ngrok to expose your local backend:

```bash
# Install ngrok (if not installed)
npm install -g ngrok

# Start your backend
npm run server:dev

# In another terminal, create tunnel
ngrok http 5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and add to Vercel:
```
VITE_API_URL=https://abc123.ngrok.io/api
```

#### Option B: Deploy Backend to Render/Railway (Production)
1. Deploy backend to [Render](https://render.com) or [Railway](https://railway.app)
2. Get your deployed backend URL
3. Update Vercel environment variable:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🖥️ Option 2: Run Locally (Development)

### Start Both Frontend & Backend
```bash
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🌱 Seed Database (After Deployment)

Once your frontend is deployed and backend is running:

### Option 1: Run Seed Script Locally
```bash
# Make sure backend is running on port 5000
npm run seed
```

### Option 2: Seed via Deployed Backend
If your backend is deployed elsewhere, update `.env` temporarily:

```bash
# The seed script uses the local .env file
# Just ensure MongoDB and Cloudinary credentials are correct
npm run seed
```

### What the Seed Script Does:
1. ✅ Connects to MongoDB Atlas
2. ✅ Uploads 14 placeholder images to Cloudinary
3. ✅ Creates products in 4 categories:
   - Bundles (4 products)
   - Custom Wigs (4 products)
   - Hair Care (4 products)
   - Accessories (2 products)
4. ✅ Sets some products as "featured"

---

## 🔧 Environment Variables

### Frontend (.env.local or Vercel)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://judyhaircollection_db_user:JUDYHAIR01@cluster0.4tpk9hj.mongodb.net/judy_hair_collection?retryWrites=true&w=majority&ssl=true
CLOUDINARY_CLOUD_NAME=df5dhnjbw
CLOUDINARY_API_KEY=289991161794565
CLOUDINARY_API_SECRET=7hwaLMMJL0X5ZifeUSsHkNQg9qU
ADMIN_EMAIL=admin@judyhaircollection.com
ADMIN_PASSWORD=JudyHair2026!
SESSION_SECRET=judy_hair_collection_session_secret_key_change_in_production_2026
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Admin Dashboard

Access: `https://your-domain.com/admin` or `http://localhost:5173/admin`

**Login Credentials:**
- Email: `admin@judyhaircollection.com`
- Password: `JudyHair2026!`

**Admin Features:**
- ✅ Add/Edit/Delete products
- ✅ Upload images to Cloudinary
- ✅ Toggle featured products (star icon)
- ✅ Filter by category
- ✅ Session persists for 7 days

---

## 📊 MongoDB Atlas Setup (If Needed)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to Network Access
3. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
4. Database credentials are already in `.env`

---

## ☁️ Cloudinary Setup (Already Configured)

- **Cloud Name**: `df5dhnjbw`
- **Folder**: `judy_hair/`
- Images are automatically optimized and transformed

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: querySrv ECONNREFUSED
```
**Solution**: Add your IP to MongoDB Atlas whitelist or use `0.0.0.0/0`

### CORS Error
```
Access to fetch at '...' has been blocked by CORS policy
```
**Solution**: Ensure `FRONTEND_URL` in backend .env matches your Vercel domain

### Images Not Loading
**Solution**: Check Cloudinary credentials and ensure images were uploaded via seed script

---

## 📱 Testing Checklist

- [ ] Homepage loads with hero image
- [ ] Categories display (Shop by Category section)
- [ ] Products load in Featured Collection
- [ ] Clicking category filters products
- [ ] Admin login works
- [ ] Can add new product from admin panel
- [ ] Images upload to Cloudinary successfully
- [ ] WhatsApp links work
- [ ] Mobile responsive design works

---

## 🎉 Post-Deployment

After deployment:
1. Run `npm run seed` to populate database
2. Login to admin panel
3. Add your real products
4. Upload actual product images
5. Update featured products as needed

---

## 📞 Support

For issues, check:
- Vercel Functions logs
- Backend console logs
- MongoDB Atlas logs
- Cloudinary dashboard

---

**Built with**: React + TypeScript + Vite + Express + MongoDB + Cloudinary
