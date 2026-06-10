import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Assistant } from '@/pages/Assistant';
import { Calculator } from '@/pages/Calculator';
import { Dashboard } from '@/pages/Dashboard';
import { Goals } from '@/pages/Goals';
import { GreenMap } from '@/pages/GreenMap';
import { Leaderboard } from '@/pages/Leaderboard';
import { Scanner } from '@/pages/Scanner';
import { Settings } from '@/pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'calculator', element: <Calculator /> },
      { path: 'assistant', element: <Assistant /> },
      { path: 'scanner', element: <Scanner /> },
      { path: 'map', element: <GreenMap /> },
      { path: 'goals', element: <Goals /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
