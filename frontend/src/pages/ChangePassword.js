import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Card, CardHeader, CardContent } from '@material-ui/core';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';







const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const theme = createTheme();

const ChangePassword = () => {
    const [form, setForm] = useState({ old_password: '', new_password: '', confirm_password: '', _id: "" });
    const [open, setOpen] = React.useState(false);
    const [message, SetMessage ] = React.useState({value: "", type:""});

    
    const userDa = localStorage.getItem("data") && JSON.parse(localStorage.getItem("data"));
    console.log(userDa.data.data._id, "USERDATA")
    
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        SetMessage({})
      };

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
       

    };

    const validatePassword = (pass) => {
        const reg = /(?=^.{8,12}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!*^?](?=.*[+-_@#$%&])/
        return reg.test(pass)
    }



    const submitHandler = (e) => {
        const api = "/api/ChangePassword"
        const token = localStorage.getItem('token');
        setOpen(true)
        
        e.preventDefault();
        if (form.new_password && form.confirm_password && form.old_password) {
            if (form.new_password.length >= 8 && form.confirm_password.length >= 8) {
                if (validatePassword(form.new_password) && validatePassword(form.confirm_password)) {
                    if (form.new_password === form.confirm_password) {
                        
                        axios.post(api,
                            { headers: { "Authorization": `${token}` } })
                            .then(res => {
                                setForm({ ...form, _id: userDa.data.data._id })
                            }
                            )
                            .catch(err => {
                                console.log(err, "err")
                            })
                            
                            
                            
                            setForm({ ...form, old_password: '', new_password: '', confirm_password: '' })
                            console.log(form);
                    }
                    else {
                     SetMessage({value: "Password does not match", type:"error"})

                      
                    }
                }
                SetMessage({value: "Invalid password", type:"error"})

                
            } else {
                SetMessage({value: "Password must be more than or is equals to 8 characters", type:"error"})

                
            }
        } else {
            SetMessage({value: "Please fill all required fields", type:"error"})

         
        }
    }



    return (
        <ThemeProvider theme={theme}>
        <Container>
            <h1>Change Password</h1>

            <Grid container spacing={3} justifyContent="center" alignItems="center"
            >
                <Grid item xs={12} sm={12} md={12} lg={12} >
                    <TextField

                        label="Old Password"
                        name="old_password"
                        value={form.old_password}
                        onChange={handleChange}
                        sx={{ mr: 2, mt: 1 }}
                        
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} >

                    <TextField
                        label="New Password"
                        name="new_password"
                        value={form.new_password}
                        onChange={handleChange}
                        sx={{ mr: 2, mt: 1 }}
                        
                    />

                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} >

                    <TextField
                        label="Confirm Password"
                        name="confirm_password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        
                        sx={{ mr: 2, mt: 1 }}
                        
                    />

                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} >

                    <Button 
                    type="submit"
                   
                    variant="contained"
                    color="secondary"
                    onClick={submitHandler}
                    sx={{ mt: 3, mb: 2 }}
                        
                    >Change Password</Button>

                </Grid>



            </Grid>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
          {message.value}
        </Alert>
       </Snackbar>


        </Container>
       </ThemeProvider>

    );
};

export default ChangePassword;
