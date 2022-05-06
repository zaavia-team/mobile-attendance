import React from 'react'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, makeStyles, ListItem } from "@material-ui/core";
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function HolidayRegister() {

  const [form, setForm] = useState({ StartDate: "", EndDate: "", Type: "", OtherType:"" })
  const [open, setOpen] = useState(false);
  const [openBackdrop, setopenBackdrop] = useState(false);
  const [message, SetMessage] = useState({ value: "", type: "" });
  const [holiday, setHoliday] = useState();
  const [type, setType] = useState("Type");



  const useStyles = makeStyles({
    table: {
      width: "100%",
      margin: ' 50px 0 0 50px'
    },
    thead: {
      '& > *': {
        background: 'rgb(156 39 176)',
        color: '#fff',
        fontsize: 20
      }
    }
  })

  const token = localStorage.getItem('token');


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  const handleClick = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setType(event.target.value)
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


  useEffect(() => {
    const token = localStorage.getItem("token")
    setopenBackdrop(!openBackdrop);
    axios.get('/api/getreportholiday',
      { headers: { "Authorization": `${token}` } }
    )
      .then(function (response) {
        handleCloseBackdrop();
        console.log(response, "response")
        // response.data.filter((Users) => Users.Login_ID === "admin01")
        setHoliday(response.data)
      })
      .catch(function (error) {
        // handle error
        handleCloseBackdrop();
        console.log(error);
      })
      .then(function () {
        handleCloseBackdrop();
        // always executed
      });
  }, [])

  console.log(holiday, "Holiday")


  const handleHolidaySubmit = () => {
    setOpen(true)
    setopenBackdrop(!openBackdrop);
    const { Type, StartDate, EndDate, OtherType } = form
    if (  StartDate && EndDate && Type || OtherType) {
      if (StartDate <= EndDate) {
        const data = {
          Datestart: StartDate,
          Dateend: EndDate,
          TransactionType: Type,
          Title: "Holiday",
          OtherType: OtherType
        }
        axios.post('/api/holiday', data,
          { headers: { "Authorization": `${token}` } })
          .then(function (response) {
            SetMessage({ value: "Successfuly Registered", type: "success" })
            setForm({
              FirstName: "", LastName: "", Password: "", Email: "", Login_ID: "", Designation: "",
              DateOfBirth: "", WorkingHours: "", DateOfJoining: "", PhoneNumber: "", NIC: "",
              StartDate: "", EndDate: "", Type: "",OtherType:"", RightsTitle: []
            })

            axios.get('/api/getreportholiday',
              { headers: { "Authorization": `${token}` } }
            )
              .then(function (response) {
                handleCloseBackdrop();
                console.log(response, "response")
                // response.data.filter((Users) => Users.Login_ID === "admin01")
                setHoliday(response.data)
              })
              .catch(function (error) {
                // handle error
                handleCloseBackdrop();
                console.log(error);
              })
              .then(function () {
                handleCloseBackdrop();
                // always executed
              });

            handleCloseBackdrop();

          }).catch(function (error) {
            console.log(error)
          });
      } else {
        handleCloseBackdrop();
        SetMessage({ value: "Please Enter correct date", type: "error" })

      }

    } else {
      handleCloseBackdrop();
      SetMessage({ value: "Please Enter Required fields", type: "error" })
    }
  }
  const classes = useStyles();


  return (
    <Container >
      <Grid container justifyContent="center" alignItems="center" >
        <h1 >Holiday Registration</h1>
      </Grid>


      <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt: 1 }}>
        <Grid item xs={12} sm={2}>
          <TextField
            id="date"
            label="Start Date"
            type="date"
            name="StartDate"
            value={form.StartDate}
            onChange={handleClick}
            sx={{ mr: 2 }}
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

       
           <Grid item xs={12} sm={2}>
          <Select
           
            sx={{ mr: 2 , mt:3, width:150}}  
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={type}
            defaultValue={type}
            name="Type"
            // label="Type"
            onChange={handleClick}
          >
          
            <MenuItem value={"Type"}></MenuItem>
            <MenuItem value={"Eid Ul Fitr"}>Eid Ul Fitr </MenuItem>
            <MenuItem value={"Eid Ul Adha"}>Eid Ul Adha</MenuItem>
            <MenuItem value={"14 August"}>14 August</MenuItem>
            <MenuItem value={"23 March"}>23 March</MenuItem>
            <MenuItem value={"25 December"}>25 December</MenuItem>
            <MenuItem value={"Ashura"}>Ashura</MenuItem>
            <MenuItem value={"12 Rabi Awwal"}>12 Rabi Awwal</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
          <FormHelperText>Select Type</FormHelperText>
        </Grid>

        {form.Type==="Other" && <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            id="OtherType"
            label="Type"
            name="OtherType"
            sx={{ mr: 3 }}
            value={form.OtherType}
            onChange={handleClick}
          />
        </Grid >}

        <Grid item xs={12} sm={2}>
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



      {/* ---------------------- All Holidays----------------------- */}
      <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes.thead}>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            

          </TableRow>
        </TableHead>
        <TableBody>
          {
            holiday?.data?.map(holi => (
              <TableRow key={holi._id}>
                <TableCell>{holi?.Details }</TableCell>
                <TableCell>{`${holi._id.Date.Day} / ${holi._id.Date.Month} / ${holi._id.Date.Year}`}</TableCell>
               
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
