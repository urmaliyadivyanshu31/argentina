# 🚀 Deploy LoopDrop to Vercel

Complete guide to deploy your LoopDrop Distributor to Vercel.

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Code pushed to GitHub
3. **Deployed Smart Contract**: Contract address from deployment

---

## 🎯 Deployment Strategy

We'll deploy as **2 separate Vercel projects**:

1. **Frontend** (loopdrop-frontend) - Next.js app
2. **Backend** (loopdrop-backend) - Node.js API

This is the recommended approach for full-stack apps on Vercel.

---

## 🚀 OPTION 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy Backend First

```bash
cd backend
vercel

# Follow prompts:
# ? Set up and deploy? Yes
# ? Which scope? [Your account]
# ? Link to existing project? No
# ? What's your project's name? loopdrop-backend
# ? In which directory is your code located? ./
# ? Want to modify settings? Yes
# ? Output Directory: src
# ? Build Command: (leave empty)
# ? Development Command: npm run dev
```

**After deployment, copy the backend URL** (e.g., `https://loopdrop-backend.vercel.app`)

### Step 4: Add Backend Environment Variables

```bash
# Still in backend directory
vercel env add HYPEREVM_RPC_URL
# Paste: https://rpc.hyperliquid-testnet.xyz/evm

vercel env add CHAIN_ID
# Paste: 998

vercel env add PRIVATE_KEY
# Paste: 0xcbf404944a1fe81817aacbaad18cd04063daf50018b3577809c1332499eea0ae

vercel env add SAFE_ADDRESS
# Paste: 0x0000000000000000000000000000000000000001

vercel env add DISTRIBUTOR_CONTRACT_ADDRESS
# Paste: [Your deployed contract address]

vercel env add PORT
# Paste: 3001
```

### Step 5: Redeploy Backend with Env Variables

```bash
vercel --prod
```

### Step 6: Deploy Frontend

```bash
cd ../frontend
vercel

# Follow prompts:
# ? Set up and deploy? Yes
# ? Which scope? [Your account]
# ? Link to existing project? No
# ? What's your project's name? loopdrop-frontend
# ? In which directory is your code located? ./
# ? Want to modify settings? Yes
# ? Build Command: npm run build
# ? Output Directory: .next
# ? Development Command: npm run dev
```

### Step 7: Add Frontend Environment Variables

```bash
# Still in frontend directory
vercel env add NEXT_PUBLIC_API_URL
# Paste: https://loopdrop-backend.vercel.app
```

### Step 8: Redeploy Frontend with Env Variables

```bash
vercel --prod
```

---

## 🌐 OPTION 2: Deploy via Vercel Dashboard (Easier)

### Backend Deployment

1. **Go to**: https://vercel.com/new
2. **Import Git Repository**: Select your GitHub repo
3. **Configure Project**:
   - Framework Preset: `Other`
   - Root Directory: `backend`
   - Build Command: (leave empty)
   - Output Directory: `src`
   - Install Command: `npm install`

4. **Environment Variables** (click "Environment Variables"):
   ```
   HYPEREVM_RPC_URL=https://rpc.hyperliquid-testnet.xyz/evm
   CHAIN_ID=998
   PRIVATE_KEY=0xcbf404944a1fe81817aacbaad18cd04063daf50018b3577809c1332499eea0ae
   SAFE_ADDRESS=0x0000000000000000000000000000000000000001
   DISTRIBUTOR_CONTRACT_ADDRESS=[Your contract address]
   PORT=3001
   ```

5. **Click "Deploy"**

6. **Copy Backend URL**: e.g., `https://loopdrop-backend.vercel.app`

### Frontend Deployment

1. **Go to**: https://vercel.com/new (again)
2. **Import Git Repository**: Same repo
3. **Configure Project**:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://loopdrop-backend.vercel.app
   ```

5. **Click "Deploy"**

---

## 🔧 Post-Deployment Configuration

### Update CORS in Backend

Edit `backend/src/index.js` and update CORS origins:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://loopdrop-frontend.vercel.app', // Add your Vercel URL
    'https://loopdrop-frontend-*.vercel.app' // Preview deployments
  ],
  credentials: true
}));
```

Then redeploy backend:
```bash
cd backend
vercel --prod
```

---

## 🗄️ Database Considerations

Vercel is **serverless** - SQLite won't persist. Choose one:

### Option A: Keep SQLite (Simple, Testing Only)

