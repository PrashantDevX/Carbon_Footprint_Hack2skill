import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Auth } from '@/pages/Auth';

// Lazy loading for bundle optimization (Efficiency)
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Calculator = lazy(() => import('@/pages/Calculator').then(m => ({ default: m.Calculator })));
const Assistant = lazy(() => import('@/pages/Assistant').then(m => ({ default: m.Assistant })));
const Scanner = lazy(() => import('@/pages/Scanner').then(m => ({ default: m.Scanner })));
const GreenMap = lazy(() => import('@/pages/GreenMap').then(m => ({ default: m.GreenMap })));
const Goals = lazy(() => import('@/pages/Goals').then(m => ({ default: m.Goals })));
const Leaderboard = lazy(() => import('@/pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-earth-50 dark:bg-forest-950" role="status" aria-label="Loading page">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
  </div>
);

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/auth" replace />;

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense> },
          { path: 'calculator', element: <Suspense fallback={<LoadingFallback />}><Calculator /></Suspense> },
          { path: 'assistant', element: <Suspense fallback={<LoadingFallback />}><Assistant /></Suspense> },
          { path: 'scanner', element: <Suspense fallback={<LoadingFallback />}><Scanner /></Suspense> },
          { path: 'map', element: <Suspense fallback={<LoadingFallback />}><GreenMap /></Suspense> },
          { path: 'goals', element: <Suspense fallback={<LoadingFallback />}><Goals /></Suspense> },
          { path: 'leaderboard', element: <Suspense fallback={<LoadingFallback />}><Leaderboard /></Suspense> },
          { path: 'settings', element: <Suspense fallback={<LoadingFallback />}><Settings /></Suspense> }
        ]
      }
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
