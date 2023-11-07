import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Stack, Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import axios from 'axios'
import { notification } from 'antd'
import serverconfig from '../../../config'

/////////////////////////////////////////////////////////////
let easing = [0.6, -0.05, 0.01, 0.99];
const animate = {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: easing,
    delay: 0.16
  }
};

const SignupForm = ({ setAuth }) => {
  const navigate = useNavigate();

    const [{fname, lname, email, password}, setData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: ''
    })
  const [showPassword, setShowPassword] = useState(false);

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const onChange = (e) => {
    setData({ [e.target.name]: e.target.value });
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: SignupSchema,
    onSubmit: () => {
    //   setTimeout(() => {
        setAuth(true);
    //     navigate('/', { replace: true });
    //   }, 2000);
    axios.post(serverconfig.API_URL+'api/users/register', {fname: fname, lname:lname, email: email, password: password })
    .then(res => {
        notification.success({
            description:
              'Welcome, Administrator!',
              placement: 'bottomRight',
            duration: 2, // Duration in seconds (optional)
          });
          navigate('/auth/login');
    })
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack
            component={motion.div}
            initial={{ opacity: 0, y: 60 }}
            animate={animate}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            <TextField
              fullWidth
              label="First name"
              
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              value={fname}
              name='fname'
              onChange={onChange}

            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              value={lname}
              name='lname'
              onChange={onChange}
            />
          </Stack>

          <Stack spacing={3} component={motion.div} initial={{ opacity: 0, y: 40 }} animate={animate}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              value={email}
              name='email'
              onChange={onChange}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      <Icon icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              value={password}
              name='password'
              onChange={onChange}
            />
          </Stack>

          <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={animate}>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Sign up
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default SignupForm;
