import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing

// const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));
const UserProfile = Loadable(lazy(() => import('../views/user/Profile')));
const UserCloud = Loadable(lazy(() => import('../views/user/Cloud')));
const UserUpload = Loadable(lazy(() => import('../views/user/Uplaod')));
const EditProfile = Loadable(lazy(() => import('../views/user/EditProfile')));
const Coming = Loadable(lazy(() => import('../views/coming_soon/coming')));

// ==============================|| MAIN ROUTING ||============================== //
// const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
const MainRoutes = {
  path: '/dashboard',
  element: <MainLayout />,
  children: [
    {
      path: '/dashboard',
      // element: <DashboardDefault />
      element: <UserProfile />

    },

    {
      path: 'user',
      children: [
        {
          path: 'profile',
          element: <UserProfile />
        }
      ]
    },
    {
      path: 'user',
      children: [
        {
          path: 'cloud',
          element: <UserCloud />
        }
      ]
    },
    {
      path: 'user',
      children: [
        {
          path: 'upload_doc',
          element: <UserUpload />
        },
        {
          path: 'task',
          element: <Coming />
        },
        {
          path: 'support',
          element: <Coming />
        }
      ]
    },
    {
      path: 'user',
      children: [
        {
          path: 'user_profile',
          element: <EditProfile />
        }
      ]
    },
  ]
};

export default MainRoutes;
