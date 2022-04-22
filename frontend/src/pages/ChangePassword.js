import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Container } from '@material-ui/core';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';







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
        console.log(userDa.data.data._id,"userDa.data.data._id")
        setForm({...form, _id: userDa.data.data._id })
        console.log(form,"form")
        
        e.preventDefault();
        if (form.new_password && form.confirm_password && form.old_password) {
            if (form.new_password.length >= 8 && form.confirm_password.length >= 8) {
                if (validatePassword(form.new_password) && validatePassword(form.confirm_password)) {
                    if (form.new_password === form.confirm_password) {
                        
                        const data ={
                            oldPassword: form.old_password,
                            newPassword: form.new_password,
                            _id: userDa.data.data._id
                          }


                        axios.post(api, data,
                            { headers: { "Authorization": `${token}` } })
                            .then(res => {
                                    
                                 SetMessage({value: "Successfuly Changed", type:"success"})
                                 setForm({ ...form, old_password: '', new_password: '', confirm_password: '' })

                                }
                                )
                                .catch(err => {
                                    console.log(err, "err")
                                })
                            
                            
                            


                    }
                    else {
                     SetMessage({value: "Password does not match", type:"error"})

                      
                    }
                }
                SetMessage({value: "Password criteria does not match", type:"error"})

                
            } else {
                SetMessage({value: "Password must be more than or is equals to 8 characters", type:"error"})

                
            }
        } else {
            SetMessage({value: "Please fill all required fields", type:"error"})

         
        }
    }



    return (
        <ThemeProvider theme={theme}>   
                <Container component="main" maxWidth="xs" >
            <Box  sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
      
            <h1>Change Password</h1>
         
                    <TextField
                        margin="normal"
                        variant="outlined"
                        label="Old Password"
                        name="old_password"
                        value={form.old_password}
                        onChange={handleChange}
                        sx={{ mr: 2, mt: 1, mb:1 }}
                        
                    />
                    <TextField
                        margin="normal" 
                        variant="outlined"
                        label="New Password"
                        name="new_password"
                        value={form.new_password}
                        onChange={handleChange}
                        sx={{ mr: 2, mt: 1 }}
                        
                    />
                    <TextField
                        margin="normal"
                        variant="outlined"
                        label="Confirm Password"
                        name="confirm_password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        
                        sx={{ mr: 2, mt: 1 }}
                        
                    />

                    <Button 
                    type="submit"
                   
                    variant="contained"
                    color="secondary"
                    onClick={submitHandler}
                    sx={{ mt: 3, mb: 2 }}
                        
                    >Change Password</Button>


        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
          {message.value}
        </Alert>
       </Snackbar>


        </Box>
        </Container>
       </ThemeProvider>

    );
};

export default ChangePassword;
