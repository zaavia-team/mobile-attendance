import React from 'react'
import SingleUser from '../components/SingleUser'
import  { useState, useEffect } from 'react'
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box,Button, TextField } from '@mui/material';

import axios from 'axios';




export default function AdminReport() {

    const [data, setData] = useState([
        {Name:"Areeb", month:"January"},
        {Name:"Srmad", month:"January"},
        {Name:"Sharjeel", month:"January"}])

    // useEffect(() => {
    //     axios.get()
    //     .then(res=>{
    //         setData(res.data)
    //         console.log(res)
    //     }
    //     )
    //     .catch(err =>{
    //         console.log(err, "err")
    //     })
    // }, [])


  return (
    <Container >
    <h1>Admin Report</h1>
        <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6}>
                  
                  </Grid>
            <Box >
            <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    name="DateOfBirth"
                    sx={{ mr: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
            <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    name="DateOfBirth"
                    sx={{ mr: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />        
                <Button variant="contained" color="secondary"  >Search</Button>
            </Box>
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
</Container>
  )
}


