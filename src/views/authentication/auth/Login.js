import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Radio } from "antd";
// material-ui
import { useTheme } from "@mui/material/styles";
import {  Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthWrapper1 from "../AuthWrapper1";
import AuthCardWrapper from "../AuthCardWrapper";
import AuthLogin from "../auth-forms/AuthLogin";
// import AuthRegister from "../auth-forms/AuthRegister";
import Logo from "../../../ui-component/Logo";
import AuthFooter from "../../../ui-component/cards/AuthFooter";

import Admin from '../auth-forms/Admin'
// import io from 'socket.io-client';
import { setSocket } from '../../../store/actions'
import { connect } from 'react-redux';



// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {

  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 68px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item sx={{ mb: 3 }} style={{marginBottom: -10}}>
                    <Link to="#">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={matchDownSM ? "column-reverse" : "row"}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Typography
                            color={theme.palette.secondary.main}
                            gutterBottom
                            fontSize="26px"
                            variant={matchDownSM ? "h3" : "h2"}
                          >
                            Hola, Bienvenido!
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize="16px"
                            textAlign={matchDownSM ? "center" : "inherit"}
                          >
                            Elija su perfil
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid style={{marginTop: 20}}>
                    <Radio.Group onChange={onChange} value={value} size="large">
                      <Radio value={1}>Administradora</Radio>
                      <Radio value={2}>Usuaria</Radio>
                      <Radio value={3}>Gesto/Asesoria</Radio>
                    </Radio.Group>
                  </Grid>
              
                  <Grid item xs={12}>
                    {
                      value === 1 || value === 3 || value == 2  
                      ? <Admin role={value}/>
                      : <AuthLogin role={value} />
                    }
                    {/* <AuthLogin /> */}
                  </Grid>
                    
                  <Grid item xs={12}>
                    <Grid
                      item
                      container
                      direction="column"
                      alignItems="center"
                      xs={12}
                    >
                      
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

const mapStateToProps = (state) => ({
  wholeState: state,
});

// const mapDispatchToProps = {
//   setAuth: SET_AUTH,
// };
export default connect(mapStateToProps, {setSocket})(Login);