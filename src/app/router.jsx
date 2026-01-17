import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import OnboardingGuard from "../components/common/OnboardingGuard";
import AdminGuard from "../admin/AdminGuard";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Onboarding from "../features/auth/Onboarding";
import NotesPage from "../features/notes/NotesPage";
import UploadNote from "../features/notes/UploadNote";
import EventsPage from "../features/events/EventsPage";
import Dashboard from "../features/profile/Dashboard";
import UsersPage from "../admin/users/UsersPage";
import PendingNotes from "../admin/notes/PendingNotes";
import ExploreSchools from "../features/explore/ExploreSchools";
import AdminEvents from "../admin/events/AdminEvents";

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

  {
    path: "/explore",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <ExploreSchools />
        </OnboardingGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminGuard>
          <Dashboard />
        </AdminGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/users",
    element: (
      <ProtectedRoute>
        <AdminGuard>
          <UsersPage />
        </AdminGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/notes",
    element: (
      <ProtectedRoute>
        <AdminGuard>
          <PendingNotes />
        </AdminGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/events",
    element: (
      <ProtectedRoute>
        <AdminGuard>
          <AdminEvents />
        </AdminGuard>
      </ProtectedRoute>
    ),
  },

  // Catch-all route for unmatched paths
  { path: "*", element: <Login /> },
]);
