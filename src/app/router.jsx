import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import OnboardingGuard from "../components/common/OnboardingGuard";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Onboarding from "../features/auth/Onboarding";
import NotesPage from "../features/notes/NotesPage";
import UploadNote from "../features/notes/UploadNote";
import EventsPage from "../features/events/EventsPage";
import Dashboard from "../features/profile/Dashboard";
// Admin and school features removed for unified user flow

export const router = createBrowserRouter([
  { path: "/", element: <Login /> }, // Root route redirects to login
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <Dashboard />
        </OnboardingGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/notes",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <NotesPage />
        </OnboardingGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/notes/upload",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <UploadNote />
        </OnboardingGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/events",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <EventsPage />
        </OnboardingGuard>
      </ProtectedRoute>
    ),
  },

  // Schools/Explore removed in new user-centric model
  // Explore removed (school features deleted)

  // All admin routes removed; platform is unified for all users

  // Catch-all route for unmatched paths
  { path: "*", element: <Login /> },
]);
