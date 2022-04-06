import { Table, TableBody, TableCell, TableHead, TableRow, makeStyles, Button, Typography } from "@material-ui/core";
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { Box } from "@mui/system";

import axios from 'axios';





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


const AllUsers = () =>{
    
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
    
  
   console.log(users, "<-------")


    return (
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
                         
                     
                         <TableCell>
                         <Typography color="textSecondary" variant="body1" fontWeight="400">
                                <Button
                                  variant="contained"
                                  color="secondary"
                                //   startIcon={<EditIcon />}
                                //   onClick={() => openModaledit(user._id)}
                                >
                                  Edit
                                </Button>
                                </Typography>
                         </TableCell>
                         </TableRow>
                    ))
                }
            </TableBody>
        </Table>
       
    );
}

export default AllUsers;