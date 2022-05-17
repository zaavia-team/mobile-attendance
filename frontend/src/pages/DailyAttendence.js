import React from 'react'
import  { useState, useEffect } from 'react'
import { Container, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Button, TextField, Snackbar, Alert, Backdrop,InputLabel,ListItemText, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import TagsInput from '../components/TagsInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Select from '@mui/material/Select';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


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




export default function DailyAttendence() {

    const [form, setForm] = useState({startDate:"", endDate:"", UserID:[]});
    const [data, setData] = useState([])
    const [tags, setTags] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, SetMessage] = React.useState({ value: "", type: "" });
    const [openBackdrop, setopenBackdrop] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [personName, setPersonName] = React.useState([]);



    console.log(data, "data")

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(()=>{
    setopenBackdrop(!openBackdrop);


    axios.get('/api/users')
    .then(function (response) {

      console.log(response,"response")


      setUsers(response.data.data)
      handleCloseBackdrop();

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    
    handleCloseBackdrop();
  
  },[])

console.log(users, "users")
  const classes = useStyles();

  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name] : e.target.value})
  }

  const handleChangeName = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    setForm({...form,UserID : typeof value === 'string' ? value.split(',') : value}
      // On autofill we get a stringified value.
      
    );
    console.log("per",personName)
  };

  const handleCloseBackdrop = () => {
    setopenBackdrop(false);
  };

  function handleSelecetedTags(items) {
    setTags(items)
  }

  const HandleSearch = () =>{
    setOpen(true)
    setopenBackdrop(!openBackdrop);
    console.log(form,"-------")
    if (form.startDate && form.endDate && form.startDate <= form.endDate  ) {
      const api="/api/getreportattendance"
      const token = localStorage.getItem("token") 
      const data = {
        StartDate:form.startDate,
        EndDate:form.endDate,
        userIds:form.UserID
      }
        axios.post(api, data,
          { headers: { "Authorization": `${token}` } })
        .then(res=>{
            handleCloseBackdrop();
            SetMessage({ value: "successfully get data", type: "success" })
            setData(res.data?.data);
        }
        )
        .catch(err =>{
          handleCloseBackdrop();

            console.log(err, "err")
        })
      }
      else{
        SetMessage({ value: "Please Enter correct date", type: "error" })
        handleCloseBackdrop();
        
      }
  }
  return (
    <Container >
    <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt:1 }}>
      <h1 >Daily Attendence</h1>
      </Grid>
        <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt:1 }}>
    
          
            {/* <TextField
                      
                      id="UserId"
                      label="User Id"
                      name="UserId"
                      value={form.UserId}
                      onChange={handleChange}
                      sx={{ mr: 2, mt:1 }}
                      autoComplete="family-name"
                      /> */}


                      {/* -----------------for Select by user Name------------------ */}
                  {/* <Grid item xs={12} sm={3}>
                    <TagsInput
                      selectedTags={handleSelecetedTags}
                      label="User Name"
                      tags={tags}
                      sx={{ mr: 2, mt:4 }}
                      size="small"
                      variant="outlined"
                      id="UserID"
                      name="UserID"
                      inputValue={form.UserID}
                      helperText="please enter after typing Username."
                      />          
                                      
                  </Grid> */}

                <Grid item xs={12} sm={2}>
                  <InputLabel id="demo-multiple-checkbox-label">User Name</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    sx={{width:150}}
                    value={form?.UserID}
                    onChange={handleChangeName}
                    input={<OutlinedInput label="Role" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    
                  >
                    {users?.map((name) => (
                      <MenuItem key={name?.Login_ID} value={name?.Login_ID}>
                        
                        <Checkbox checked={form?.UserID?.indexOf(name?.Login_ID) > -1} />
                        <ListItemText primary={name?.Login_ID} />
                      </MenuItem>
                    ))
                    }
                  
                  </Select>
                </Grid>



           <Grid item xs={12} sm={2}>
            <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    sx={{ mr: 2, mt:1 }}
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
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    sx={{ mr: 2, mt:1 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />   
          </Grid>     
                <Button variant="contained" color="secondary" onClick={HandleSearch} sx={{ mr: 2, mt:1 }}>Search</Button>
           
        </Grid>

    <Grid container spacing={3} justifyContent="center" alignItems="center">
     <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes.thead}>
            <TableCell>User Name</TableCell>
            <TableCell>Sign in Time</TableCell>
            <TableCell>Sign out Time</TableCell>
            <TableCell>working hours</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {
            data?.map(user => (
              user.Details?.map(detail => (
                <TableRow key={detail._id}>
                  <TableCell>{detail.UserName}</TableCell>
                  <TableCell>{detail.TakenIn ? (new Date(detail.TakenIn).toLocaleString()) : "--" }</TableCell>
                  <TableCell>{detail.TakenOut ? (new Date(detail.TakenOut).toLocaleString()) : "--"}</TableCell>
                  <TableCell>{detail.HOUR ? detail.HOUR?.toFixed(2) : "--"}</TableCell>
                </TableRow>
              ))
            ))
            // data[0].Details?.map(user => (

            //   <TableRow key={user._id}>
            //     <TableCell>{user.UserName}</TableCell>
            //     <TableCell>{new Date(user.TakenIn).toLocaleString() }</TableCell>
            //     <TableCell>{new Date(user.TakenOut).toLocaleString()}</TableCell>
            //     <TableCell>{user.HOUR?.toFixed(2)}</TableCell>
            //   </TableRow>
            // ))
          }
        </TableBody>
      </Table> 
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
