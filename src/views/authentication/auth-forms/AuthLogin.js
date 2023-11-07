import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { loginUser } from "../../../actions/auth";
import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from 'jquery'
// import { notification } from "antd";
// import setAuthToken from '../../../utils/setAuthToken';
// import jwt_decode from 'jwt-decode';
// import axios from 'axios'
// import config from '../../../config';
const defaultTheme = createTheme();

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };

    this.onChange = this.onChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    console.log(this.props)
  }

  

  // componentWillReceiveProps(nextProps) {

  //   if (nextProps.errors) {
  //     this.setState({ errors: nextProps.errors });
  //   }
  // }


  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    }
    window.localStorage.setItem('email', this.state.email)
    window.localStorage.setItem('password', this.state.password)
    console.log("user", userData)
    $('#p_role').text('2')
    console.log("role", $('#p_role').text())
    
    this.props.loginUser(userData)    

  }
  render() {
    return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Iniciar sesión
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => this.handleSubmit(e)}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                onChange={(e) => this.onChange(e)}
                value={this.state.email}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                onChange={(e) => this.onChange(e)}
                value={this.state.password}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Acuérdate de mí"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar sesión
              </Button>
              <Grid container justifyContent="center">

                <Grid item>
                  <Link href="/auth/register" variant="body2">
                    {"No tengo una cuenta? Inscribirse"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

SignIn.propTypes = {
  loginUser: PropTypes.func,
  auth: PropTypes.object.isRequired,
  // errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  // errors: state.errors
})
export default connect(mapStateToProps, { loginUser })(SignIn);
