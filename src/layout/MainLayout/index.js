import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import {useEffect, useState} from 'react'
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
// import Customization from '../Customization';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';
import { SET_MENU } from 'store/actions';
// import { notification } from 'antd';
import {authLogin, setUserData } from '../../store/actions'
import axios from 'axios'
import serverconfig from '../../config'

// import config from '../../config';
// import io from 'socket.io-client';
// assets
import { IconChevronRight } from '@tabler/icons';
import { connect } from 'react-redux';

// styles
// let socket = io(`http://${config.server}:8888`)

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({authLogin, setUserData}) => {

  useEffect(() => {
    // const socket = io('http://localhost:8888');
    let role = window.localStorage.getItem("role")
    if(role == '2'){
      axios
      .post(serverconfig.API_URL + 'api/users/login', {license: window.localStorage.getItem("license")})
      .then(res => {
        authLogin(res.data)
      })
    } else if(role=='3'){
      axios
      .post(serverconfig.API_URL + 'api/users/clientSave', {license: window.localStorage.getItem("license")})
      .then(res => {
        authLogin(res.data.agency)
        setUserData(res.data.userdata)
      })
    }
    // Set up event listener using socket.on()
    // wholeState.customization.socket.on('registerNewUsertoClient', (stu_data)=> {
    //   if(wholeState.customization.auth._id == stu_data.client){
    //     console.log('12312412412', stu_data)
    //     notification.success({
    //       description: 'El usuario ' + stu_data.user +  ' acaba de registrarse para usted.',
    //       placement: 'bottomRight',
    //       duration: 2 // Duration in seconds (optional)
    //     });
    //   }
    // })
  
    // Clean up the socket connection when the component unmounts

  }, []);
  const [navigator, setNavigator] = useState(navigation)

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  useEffect(() => {
    setNavigator(navigation.items[0])
    console.log('navication', navigation.items)

    // navigation.items.map((menu) => {
    //   if (menu.type && menu.type === 'group') {
    //     getCollapse(menu);
    //   }
    // });
  });
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
        <Breadcrumbs separator={IconChevronRight} navigation={navigator} icon title rightAlign />
        <Outlet />
      </Main>
      {/* <Customization /> */}
    </Box>
  );
};

const mapStateToProps = (state) => ({
  wholeState: state,
});
export default connect(mapStateToProps, {authLogin, setUserData})(MainLayout);