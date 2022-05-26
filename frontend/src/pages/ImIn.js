import { Button, Container, Grid, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow, makeStyles, ListItem } from "@material-ui/core";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';


export default function ImIn() {
    
    const [form, setForm] = React.useState({date:new Date().toLocaleString() , TransactionType:"", ManualEntry: false})
    const [button, setButton] = React.useState("i am In")
    const [list, setList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [message, SetMessage ] = React.useState({value: "", type:""});
    const [openBackdrop, setopenBackdrop] = React.useState(false);


    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });




    const handleCloseBackdrop = () => {
        setopenBackdrop(false);
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


const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    SetMessage({})
  };

useEffect(()=>{
    setOpen(true)
    
    // const value = localStorage.getItem("value")  
    // setButton(value);
    const token = localStorage.getItem("token")
    let user = localStorage.getItem("data")
    axios.get('/api/gettodayattendance',
    { headers: { "Authorization": `${token}` } }
        )
        .then(function (response) {
            SetMessage({ value: "Success", type: "success" })
            if(user && user){
                user = JSON.parse(user);
                if(user.data?.data && user.data?.data?._id){
                    if(response.data?.data?.find(usr => usr.UserID === user.data?.data?._id )){
                        setButton("I am out")
                    }
                }
            }
        // handleCloseBackdrop();
        console.log(response)


        setList(response?.data?.data)
        
        })
    
    },[])
    
    const handleSubmit = () =>{
         setOpen(true)

        setButton( button ==="i am In"?  "i am Out" : "i am In" )
        const token = localStorage.getItem("token")
        localStorage.setItem("value", button)  
        let data = {
            Date: new Date().toLocaleString(),
            TransactionType: button,
            ManualEntry: form.ManualEntry
        }
      
        

        axios.post('/api/attendance_transaction',data,
         { headers: { "Authorization": `${token}` } }
    )
      .then(function (response) {
          console.log(response.data.message, "Response")
        if(response.data.status === true){

            SetMessage({ value: response.data.message, type: "success" })
        }else{
            SetMessage({ value: response.data.message, type: "warning" })

        }

        axios.get('/api/gettodayattendance',
        { headers: { "Authorization": `${token}` } }
            )
            .then(function (response) {
                // SetMessage({ value: "Success", type: "success" })
              
            // handleCloseBackdrop();
            console.log(response)
    
    
            setList(response?.data?.data)
            
            })


        // handleCloseBackdrop();
        
        
      })
    
    }

const handleChange = (newValue) => {
    // setForm({...form, [e.target.name]: e.target.value} )
    setForm({date:newValue, ManualEntry: true})
    

    
}

   






const classes = useStyles();

const attendence = [
    {
        Name: 'Areeb',
        Time: '24-05-2022 11:13AM'
    },
    {
        Name: 'Ahmed',
        Time: '24-05-2022 11:13AM'
    },
]

return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container> 
            <Grid container justifyContent="center" alignItems="center">
                <h1>Attendence</h1>
            </Grid>
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt: 1 }}>
                <Grid item xs={12} sm={2}>
                    <DateTimePicker
                        label="Date&Time picker"
                        color="secondary"
                        name="date"
                        id="date"
                        sx={{ ml: 3, width:150 }}
                        value={form.date}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                        />
                </Grid>
                <Grid item xs={12} sm={2} >
                    <Button
                        sx={{ ml: 3, width:150 }}
                        variant="contained"
                        name="TransactionType"
                        color= {button === "i am In" ? "secondary" : "primary"}
                        onClick={handleSubmit}

                    >
                        {button}
                    </Button>
                </Grid>
            </Grid>


            <Table className={classes.table}>
            <TableHead>
            <TableRow className={classes.thead}>
                <TableCell>Name</TableCell>
                <TableCell>Time</TableCell>
                

            </TableRow>
            </TableHead>
            <TableBody>
            {
                list?.map(atten => (
                <TableRow key={atten?._id}>
                    <TableCell>{atten?.UserName }</TableCell>
                    <TableCell>{new Date(atten?.TakenIn).toLocaleString() }</TableCell>
                    
                
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
    </LocalizationProvider>
  )


}
