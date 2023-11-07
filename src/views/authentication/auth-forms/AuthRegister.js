import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {Select, MenuItem} from '@mui/material'
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from 'axios';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import serverconfig from '../../../config';
// import io from 'socket.io-client';
import { connect } from 'react-redux';

// TODO remove, this demo shouldn't need to reset the theme.

// let socket = io(`http://${config.server}:8888`)
const defaultTheme = createTheme();

const SignUp = ({wholeState}) => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [agency, setAgency] = useState('');
  const agency = ''
  const [clientInfo, setClientInfo] = useState([])
  const [selectedValue, setSelectedValue] = useState('');
  useEffect(() => {
    // let tmp = {client: '64e65d393379f655c89b8aec',
    //   user: 'King Kumar has just registered!'}
    // wholeState.customization.socket.emit('Add User', (tmp))
    getData()
  }, [])
    const getData = async () => {
      const result = await axios.get(serverconfig.API_URL + 'api/users/clientlist')
      let data = result.data.data    
      console.log('whole client ', data)
      setClientInfo(data)
  
    }
  const navigate = useNavigate();
  const onFname = (e) => {
    setFname(e.target.value);
  };
  const onLname = (e) => {
    setLname(e.target.value);
  };
  const onEmail = (e) => {
    setEmail(e.target.value);
  };
  const onPassword = (e) => {
    setPassword(e.target.value);
  };

  // const onAgency = (e) => {
  //   setAgency(e.target.value);
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    window.localStorage.setItem('name', fname);
    window.localStorage.setItem('lname', lname);
    if(fname == '' || lname == '' || email == '' || password == ''){
      return  notification.warning({
          description: 'Registro fallida!',
          placement: 'bottomRight',
          duration: 2 // Duration in seconds (optional)
        })
    }
    console.log('angency_id', selectedValue)
    axios
      .post(serverconfig.API_URL + 'api/users/register', {
        fname: fname,
        lname: lname,
        email: email,
        password: password,
        agency: agency,
        consumption: 0.2,
        fee: 6,
        agency_id: selectedValue
      })
      .then(() => {
        notification.success({
          description: 'Registro exitoso!',
          placement: 'bottomRight',
          duration: 2 // Duration in seconds (optional)
        });
        
        navigate('/');
        let tmp = {client: selectedValue,
                   user: fname + ' ' + lname + ' has just registered!'}
      wholeState.customization.socket.emit('Add User', (tmp))

      })
      .catch(() =>
        notification.error({
          description: 'Registro fallida!',
          placement: 'bottomRight',
          duration: 2 // Duration in seconds (optional)
        })
      );
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inscribirse
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="fname"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre de pila"
                  autoFocus
                  onChange={onFname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  value={lname}
                  name="lname"
                  onChange={onLname}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  value={email}
                  onChange={onEmail}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  value={password}
                  onChange={onPassword}
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                {/* <TextField 
                required 
                fullWidth 
                name="agency" 
                value={agency} 
                onChange={onAgency} 
                label="Referencia de Agencia" 
                id="agency" /> */}

                <Select
                      fullWidth
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedValue}
                      onChange={(event) => setSelectedValue(event.target.value)}
                    >
                    {clientInfo.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.id}
                      </MenuItem>
                    ))}
                      {/* <MenuItem value={1}>Option 1</MenuItem>
                      <MenuItem value={2}>Option 2</MenuItem>
                      <MenuItem value={3}>Option 3</MenuItem> */}
                </Select>
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Inscribirse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Ya tienes una cuenta? Iniciar sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
const mapStateToProps = (state) => ({
  wholeState: state,
});
export default connect(mapStateToProps)(SignUp);
