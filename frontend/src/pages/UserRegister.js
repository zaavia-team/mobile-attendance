import * as React from 'react';
import * as startOfDay from "date-fns";
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
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import axios from 'axios';
import AllUsers from '../components/AllUsers';




const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

export default function UserRegister() {


  const [open, setOpen] = React.useState(false);
  const [message, SetMessage] = React.useState({ value: "", type: "" });
  const [form, setForm] = React.useState({ FirstName: "", LastName: "", Password: "", Email: "", Login_ID: "", Designation: "", DateOfBirth:"", WorkingHours:"", DateOfJoining:"", PhoneNumber:"", NIC:"" });
  const [isValid, setIsValid] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const emailRegex = /\S+@\S+\.\S+/;

  const handleClick = (event) => {


    setForm({ ...form, [event.target.name]: event.target.value })

  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    SetMessage({})

  };




  const handleSubmit = (event) => {
    setOpen(true);

    event.preventDefault();



    if (form.FirstName && form.LastName && form.Password && form.Email && form.Login_ID && form.Designation && form.DateOfBirth && form.WorkingHours && form.DateOfJoining  && form.PhoneNumber && form.NIC) {

      const email = form.Email;
      if (emailRegex.test(email)) {
        setIsValid(true);

        const data = {
          FirstName: form.FirstName,
          LastName: form.LastName,
          Password: form.Password,
          Email: form.Email,
          Login_ID: form.Login_ID,
          Designation: form.Designation,
          DateOfBirth: form.DateOfBirth,
          WorkingHours: form.WorkingHours,
          DateOfJoining: form.DateOfJoining,
          PhoneNumber: form.PhoneNumber,
          NIC: form.NIC

        }

        const api = '/api/register';
        const token = localStorage.getItem('token');

        axios.post(api, data,
          { headers: { "Authorization": `${token}` } })
          .then(function (response) {
            console.log(response);

            SetMessage({ value: "Successfuly Registered", type: "success" })
            setForm({ FirstName: "", LastName: "", Password: "", Email: "", Login_ID: "", Designation: "", DateOfBirth:"", WorkingHours:"", DateOfJoining:"", PhoneNumber:"", NIC:""   })
            handleclose();
          })
          .catch(function (error) {
            console.log(error);
          });

      } else {
        setIsValid(false);
        SetMessage({ value: "'Please enter a valid email!'", type: "error" })
      }

    } else {
      SetMessage({ value: "Please Enter Required fields", type: "error" })

    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  const handleOpen = () => setOpenModal(true);
  const handleclose = () => setOpenModal(false);

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <Grid container justifyContent="flex-end"  >
        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" color="secondary" onClick={handleOpen}>Employee Registration</Button>
        </Box>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleclose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{

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
              <Box sx={{ mt: 3 }}>
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
                  <Grid item xs={12} sm={12}>
                    <TextField
                      type='number' 
                      required
                      fullWidth
                      id="NIC"
                      label="NIC"
                      name="NIC"
                      value={form.NIC}
                      onChange={handleClick}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type='number' 
                      required
                      fullWidth
                      id="PhoneNumber"
                      label="PhoneNumber"
                      name="PhoneNumber"
                      value={form.PhoneNumber}
                      onChange={handleClick}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type='number' 
                      required
                      fullWidth
                      id="WorkingHours"
                      label="WorkingHours"
                      name="WorkingHours"
                      value={form.WorkingHours}
                      onChange={handleClick}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <TextField
                    id="date"
                    label="Date of Birth"
                    type="date"
                    name="DateOfBirth"
                    value = {form.DateOfBirth}
                    onChange={handleClick}
                    sx={{ width: 190 }}

                    
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                  <TextField
                    id="date"
                    label="Date of Joining"
                    type="date"
                    name="DateOfJoining"
                    value = {form.DateOfJoining}
                    onChange={handleClick}

                    sx={{ width: 190 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
        </Box>
      </Modal>
      <AllUsers />
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
          {message.value}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}