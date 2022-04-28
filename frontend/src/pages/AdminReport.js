import React from 'react'
import SingleUser from '../components/SingleUser'
import  { useState, useEffect } from 'react'
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box,Button, TextField, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import TagsInput from '../components/TagsInput';

import axios from 'axios';





export default function AdminReport() {

    const [form, setForm] = useState({startDate:"", endDate:"", UserID:[]});
    const [data, setData] = useState([])
    const [tags, setTags] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, SetMessage] = React.useState({ value: "", type: "" });
  const [openBackdrop, setopenBackdrop] = React.useState(false);




  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name] : e.target.value})
  }

  const handleCloseBackdrop = () => {
    setopenBackdrop(false);
  };

  function handleSelecetedTags(items) {
    setTags(items)
  }

  const HandleSearch = () =>{
    setOpen(true)
    setopenBackdrop(!openBackdrop);
    
    if (form.startDate && form.endDate && form.startDate <= form.endDate  ) {
      const api="/api/getreportattendance"
      const token = localStorage.getItem("token") 
      const data = {
        StartDate:form.startDate,
        EndDate:form.endDate,
        // userIds:form.UserId
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
            console.log(err, "err")
        handleCloseBackdrop();

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
    <h1 >Admin Report</h1>
    </Grid>
        <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt:1 }}>
    
          
            {/* <TextField
                      
                      id="UserId"
                      label="User Id"
                      name="UserId"
                      value={form.UserId}
                      onChange={han dleChange}
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
                    // helperText="please enter after typing Username."
                    />          
                                      
                  </Grid> */}


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

    <Grid container spacing={3} justifyContent="center" alignItems="center"
    >

        {data.map((user => 
        <Grid item xs={12} sm={6} md={3} lg={4} key={user.id}>
           <SingleUser data={user} />
        </Grid>
        ))
        }
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


