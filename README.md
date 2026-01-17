# CampusHub - Student Notes & Events Platform

A modern web platform for university students to share study notes, discuss courses, and stay updated with campus events.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: Netlify
- **Image Upload**: Cloudinary

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase Project
- Cloudinary Account (for image uploads)

## Setup Instructions

### 1. Clone the Repository

```bash
cd campushub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your Firebase and Cloudinary credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 4. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Go to Project Settings → General
4. Copy your web app config values

### 5. Set Up Cloudinary (Optional)

1. Go to [Cloudinary](https://cloudinary.com)
2. Create account and get your Cloud Name
3. Create an unsigned upload preset for your app

## Development

### Start Dev Server

```bash
npm run dev
```

The app will run at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── app/                 # App setup & routing
├── assets/             # Images, icons
├── components/         # Reusable UI components
├── config/             # Firebase & external configs
├── context/            # React context (Auth, etc)
├── features/           # Feature-specific code
│   ├── auth/          # Login, Register, Onboarding
│   ├── notes/         # Notes management
│   ├── events/        # Events management
│   └── profile/       # User dashboard
├── admin/             # Admin panel features
├── hooks/             # Custom React hooks
├── services/          # API & external service calls
├── utils/             # Helper utilities
└── styles/            # Global styles
```

## Features

### Authentication

- Email/Password Registration
- Google Sign-In
- Persistent Sessions with JWT tokens
- Role-based Access Control (Student, Admin)

### User Flow

- **Register** → **Onboarding** → **Dashboard**
- Multi-step onboarding (University, Department, Level)
- Automatic redirect based on role and onboarding status

### User Features

- View and upload study notes
- Browse campus events
- User profile management
- Session management

### Admin Features

- Approve/Reject submitted notes
- Manage users and roles
- Create campus events
- User administration panel

## Deployment on Netlify

### 1. Connect to Netlify

```bash
npm install -g netlify-cli
netlify init
```

Or connect via [Netlify Dashboard](https://app.netlify.com):

1. Click "New site from Git"
2. Select your repository
3. Build command: `npm run build`
4. Publish directory: `dist`

### 2. Set Environment Variables

In Netlify Dashboard:

1. Go to Site settings → Build & deploy → Environment
2. Add all variables from `.env`:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - etc.

### 3. SPA Routing Configuration

This app uses client-side routing. The `_redirects` file in the `public` folder ensures all routes are handled by `index.html`:

```
public/_redirects
/*    /index.html   200
```

This file is automatically copied to the build output and tells Netlify to serve `index.html` for all routes, allowing React Router to handle navigation.

### 4. Deploy

```bash
netlify deploy --prod
```

Or simply push to your main branch if connected to Git.

## Available Routes

### Public Routes

- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Requires Auth)

- `/onboarding` - Complete profile setup
- `/` - Notes page
- `/events` - Events page
- `/dashboard` - User dashboard

### Admin Routes (Requires Admin Role)

- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/notes` - Note moderation
- `/admin/events` - Event management

## Authentication Flow

```
1. User visits /register
2. Creates account → Saved to Firebase
3. Redirected to /onboarding
4. Completes university/dept/level
5. Redirected to /dashboard (or /admin if admin)
6. Session maintained via localStorage token
```

## Common Issues & Solutions

### "Firebase config not found"

- Make sure `.env` file exists and has all Firebase keys
- Check that variable names start with `VITE_`
- Restart dev server after adding `.env`

### Port 5173 already in use

```bash
npm run dev -- --port 3000
```

### Build fails on Netlify

- Check that all environment variables are set in Netlify
- Verify `package.json` exists with dependencies
- Check `vite.config.js` configuration

### Can't login/register

- Verify Firebase project is active
- Check authentication methods are enabled in Firebase Console
- Ensure Firestore database rules allow user document creation

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## Environment Variables Reference

| Variable                          | Description              | Example                 |
| --------------------------------- | ------------------------ | ----------------------- |
| VITE_FIREBASE_API_KEY             | Firebase API Key         | AIzaSy...               |
| VITE_FIREBASE_AUTH_DOMAIN         | Firebase Auth Domain     | project.firebaseapp.com |
| VITE_FIREBASE_PROJECT_ID          | Firebase Project ID      | my-project              |
| VITE_FIREBASE_STORAGE_BUCKET      | Firebase Storage Bucket  | project.appspot.com     |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Messaging Sender ID      | 123456789               |
| VITE_FIREBASE_APP_ID              | Firebase App ID          | 1:123:web:abc...        |
| VITE_CLOUDINARY_CLOUD_NAME        | Cloudinary Cloud Name    | mycloud                 |
| VITE_CLOUDINARY_UPLOAD_PRESET     | Cloudinary Upload Preset | unsigned_preset         |

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
