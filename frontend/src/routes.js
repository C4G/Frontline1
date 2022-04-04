import { Navigate, Outlet, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Savings from './pages/Savings';
import UserDetails from './pages/Details';
import Courses from './pages/Courses';
import Course from './pages/Course';
import User from './pages/User';
import Users from './pages/Users';
import NotFound from './pages/Page404';
import ManageHomepage from './pages/ManageHomepage';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        {
          path: 'homepage',
          element: <ManageHomepage />,
        },
        {
          path: 'details',
          element: <Outlet />,
          children: [
            { path: '', element: <UserDetails /> },
            { path: ':id', element: <User /> },
          ],
        },
        {
          path: 'savings',
          element: <Outlet />,
          children: [
            { path: '', element: <Savings /> },
          ],
        },
        {
          path: 'users',
          element: <Outlet />,
          children: [
            { path: '', element: <Users /> },
          ],
        },
        { 
          path: 'courses',
          element: <Outlet />,
          children: [
            { path: '', element: <Courses /> },
            { path: ':id', element: <Course /> },
          ],
        },
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
