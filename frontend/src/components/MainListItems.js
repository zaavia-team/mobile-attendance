// import * as React from 'react';
// import PeopleIcon from '@mui/icons-material/People';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';









// export const MainListItems= () =>{
  
//   const [user, setUser] = React.useState("");

  
//   React.useEffect(()=>{

//     const userData = localStorage.getItem("RightsTitle") && JSON.parse(localStorage.getItem("data"))
//       if (localStorage.getItem("token") && localStorage.getItem("data")){
//         setUser(userData);
//         console.log(user)
//       }
//   },[])
  

// return (
  

//   [
   
//     {
//       text: 'User Register',
//       icon: <PeopleIcon />,
//       path: '/'
//     },
//     {
//       text: 'Admin Report',
//       icon: <AssessmentIcon />,
//       path: '/adminreport'
//     },
//     {
//       text: 'Holiday Register',
//       icon: <AppRegistrationIcon />,
//       path: '/holidayRegistration'
//     },
//     {
//       text: 'Daily Attendence',
//       icon: <AssignmentTurnedInIcon />,
//       path: '/dailyattendence'
//     },
//     {
//       text: 'Mail Setup',
//       icon: <MailOutlineIcon />,
//       path: '/mailsetup'
//     },
//     {
//       text: 'Change Password',
//       icon: <LockOutlinedIcon />,
//       path: '/changepassword'
//     }
//   ]
// );

// }