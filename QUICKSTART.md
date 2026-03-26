# 🚀 Quick Start Guide - Judy Hair Collection

## Deploy to Vercel with Local Backend

### Step 1: Deploy Frontend to Vercel

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your `Judy_Hair_Collection` repository
   - Click **Deploy**

3. **Configure Environment Variable** (in Vercel dashboard):
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `http://localhost:5000/api`
   - Redeploy

### Step 2: Run Local Backend

```bash
# Install dependencies (if not done)
npm install

# Start backend server
npm run server:dev
```

Your backend will run on: **http://localhost:5000**

### Step 3: Expose Local Backend to Internet

Use **ngrok** to make your local backend accessible:

```bash
# Install ngrok globally (one time)
npm install -g ngrok

# Run ngrok to expose port 5000
ngrok http 5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.app`)

### Step 4: Update Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to: `https://abc123.ngrok.app/api`
3. Click **Save**
4. Redeploy (go to Deployments → Click latest → Redeploy)

### Step 5: Seed the Database

With your backend running locally:

```bash
npm run seed
```

This will:
- ✅ Upload 14 product images to Cloudinary
- ✅ Create products in MongoDB
- ✅ Set up categories automatically

### Step 6: Access Your Store

- **Frontend**: Your Vercel URL (e.g., `https://judy-hair-collection.vercel.app`)
- **Admin Panel**: `https://your-vercel-url.vercel.app/admin`
- **Admin Login**:
  - Email: `admin@judyhaircollection.com`
  - Password: `JudyHair2026!`

---

## Alternative: Run Everything Locally

For testing on your PC only:

```bash
# Start both frontend and backend
npm run dev:all
```

Access at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin: http://localhost:5173/admin

---

## API Endpoints

### Seed Database (Remote)
```bash
# Trigger seed via API (useful when backend is deployed)
curl -X POST http://localhost:5000/api/seed

# Check seed status
curl http://localhost:5000/api/seed/status
```

### Products
```bash
# Get all products
curl http://localhost:5000/api/products

# Get featured products
curl http://localhost:5000/api/products/featured

# Get categories
curl http://localhost:5000/api/products/categories
```

---

## Troubleshooting

### MongoDB Connection Error
```
Error: ECONNREFUSED
```
**Fix**: 
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Network Access → Add IP Address
3. Select "Allow Access from Anywhere" (`0.0.0.0/0`)
4. Click Confirm

### CORS Error
**Fix**: Ensure `FRONTEND_URL` in `.env` matches your Vercel domain

### ngrok URL Changes
ngrok free tier gives a new URL each time. For a permanent URL:
- Use [ngrok paid plan](https://ngrok.com/pricing)
- Or deploy backend to [Render](https://render.com) (free tier available)

---

## Next Steps

1. ✅ Run `npm run seed` to populate database
2. ✅ Login to admin panel
3. ✅ Add your real products
4. ✅ Upload actual product images
5. ✅ Update WhatsApp phone number in code
6. ✅ Customize branding/colors as needed

---

**Need Help?** Check `DEPLOYMENT.md` for detailed instructions.
