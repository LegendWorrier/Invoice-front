import axios from 'axios';
// import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  // REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  // LOGIN_SUCCESS,
  // LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  GET_ERRORS
} from './types';
import setAuthToken from '../utils/setAuthToken';
import { notification } from 'antd';
import serverconfig from '../../src/config';
// import jwt_decode from 'jwt-decode';

// import 'react-toastify/dist/ReactToastify.css';
// import {redirect} from 'react-router-dom'
// import { useNavigate } from 'react-router-dom';
// import { }
// // load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// register user
export const register = (userdata) => async (dispatch) => {
  axios
    .post(serverconfig.API_URL + 'api/users/register', userdata)
    .then((res) => {
      // console.log(history)
      // history.push('/auth/login');
      window.location.href = '/auth/login';

      // navigate('/auth/login');
      // console.log('res', res);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
    })
    .catch(() =>
      dispatch({
        type: GET_ERRORS
        // payload: err.response.data,
      })
    );

  dispatch(loadUser());
};

// save Data

// export const saveData = (data) => async (dispatch) => {};

// login user
// export const login = (email, password) => async (dispatch) => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   const body = JSON.stringify({ email, password });

//   try {
//     const res = await axios.post('/api/auth', body, config);

//     dispatch({
//       type: LOGIN_SUCCESS,
//       payload: res.data,
//     });

//     dispatch(loadUser());
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
//     }

//     dispatch({
//       type: LOGIN_FAIL,
//     });
//   }
// };

export const loginUser = (userData)  => {
  console.log('user', userData)
  axios
    .post(serverconfig.API_URL + 'api/users/login', userData)
    .then((res) => {
      //save to localStorage
      // console.log('ssssssssssss', res.data["success"])
      if (res.data['success'] == true) {
        
        window.localStorage.setItem('role', '2');
        const { token } = res.data;
        
        localStorage.setItem('jwtToken', token);


        //set token to ls

        //Set token to Auth header
        // setAuthToken(token);

        // //Decode token to get user data

        // dispatch(setCurrentUser(decoded));
        // setTimeout(() => {
          notification.success({
            description: 'Welcome, User!',
            placement: 'bottomRight',
            duration: 2 // Duration in seconds (optional)
          });
        window.location.href = '/dashboard';

        // }, 2000);
      }
    })
    .catch((err) => {
      // dispatch({
      //   type: GET_ERRORS
      //   // payload: err.response.data,
      // });
      console.log(err);
      notification.error({
        description: 'Sorry, User!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
    });
};

// logout or clear profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
