import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {  Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { FormHelperText } from '@mui/material';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

export default function SignIn({setLoggedin}) {

  // const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const [message, SetMessage ] = React.useState({value: "", type:""});
  const [openBackdrop, setopenBackdrop] = React.useState(false);
  const [forgot, setForgot] = React.useState(false);
  const [form, setForm] = React.useState({email:"", NewPassword:"",ConfirmPassword:""});
  const paramsString1 = '';



  const handleClick = () => {
    setOpen(true);
  };

  const handleForgotClick = () =>{

    
    setForgot(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setOpen(false);
    SetMessage({})
  };
  
  const handleCloseBackdrop = () => {
    setopenBackdrop(false);
  };

  const handleChange = (e) =>{
    setForm({...form,[ e.target.name] : e.target.vale })
  }

 
  
  React.useEffect(()=>{
    const userData = localStorage.getItem("data") && JSON.parse(localStorage.getItem("data"))
      if (localStorage.getItem("token") && localStorage.getItem("data")){
        setLoggedin(true);
      }
  },[])


  

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'), 
      password: data.get('password'),
    });

    if(data.get('email') && data.get('password')){
      setopenBackdrop(!openBackdrop);

    axios.post('/api/login', {
      Login_ID: data.get('email'),
      Password: data.get('password'),
      IsWeb: true
    })
    .then(function (response) {
      handleCloseBackdrop();
      console.log(response);
      if(response.data.status ){
        response.data.token ? localStorage.setItem("token", response.data.token) :  console.log(response)
        localStorage.setItem("data", JSON.stringify(response))
        const token = localStorage.getItem("token")
        console.log("token", token )
        setLoggedin(true);
        SetMessage({value: "Login Success", type:"success"})
        handleCloseBackdrop();
      }else{
        SetMessage({value: response.data.message, type:"error"})
        handleCloseBackdrop();

      }
    })
    .catch(function (error) {
      console.log(error);
      handleCloseBackdrop();

    });
  }else{
    SetMessage({value: "Please Enter Some values", type:"warning"})

  }
  };

  return (
    <ThemeProvider theme={theme}>
     {forgot===false && <Container component="main" maxWidth="xs">
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleClick}
              sx={{ mt: 3, }}
            >
              Sign In
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="inherit"
              onClick={handleForgotClick}
              sx={{ mt: 2, mb: 2 }}
            >
              Forgot Password?
            </Button>
          </Box>
        </Box>
      </Container>
}


  { forgot &&   <Container component="main" maxWidth="xs">
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
            Reset Password
          </Typography>
          <Box  sx={{ mt: 1 }}>

            <FormHelperText >Enter Your Email </FormHelperText>
          <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
           
          
           
            <Button
              
              fullWidth
              variant="contained"
              color="inherit"
              onClick={handleForgotClick}
              sx={{ mt: 2, mb: 2 }}
            >
              Send Mail
            </Button>
          </Box>
        </Box>
      </Container>
      
      }


{ token &&   <Container component="main" maxWidth="xs">
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
            Reset Password
          </Typography>
          <Box  sx={{ mt: 1 }}>

            
            <TextField
              margin="normal"
              required
              fullWidth
              id="NewPassword"
              label="New Password"
              name="NewPassword"
              value={form.NewPassword}
              onChange= {handleChange}
              autoComplete="NewPassword"
              type="password"
              autoFocus
              shrink="false"
              
            />


            <TextField
              margin="normal"
              required
              fullWidth
              name="ConfirmPassword"
              label="Confirm Password"
              type="password"
              id="password"
              onChange= {handleChange}
              value={form.ConfirmPassword}
              autoComplete="current-password"
              autoFocus
              shrink="false"
            />
           
          
           
            <Button
              
              fullWidth
              variant="contained"
              color="inherit"
              onClick={handleForgotClick}
              sx={{ mt: 2, mb: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
      </Container>
      
      }





      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
          {message.value}
        </Alert>
       </Snackbar>

       <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}