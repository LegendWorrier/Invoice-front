import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';


// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));
const AgencyClients = Loadable(lazy(() => import('../views/admin/AgencyClients')));
const UserClients = Loadable(lazy(() => import('../views/admin/UserClients'))); 
const Billing = Loadable(lazy(() => import('../views/admin/Billing')));
const AgencyClient_Profile = Loadable(lazy(() => import('../views/admin/Profile/AgencyClient_Profile')));
const UserClient_Profile = Loadable(lazy(() => import('../views/admin/Profile/UserClient_Profile')));
const EditProfile = Loadable(lazy(() => import('../views/admin/Profile/EditProfile')));
const Coming = Loadable(lazy(() => import('../views/coming_soon/coming')));
const AgencyProfile = Loadable(lazy(() => import('../views/admin/Profile/AgencyProfile.js')));
const UserProfile = Loadable(lazy(() => import('../views/admin/Profile/UserProfile.js')));




// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  
 
  path: '/dashboard',
  element: <MainLayout />,
  children: [
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    
    {
      path: 'admin',
      children: [
        {
          path: 'agency_clients',
          element: <AgencyClients />
        },
        {
          path: 'user_clients',
          element: <UserClients />
        },
        {
          path: 'billing',
          element: <Billing />
        },
        {
          path: 'client_profile',
          element: <AgencyClient_Profile />
        },
        {
          path: 'agency_profile/:id',
          element: <AgencyProfile />
        },
        {
          path: 'user_profile/:id',
          element: <UserProfile />
        },
        {
          path: 'edit_profile',
          element: <EditProfile />
        },
        {
          path: 'userclient_profile',
          element: <UserClient_Profile />
        },
        {
          path: 'task',
          element: <Coming />
        },
        {
          path: 'support',
          element: <Coming />
        },
        {
          path: 'settings',
          element: <Coming />
        }
        
      ]
    },
    
    
  ]
};

export default MainRoutes;
