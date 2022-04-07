import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, makeStyles } from "@material-ui/core";
import {useState, useEffect} from 'react';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const theme = createTheme();

const useStyles = makeStyles ({
  table: {
      width :"100%",
      margin: ' 50px 0 0 50px'
  },
  thead:{
      '& > *' :{
          background : 'rgb(156 39 176)'  ,
          color: '#fff',
          fontsize: 20
      }
  }
})

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

  const classes = useStyles();
    
  const [users, setUsers] = useState([]);
  
  
  useEffect(() => {
      axios.get('/api/users')
      .then(function (response) {
          setUsers(response.data)
      })
      .catch(function (error) {
          // handle error
          console.log(error);
      })
      .then(function () {
          // always executed
      });
      
  }, [])




  const handleSubmit = (event) => {
    setOpen(true);
    event.preventDefault();
    if (form.FirstName && form.LastName && form.Password && form.Email && form.Login_ID && form.Designation
       && form.DateOfBirth && form.WorkingHours && form.DateOfJoining  && form.PhoneNumber && form.NIC) {

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

        let api = '/api/register';
        // const apiEdit = `/api/user/${form._id}`;

        if (form._id && form.FirstName){
          api =  `/api/user/${form._id}`

          const data = {
            FirstName: form.FirstName,
            LastName: form.LastName,
            Email: form.Email,
            Designation: form.Designation,
            DateOfBirth: form.DateOfBirth,
            WorkingHours: form.WorkingHours,
            DateOfJoining: form.DateOfJoining,
            PhoneNumber: form.PhoneNumber,
            NIC: form.NIC
          }
  
          axios.put(api, data)
          .then(response => {
            SetMessage({ value: "Successfuly Updated", type: "success" })
            setForm({ FirstName: "", LastName: "", Password: "", Email: "", Login_ID: "", Designation: "", DateOfBirth:"", WorkingHours:"", DateOfJoining:"", PhoneNumber:"", NIC:""   })
            handleclose();
          });

        }

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
    boxShadow: 24,
    p: 4,
  };


  const handleOpen = () => setOpenModal(true);
  const handleclose = () => 
  {
    setForm({})
  setOpenModal(false);
}
  const openModaledit = (userObj) => {
    
    
    setForm({...userObj,DateOfBirth:new Date(userObj.DateOfBirth).toISOString().slice(0, 10), 
      DateOfJoining:new Date(userObj.DateOfJoining).toISOString().slice(0, 10),
    })

    handleOpen()
    
  }

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
                    display   
                    sx={{ width: 190 }}
                    InputLabelProps={{
                      shrink: true,
                      required: true
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


                 { !form._id && <Grid item xs={12}>
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
                  </Grid>}

                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  sx={{ mt: 3, mb: 2 }}
                >
                 {form._id? "Update" : "Register"}
                </Button>

              </Box>
            </Box>
          </Container>
        </Box>
      </Modal>

      {/* ---------------------- All Users ----------------------- */}
      <Table className = {classes.table}>
            <TableHead>
                <TableRow className = {classes.thead}>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>E-Mail</TableCell>
                    <TableCell>Working Hours</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    users.data?.map(user =>(
                        
                        <TableRow key={user._id}>
                         <TableCell>{user.FirstName }</TableCell>
                         <TableCell>{user.LastName}</TableCell>
                         <TableCell>{user.Login_ID}</TableCell>
                         <TableCell>{user.Email}</TableCell>
                         <TableCell>{user.WorkingHours}</TableCell>
                         
                     
                        { <TableCell>
                         <Typography color="textSecondary" variant="body1" fontWeight="400">
                                <Button
                                  variant="contained"
                                  color="secondary"
                                //   startIcon={<EditIcon />}
                                  onClick={() => openModaledit(user)}
                                >
                                  Edit
                                </Button>
                                </Typography>
                         </TableCell>}

                         </TableRow>
                    ))
                }
            </TableBody>
        </Table>
      

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
          {message.value}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}