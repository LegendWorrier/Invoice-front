import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
// import { Route, Navigate } from 'react-router-dom';

// dashboard routing
// const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));
const Profile = Loadable(lazy(() => import('../views/client/Profile')));
const Ctable = Loadable(lazy(() => import('../views/client/Ctable')));
const Billing = Loadable(lazy(() => import('../views/client/Billing')));
const UserAccount = Loadable(lazy(() => import('../views/client/UserAccount')));
const Cloud = Loadable(lazy(() => import('../views/client/Cloud')));
const EditProfile = Loadable(lazy(() => import('../views/client/EditProfile')));
const Coming = Loadable(lazy(() => import('../views/coming_soon/coming')));


// ==============================|| MAIN ROUTING ||============================== //
// const AuthGuardedRoute = ({ element: Component, ...rest }) => {
//   const  isAuthenticated  = window.localStorage.getItem("role");
 
//   return (
//     <Route
//       {...rest}
//       render={() =>
//         isAuthenticated == '3' ? (
//           <Component />
//         ) : (
//           <Navigate to="/" replace={true} /> // Redirect to login page if not authenticated
//         )
//       }
//     />
//   );
// };

const MainRoutes = {
  
 
  path: '/dashboard',
  element: <MainLayout />,
  children: [
    {
      path: '/dashboard',
      // element: <DashboardDefault/>
      element: <Profile />

  
    },
    
    {
      path: 'client',
      children: [
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'editprofile/:id',
          element: <EditProfile/>
        },
        {
          path: 'table',
          element: <Ctable />
        },
        {
          path: 'billing',
          element: <Billing />
        },
        {
          path: 'user_accounts',
          element: <UserAccount />
        },
        {
          path: 'cloud',
          element: <Cloud />
        },
        {
          path: 'edit_profile',
          element: <EditProfile />
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
    
    
  ]
};

export default MainRoutes;
