import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ImIn from './ImIn';
import UserRegister from './UserRegister';
import AdminReport from './AdminReport';
import { Route, Routes } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate  } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import HolidayResister from './HolidayRegister'
import DailyAttendence from './DailyAttendence';
import MailSetup from './MailSetup';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';






const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();



function DashboardContent({setLoggedin}) {

  const [MainListItems, setMainListItems] = React.useState([])

  const MainListItemsAdmin = [
     
    {
      text: 'User Register',
      icon: <PeopleIcon />,
      path: '/userRegister'
    },
    {
      text: 'Admin Report',
      icon: <AssessmentIcon />,
      path: '/adminreport'
    },
    {
      text: 'Holiday Register',
      icon: <AppRegistrationIcon />,
      path: '/holidayRegistration'
    },
    {
      text: 'Daily Attendence',
      icon: <AssignmentTurnedInIcon />,
      path: '/dailyattendence'
    },
    {
      text: 'Mail Setup',
      icon: <MailOutlineIcon />,
      path: '/mailsetup'
    },

  ]
  
  const MainListItemsUser = [
   
  ]
  const DefaultMainListItems = [
    {
      text: 'attendence',
      icon: <LockOutlinedIcon />,
      path: '/'
    },
    
    {
      text: 'Change Password',
      icon: <LockOutlinedIcon />,
      path: '/changepassword'
    }
  
  ]
  
  
  
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  

  
  
  React.useEffect(()=>{
    
    const userData = localStorage.getItem("data") && JSON.parse(localStorage.getItem("data"))
    
    if(userData.data?.data.RightsTitle.find(r => r === "Admin")){
      setMainListItems([...MainListItemsAdmin,...DefaultMainListItems])
      
    }else{
      setMainListItems([...MainListItemsUser,...DefaultMainListItems])
    }
     
    },[])
   


  const handleLogout = () =>{
    localStorage.clear()
    setLoggedin(false)
    navigate('/')
  
  }

console.log(MainListItems,"MainListItems")
  

  return (
<>
 
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} color="secondary">
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              ATTENDENCE
            </Typography>
            <Button onClick={handleLogout} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {MainListItems.map(item =>(
              <ListItemButton
                key = {item.key}
                onClick={()=> navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text}  />

              </ListItemButton>
            ) )}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item lg={12} md={12}>
                <Routes>
                <Route exact path = "/" element = {<ImIn />} />
                <Route exact path = "/userRegister" element = {<UserRegister />} />
                <Route exact path = "/adminreport" element = {<AdminReport />} />
                <Route exact path = "/changepassword" element = {<ChangePassword />} />
                <Route exact path = "/holidayRegistration" element = {<HolidayResister />} />
                <Route exact path = "/dailyattendence" element = {<DailyAttendence />} />
                <Route exact path = "/mailsetup" element = {<MailSetup />} />
                </Routes>
                </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
   

</>
  );
}

export default function Dashboard({setLoggedin}) {

  
  return <DashboardContent setLoggedin={setLoggedin} />;
}