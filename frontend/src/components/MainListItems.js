import * as React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


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
      text: 'Holiday Register',
      icon: <AssessmentIcon />,
      path: '/holidayRegistration'
    },
    {
      text: 'Change Password',
      icon: <LockOutlinedIcon />,
      path: '/changepassword'
    }
  ]
);