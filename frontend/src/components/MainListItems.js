import * as React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';



export const mainListItems = (

  [
   
    {
      text: 'User Register',
      icon: <PeopleIcon />,
      path: '/'
    },
    {
      text: 'Admin Report',
      icon: <AssessmentIcon />,
      path: '/adminreport'
    },
    {
      text: 'Change Password',
      icon: <AssessmentIcon />,
      path: '/changepassword'
    }
  ]
);