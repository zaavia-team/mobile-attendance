import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';



export const mainListItems = (

  [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/'
    },
    {
      text: 'User Register',
      icon: <PeopleIcon />,
      path: '/userregister'
    }
  ]
);