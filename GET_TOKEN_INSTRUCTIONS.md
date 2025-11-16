# 🔑 How to Get GitHub Token for Push Access

## theatharv1: Follow These Steps

### 1. Go to GitHub Token Settings
Visit: https://github.com/settings/tokens

### 2. Generate New Token
- Click: **"Generate new token"** → **"Generate new token (classic)"**

### 3. Configure Token
- **Name**: `Argentina Loops Push Access`
- **Expiration**: Choose `7 days` or `30 days`
- **Scopes**: ✅ Check **`repo`** (Full control of private repositories)
  - This gives complete read/write access to your repositories

### 4. Generate
- Scroll down and click **"Generate token"**

### 5. Copy Token
- Token will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **COPY IT NOW** - you can only see it once!

### 6. Send to Developer
- Send the token securely (don't post publicly)
- Once code is pushed, you can delete the token for security

---

## Then Run

Once token is provided, run:
```bash
./push-to-theatharv1.sh ghp_YOUR_TOKEN_HERE
```

---

## Security Notes
- Token gives full access to your repositories
- Can be deleted immediately after push
- Only valid for the time period you set
- Don't share publicly or commit to git
