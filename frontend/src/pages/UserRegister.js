import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';




const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

export default function UserRegister() {


  const [open, setOpen] = React.useState(false);
  const [message, SetMessage ] = React.useState({value: "", type:""});
  const [form, setForm] = React.useState({FirstName: "", LastName:"", Password:"", Email:"", Login_ID:"", Designation:""  });


  const handleClick = (event) => {
    setForm({...form  , [event.target.name] : event.target.value})
  };

  const   handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    SetMessage({})

  };




  const handleSubmit = (event) => {
    setOpen(true);

    event.preventDefault();
   
    
    
    if(form.FirstName && form.LastName && form.Password && form.Email && form.Login_ID){
      const data = {
        FirstName: form.FirstName,
        LastName: form.LastName,
        Password: form.Password,
        Email: form.Email,
        Login_ID: form.Login_ID
      }
      const api = '/api/register'; 
      const token = localStorage.getItem('token');
      
  axios.post(api, data,
    { headers: {"Authorization" : `${token}`}})
  .then(function (response) {
    console.log(response);
  
    SetMessage({value:"Successfuly Registered", type:"success"})
    setForm({FirstName: "", LastName:"", Password:"", Email:"", Login_ID:"", Designation:"" })
  })
  .catch(function (error) {
    console.log(error);
  });
}else{
  SetMessage({value:"Please Enter Required fields", type:"error"})

}

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Employee Registration 
          </Typography>
          <Box  sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="FirstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={form.FirstName}
                  onChange={handleClick}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="LastName"
                  value={form.LastName}
                  onChange={handleClick}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  value={form.Login_ID}
                  onChange={handleClick}
                  name="Login_ID"
                  autoComplete="family-name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="designation"
                  label="Designation"
                  name="Designation"
                  value={form.Designation}
                  onChange={handleClick}
                  autoComplete="family-name"
                />
              </Grid>
             
             
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="Email"
                  value={form.Email}
                  onChange={handleClick}
                  autoComplete="email"
                />
              </Grid>
              

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Password"
                  label="Password"
                  type="password"
                  value={form.Password}
                  onChange={handleClick}
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            
          </Box>
        </Box>
      </Container>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
          {message.value}
        </Alert>
       </Snackbar>
    </ThemeProvider>
  );
}