SQLite will reset on each deployment. Good for demos/testing.

### Option B: Use PostgreSQL (Production)

**Recommended for production**. Use Vercel Postgres:

1. Go to project → Storage → Create Database → Postgres
2. Update backend to use PostgreSQL instead of SQLite
3. Update connection string in env variables

### Option C: Use Supabase (Free Alternative)

1. Create account at https://supabase.com
2. Create new project
3. Get connection string
4. Update backend database configuration

---

## ✅ Verify Deployment

### Check Backend
```bash
curl https://loopdrop-backend.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "LoopDrop Distribution API"
}
```

### Check Frontend
Visit: `https://loopdrop-frontend.vercel.app`

Should see the brutalist UI with:
- ✅ Create Distribution form
- ✅ Distributions table
- ✅ Analytics panel
- ✅ Safe panel

---

## 🔐 Environment Variables Summary

### Backend (Vercel Project Settings)
```
HYPEREVM_RPC_URL=https://rpc.hyperliquid-testnet.xyz/evm
CHAIN_ID=998
PRIVATE_KEY=0xcbf404944a1fe81817aacbaad18cd04063daf50018b3577809c1332499eea0ae
WALLET_ADDRESS=0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c
SAFE_ADDRESS=0x0000000000000000000000000000000000000001
DISTRIBUTOR_CONTRACT_ADDRESS=[After deployment]
PORT=3001
NODE_ENV=production
```

### Frontend (Vercel Project Settings)
```
NEXT_PUBLIC_API_URL=https://loopdrop-backend.vercel.app
```

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Frontend

1. Go to Project Settings → Domains
2. Add your domain (e.g., `loopdrop.yourdomain.com`)
3. Configure DNS:
   - Type: `CNAME`
   - Name: `loopdrop`
   - Value: `cname.vercel-dns.com`

4. Update backend CORS to include your domain

---

## 🐛 Troubleshooting

### Build Fails on Frontend

**Error**: `Module not found`

**Fix**: Ensure all dependencies in `package.json`:
```bash
cd frontend
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### API Returns 404

**Issue**: Backend URL incorrect in frontend env

**Fix**:
1. Check backend Vercel URL
2. Update `NEXT_PUBLIC_API_URL` in frontend settings
3. Redeploy frontend

### Database Resets on Each Deploy

**Expected behavior** with SQLite on Vercel.

**Fix**: Migrate to PostgreSQL or Supabase (see Database section)

### CORS Errors

**Fix**: Update backend CORS configuration with your frontend URL

---

## 📊 Deployment Checklist

Backend:
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] Health endpoint working
- [ ] CORS configured for frontend URL

Frontend:
- [ ] Deployed to Vercel
- [ ] API URL environment variable set
- [ ] Build successful
- [ ] UI loads correctly
- [ ] Can connect to backend API

Database:
- [ ] Choose: SQLite (temp) OR PostgreSQL (prod)
- [ ] Migrations run (if using PostgreSQL)
- [ ] Connection tested

Smart Contract:
- [ ] Deployed to HyperEVM
- [ ] Address in backend env variables
- [ ] ABI accessible to backend

---

## 🚀 Quick Deploy Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy Backend
cd backend
vercel --prod

# Deploy Frontend
cd ../frontend
vercel --prod
```

---

## 📝 Production Recommendations

1. **Use PostgreSQL**: SQLite won't persist on Vercel
2. **Set up monitoring**: Use Vercel Analytics
3. **Configure alerts**: Set up error notifications
4. **Custom domain**: Professional appearance
5. **Environment separation**: Use preview deployments for testing
6. **Secrets management**: Use Vercel environment variables (already doing this)
7. **Rate limiting**: Add to backend for API protection

---

## 🔗 Useful Links

- **Vercel Docs**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Node.js on Vercel**: https://vercel.com/docs/functions/serverless-functions/runtimes/node-js
- **Environment Variables**: https://vercel.com/docs/environment-variables
- **PostgreSQL**: https://vercel.com/docs/storage/vercel-postgres

---

## 💡 Tips

- **Preview deployments**: Every git push creates a preview URL
- **Instant rollbacks**: Click rollback in dashboard if issues
- **Edge functions**: Backend runs on Vercel Edge Network (fast globally)
- **Free tier**: Generous limits for hobby projects
- **Analytics**: Built-in Web Analytics available

---

**You're ready to deploy!** Start with the CLI method for quickest setup. 🚀
