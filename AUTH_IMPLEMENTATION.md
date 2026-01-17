# Complete Authentication Flow - Implementation Guide

## Overview

A complete authentication system with user registration, login, session management, and role-based routing (Register → Onboarding → Dashboard).

## Features Implemented

### 1. **Session Management with Tokens**

- **File**: `src/services/auth.service.js`
- User session stored in `localStorage` with:
  - User ID (uid)
  - Email
  - ID Token (JWT from Firebase)
- Session persists across page refreshes
- Auto-logout on token expiry

### 2. **Enhanced Auth Context**

- **File**: `src/context/AuthContext.jsx`
- Provides access to:
  - `user`: Firebase user object
  - `userData`: User profile from Firestore
  - `token`: Current ID token
  - `loading`: Loading state during auth state check

### 3. **Authentication Services**

- **Registration** (`registerWithEmail`)
  - Creates Firebase auth account
  - Creates Firestore user profile
  - Sets `onboarding_completed: false`
  - Returns token for session
- **Login** (`loginWithEmail`)
  - Authenticates user
  - Fetches user profile from Firestore
  - Redirects to onboarding or dashboard based on completion status
- **Google Sign-In** (`signInWithGoogle`)
  - OAuth authentication
  - Creates profile if first-time user
- **Logout** (`logout`)
  - Clears Firebase session
  - Removes localStorage session
  - Redirects to login

### 4. **Auth Routes**

- `/register` - Registration page with email/password and Google Sign-In
- `/login` - Login page with smart redirect based on onboarding status
- `/onboarding` - Multi-step profile completion (University, Department, Level)
- `/dashboard` - User dashboard showing profile, session, and role info

### 5. **Protected Routes**

- `ProtectedRoute`: Requires authentication (redirects to /login if not authenticated)
- `OnboardingGuard`: Requires completed onboarding (redirects to /onboarding if not)
- `AdminGuard`: Requires admin role (redirects to / if not admin)

### 6. **User Profile Fields**

```javascript
{
  uid: string,
  full_name: string,
  email: string,
  role: "student" | "admin" | "super_admin",
  university_id: string | null,
  department_id: string | null,
  level_id: string | null,
  onboarding_completed: boolean,
  created_at: timestamp,
}
```

## Flow Diagrams

### Registration Flow

```
/register (enter email, password, name)
    ↓
registerWithEmail() creates Firebase account
    ↓
Creates Firestore profile (onboarding_completed: false)
    ↓
Saves token to localStorage
    ↓
Redirect to /onboarding
```

### Login Flow

```
/login (enter email, password)
    ↓
loginWithEmail() authenticates user
    ↓
Fetch user profile from Firestore
    ↓
Check onboarding_completed
    ├── if false → /onboarding
    └── if true → /dashboard
```

### Onboarding Flow

```
/onboarding (multi-step form)
    ↓
Step 1: Select University
    ↓
Step 2: Select Department
    ↓
Step 3: Select Academic Level
    ↓
Submit → Updates Firestore profile
    ↓
Set onboarding_completed: true
    ↓
Role-based redirect:
    ├── admin/super_admin → /admin
    └── student → /dashboard
```

### Dashboard Flow

```
/dashboard
    ↓
Display:
    - User Information (email, role, uid, status)
    - Academic Information (university, dept, level)
    - Session Information (token preview)
    - Quick links based on role

Actions:
    - Logout button
    - Navigate to admin panel (if admin)
    - Navigate to notes/events (if student)
```

## Usage Examples

### Register a New User

```javascript
import { registerWithEmail } from "services/auth.service";

const { user, token } = await registerWithEmail(
  "john@example.com",
  "password123",
  "John Doe"
);
```

### Login

```javascript
import { loginWithEmail } from "services/auth.service";

const { user, userData, token } = await loginWithEmail(
  "john@example.com",
  "password123"
);
```

### Access User Data in Components

```javascript
import { useAuth } from "context/AuthContext";

export default function MyComponent() {
  const { user, userData, token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome, {userData?.full_name}</p>
      <p>Role: {userData?.role}</p>
      <p>Token: {token?.slice(0, 20)}...</p>
    </div>
  );
}
```

### Logout

```javascript
import { logout } from "services/auth.service";

await logout();
// User is redirected to /login
```

## File Structure

```
src/
├── services/
│   └── auth.service.js (enhanced with token & session)
├── context/
│   └── AuthContext.jsx (enhanced with userData & token)
├── features/auth/
│   ├── Register.jsx (new)
│   ├── Login.jsx (enhanced)
│   └── Onboarding.jsx (new)
├── features/profile/
│   └── Dashboard.jsx (new)
├── components/common/
│   ├── ProtectedRoute.jsx
│   ├── OnboardingGuard.jsx
│   └── AdminGuard.jsx
└── app/
    ├── App.jsx (new - router setup)
    └── router.jsx (enhanced with new routes)
```

## Security Considerations

- Tokens stored in localStorage (consider upgrading to secure cookie storage for production)
- ID tokens are JWT-based and include expiration
- Token is refreshed on each auth state change
- Protected routes validate authentication before rendering
- Admin routes require admin role verification from Firestore

## Next Steps (Optional Enhancements)

1. Add email verification
2. Implement password reset
3. Add two-factor authentication
4. Upgrade to secure cookie-based token storage
5. Add session timeout alerts
6. Implement refresh token rotation
7. Add user profile picture upload
8. Add notification preferences during onboarding
