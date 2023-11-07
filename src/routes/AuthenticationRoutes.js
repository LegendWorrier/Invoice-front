import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';


const Login = Loadable(lazy(() => import('../views/authentication/auth/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth/Register')));
const AuthLogin = Loadable(lazy(() => import('../views/authentication/auth-forms/AuthLogin')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {

  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <Login />
    },
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <Register />
        }
      ]
    }
  ]
};

export default AuthenticationRoutes;
