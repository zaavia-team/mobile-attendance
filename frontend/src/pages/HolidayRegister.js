import React from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, makeStyles, InputLabel, MenuItem, FormControl,Select, ListItem } from "@material-ui/core";
import { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

export default function HolidayRegister() {

    const [form, setForm] = useState({StartDate:"", EndDate:"", Type:"" })
    const [open, setOpen] = React.useState(false);
    const [openBackdrop, setopenBackdrop] = React.useState(false);
    const [message, SetMessage] = React.useState({ value: "", type: "" });




    const token = localStorage.getItem('token');


    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });


    const handleClick = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
      };

    const handleCloseBackdrop = () => {
    setopenBackdrop(false);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    SetMessage({})

  };

 

      
  const handleHolidaySubmit = () => {
    setOpen(true)
    setopenBackdrop(!openBackdrop);
    const { Type, StartDate, EndDate } = form
    if (Type && StartDate && EndDate) {
      if(StartDate <= EndDate){
      const data ={
        Datestart: StartDate,
        Dateend: EndDate,
        TransactionType: Type
      }
      axios.post('api/holiday', data ,  
      { headers: { "Authorization": `${token}` } })
      .then(function(response){
        SetMessage({ value: "Successfuly Registered", type: "success" })
        setForm({
          FirstName: "", LastName: "", Password: "", Email: "", Login_ID: "", Designation: "",
          DateOfBirth: "", WorkingHours: "", DateOfJoining: "", PhoneNumber: "", NIC: "",
          StartDate: "", EndDate: "", Type: "",RightsTitle:[]
        })
        
        handleCloseBackdrop();
        
      }).catch(function(error){
        console.log(error)
      });
    }else{
      SetMessage({ value: "Please Enter correct date", type: "error" })

    }

      }else{
        SetMessage({ value: "Please Enter Required fields", type: "error" })
      }
  }


  return (
     <Container >
            <Grid container justifyContent="center" alignItems="center" >
                 <h1 >Holiday Registration</h1>
            </Grid>
             
            
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt:1 }}>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="date"
                      label="Start Date"
                      type="date"
                      name="StartDate"
                      value={form.StartDate}
                      onChange={handleClick}
                      sx={{ mr: 2  }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="date"
                      label="End Date"
                      type="date"
                      name="EndDate"
                      value={form.EndDate}
                      onChange={handleClick}
                      display
                      sx={{ mr: 2 }}
                      InputLabelProps={{
                        shrink: true,
                        required: true
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}  sm={2}>
                    <TextField
                      fullWidth
                      id="Type"
                      label="Type"
                      name="Type"
                      sx={{ mr: 3 }}
                      value={form.Type}
                      onChange={handleClick}
                    />
                  </Grid>
                  <Grid item xs={12}  sm={2}>
                    <Button
                      type="submit"
                      sx={{ ml: 3 }}
                      variant="contained"
                      color="secondary"
                      onClick={handleHolidaySubmit}
                     
                    >
                      Register
                    </Button>
                  </Grid>

                </Grid>
             
           

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

          </Container>
  )
}
