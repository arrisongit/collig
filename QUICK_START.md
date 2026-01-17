# CampusHub - Quick Start Guide

## 🚀 Start Development Server

### Step 1: Install Dependencies

```bash
cd campushub
npm install
```

### Step 2: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Firebase & Cloudinary credentials
# You can use any placeholder values for development
```

### Step 3: Start Dev Server

```bash
npm run dev
```

**Server starts at:** `http://localhost:5173`

You should see:

```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 📖 Using the App

### First Time Users

1. **Go to `/register`** - Create an account
2. **Fill onboarding** - Select university, department, level
3. **Access dashboard** - See your profile & session info

### Login Later

1. **Go to `/login`** - Login with email/password or Google
2. **Auto redirect** - If onboarding is done → dashboard, else → onboarding

## 🏗️ Build & Deploy to Netlify

### Option 1: Manual Deployment

```bash
# Build production files
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Option 2: Git-based Deployment (Recommended)

1. Push code to GitHub/GitLab
2. Go to [Netlify Dashboard](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. **Build command:** `npm run build`
6. **Publish directory:** `dist`
7. Add environment variables (see below)
8. Deploy!

### Add Environment Variables to Netlify

1. Go to Site Settings → Build & Deploy → Environment
2. Add these variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

## 📋 Available Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## 🔗 Default Routes

| Route         | Purpose          | Auth Required      |
| ------------- | ---------------- | ------------------ |
| `/register`   | Sign up          | ❌ No              |
| `/login`      | Login            | ❌ No              |
| `/onboarding` | Complete profile | ✅ Yes             |
| `/`           | Notes page       | ✅ Yes + Onboarded |
| `/events`     | Events page      | ✅ Yes + Onboarded |
| `/dashboard`  | User dashboard   | ✅ Yes + Onboarded |
| `/admin`      | Admin panel      | ✅ Admin Only      |

## 🔑 Test Credentials (Development)

You can use any email/password to register in development. Firebase will create the account automatically.

### Example:

- Email: `test@example.com`
- Password: `test123456`
- Full Name: `Test User`

## 🎨 File Locations Reference

```
campushub/
├── package.json          ← Dependencies & scripts
├── vite.config.js        ← Vite configuration
├── netlify.toml         ← Netlify deployment config
├── .env                 ← Environment variables (YOUR CREDENTIALS)
├── .env.example         ← Example env file (commit to repo)
├── index.html           ← HTML entry point
├── README.md            ← Full documentation
└── src/
    ├── main.jsx         ← React app entry
    ├── index.css        ← Global styles
    ├── app/
    │   ├── App.jsx      ← Main app component
    │   └── router.jsx   ← Route definitions
    ├── config/
    │   └── firebase.js  ← Firebase setup
    ├── context/
    │   └── AuthContext.jsx ← Auth state
    ├── services/
    │   └── auth.service.js ← Auth functions
    └── features/
        ├── auth/        ← Login/Register/Onboarding
        ├── notes/       ← Notes features
        ├── events/      ← Events features
        └── profile/     ← Dashboard
```

## ⚠️ Common Issues

### Port 5173 in use

```bash
npm run dev -- --port 3000
```

### .env changes not applied

- Restart dev server (`Ctrl+C` then `npm run dev`)

### Build fails

- Run `npm install` again
- Delete `node_modules` and `dist` folders
- Check that all env vars start with `VITE_`

### Can't login

- Check Firebase credentials in `.env`
- Verify Firebase project is active
- Check Firestore rules allow read/write

## 📱 Responsive Design

The app is designed to work on:

- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔐 Security Notes

- Never commit `.env` to version control
- Always use environment variables for secrets
- Session tokens stored in localStorage (check Netlify docs for secure options)
- Use Firebase Security Rules for database access

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Review `AUTH_IMPLEMENTATION.md` for auth flow details
- Check console for error messages: Open DevTools (F12)

---

**Happy coding! 🚀**
