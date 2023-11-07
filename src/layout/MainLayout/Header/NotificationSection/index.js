import { useState, useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  // Button,
  ButtonBase,
  // CardActions,
  // Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  // TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios'
import serverconfig from '../../../../config';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';
import { notification} from 'antd'
// assets
import { IconBell,  IconBellRinging2 } from '@tabler/icons';
import { connect } from 'react-redux';


// ==============================|| NOTIFICATION ||============================== //
let ind1 = 1
let tmp_data = []
const NotificationSection = ({wholeState}) => {
  const [newArrive, setNewArrive ] = useState(false)
  const [newData, setNewData] = useState([])


  useEffect(() => {

    axios.get(serverconfig.API_URL + 'api/notifications/all')
    .then(data => {
      console.log('data_notification', data.data)
      data.data.map(ind => {
        if (wholeState.customization.auth._id === ind.agency_id && ind.status == false) {
        tmp_data.push({id: ind1, title: 'Notification', content: ind.msg_content, _id: ind._id });
        ind1 +=1
        }
      })
      if(tmp_data.length == 0){
        setNewArrive(false);
        
      } else {
        setNewArrive(true);
        setNewData(tmp_data);

      }

    })
    // wholeState.customization.socket.on('registerNewUsertoClient', registerNewUserHandler());

    wholeState.customization.socket.on('registerNewUsertoClient', registerNewUserHandler);

    return () => {
      wholeState.customization.socket.off('registerNewUsertoClient', registerNewUserHandler);
    };
  },[wholeState])
  const registerNewUserHandler = (stu_data) => {
    if (wholeState.customization.auth._id === stu_data.agency_id) {
      setNewArrive(true);
      // tmp_data = newData
      tmp_data.push({id: ind1, title: 'Notification', content: stu_data.msg_content, _id: stu_data._id  });
    
      ind1 +=1
      console.log('12312412412',newData, tmp_data);
      
      setNewData(tmp_data);
      notification.success({
        description: 'El usuario ' + stu_data.msg_content,
        placement: 'bottomRight',
        duration: 5 // Duration in seconds (optional)
      });
    }
  };

  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState('');
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    // setNewArrive(false)
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const confirm = (id) => {
    let temp = newData;
    temp.map(item => {
      if(item.id == id){
        console.log('item', item)
        axios.get(serverconfig.API_URL + 'api/notifications/setFlag?param=' + item._id)
      }
    })
    const updatedTemp = temp.filter(item => item.id !== id);
    tmp_data = tmp_data.filter(item => item.id !== id);
    if(updatedTemp.length == 0){
      setNewArrive(false);
    }
    setNewData(updatedTemp)
    console.log('item', updatedTemp)
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // const handleChange = (event) => {
  //   if (event?.target.value) setValue(event?.target.value);
  // };

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <ButtonBase sx={{ borderRadius: '12px' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            {newArrive ? <IconBellRinging2 /> : <IconBell stroke={1.5} size="1.3rem" />}
            
            
          </Avatar>
        </ButtonBase>
      </Box>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">Todas las notificaciones</Typography>
                            {/* <Chip
                              size="small"
                              label="01"
                              sx={{
                                color: theme.palette.background.default,
                                bgcolor: theme.palette.warning.dark
                              }}
                            /> */}
                          </Stack>
                        </Grid>
                        {/* <Grid item>
                          <Typography component={Link} to="#" variant="subtitle2" color="primary">
                          Marcar como todos leídos
                          </Typography>
                        </Grid> */}
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}>
                        <Grid container direction="column" spacing={2}>
  
                          <Grid item xs={12} p={0}>
                            <Divider sx={{ my: 0 }} />
                          </Grid>
                        </Grid>
                        {newData.map(ind => 
                        <NotificationList confirm ={confirm} key={ind.id} data = {ind}/>

                        )}
                      </PerfectScrollbar>
                    </Grid>
                  </Grid>
                  <Divider />
                  {/* <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Button size="small" disableElevation>
                    Ver todo
                    </Button>
                  </CardActions> */}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};
const mapStateToProps = (state) => ({
  wholeState: state,
});
export default connect(mapStateToProps,)(NotificationSection);
