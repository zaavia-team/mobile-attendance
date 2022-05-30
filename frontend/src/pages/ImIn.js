import { alertTitleClasses, Button, Container, Grid, TextField } from '@mui/material'
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
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


export default function ImIn() {

    const [form, setForm] = React.useState({ date: new Date().toLocaleString(), TransactionType: "", ManualEntry: false, EarlyReason: "" })
    const [button, setButton] = React.useState("i am In");
    const [list, setList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [message, SetMessage] = React.useState({ value: "", type: "" });
    const [openBackdrop, setopenBackdrop] = React.useState(false);
    const [TakenIn, setTakenin] = React.useState([]);
    const [WorkingHours, setWorkingHours] = React.useState("");
    const [Reason, setReason] = React.useState(false);
    const [val, setval] = React.useState(true);
    const [openModel, setOpenModel] = React.useState(false);
    const [agree, setAgree] = React.useState(false);





  

    const handleCloseModel = () => setOpenModel(false);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


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

    // if(button == "i am In"){
    //     setOpenModel(false)
    // }

    useEffect(() => {
        setOpen(true)
        setopenBackdrop(!openBackdrop);

        // const value = localStorage.getItem("value")  
        // setButton(value);
        const token = localStorage.getItem("token")
        let user = localStorage.getItem("data")

        axios.get('/api/gettodayattendance',
            { headers: { "Authorization": `${token}` } }
        )
            .then(function (response) {
                SetMessage({ value: "Success", type: "success" })
                if (user && user) {
                    user = JSON.parse(user);
                    if (user.data?.data && user.data?.data?._id) {
                        if (response.data?.data?.find(usr => usr.UserID === user.data?.data?._id)) {

                            setButton("I am out")
                        }
                    }
                }
                handleCloseBackdrop();
                setWorkingHours(user.data.data.WorkingHours)
                setList(response?.data?.data)
                setTakenin(response?.data?.data[0].TakenIn)
            })

    }, [])


    const handleSignInAndOut =() =>{
        

        const token = localStorage.getItem("token")
        setReason(true)
        setopenBackdrop(!openBackdrop);

        let data1 = {
            Date: form.date,
            TransactionType: button,
            ManualEntry: form.ManualEntry,
        }

        axios.post('/api/attendance_transaction', { ...data1, EarlyReason: form.EarlyReason },
            { headers: { "Authorization": `${token}` } }
        )
            .then(function (response) {
                console.log(response.data.message, "Response")
                if (response.data.status === true) {
                    SetMessage({ value: response.data.message, type: "success" })
                    setButton("i am Out")

                } else {
                    SetMessage({ value: response.data.message, type: "warning" })
                }


                axios.get('/api/gettodayattendance',
                    { headers: { "Authorization": `${token}` } }
                )
                    .then(function (response) {
                        // SetMessage({ value: "Success", type: "success" })
                        // handleCloseBackdrop();
                        setTakenin(response?.data?.data[0].TakenIn)
                        setList(response?.data?.data)

                    })
                handleCloseBackdrop();
            })
            handleCloseModel()
    }


    const handleSubmit = () => {
        let msg;
        setOpen(true)
        setval(true)
        if (button == "i am In"){
            setval(false)
        }
        
        const token = localStorage.getItem("token")
        localStorage.setItem("value", button)
        
        let dt1 = new Date(TakenIn.toLocaleString())
        let dt2 = new Date(form.date)
        
        const diff = diff_hours(dt1, dt2);
        console.log("Difference", diff);
        
        function diff_hours(dt2, dt1) {
            var diff = (dt2 - dt1) / 1000;
            diff /= (60 * 60);
            return Math.abs(Math.round(diff));
        }
        
        
        if (diff < WorkingHours) {
            // msg = prompt("Reason for early sogn out")
            setOpenModel(true);
            setAgree(true)

            // if (msg === null) {
            //     return
            // } else {
            //     setOpenModel(true);
            //     setReason(msg)
            // }
        } else {
            handleSignInAndOut()
            setOpenModel(true);
            console.log("LOGOUT")
            
        }

        // let data1 = {
        //     Date: form.date,
        //     TransactionType: button,
        //     ManualEntry: form.ManualEntry,
        // }

        // axios.post('/api/attendance_transaction', { ...data1, EarlyReason: msg },
        //     { headers: { "Authorization": `${token}` } }
        // )
        //     .then(function (response) {
        //         console.log(response.data.message, "Response")
        //         if (response.data.status === true) {
        //             SetMessage({ value: response.data.message, type: "success" })
        //             setButton("i am Out")

        //         } else {
        //             SetMessage({ value: response.data.message, type: "warning" })
        //         }


        //         axios.get('/api/gettodayattendance',
        //             { headers: { "Authorization": `${token}` } }
        //         )
        //             .then(function (response) {
        //                 // SetMessage({ value: "Success", type: "success" })

        //                 // handleCloseBackdrop();

        //                 setTakenin(response?.data?.data[0].TakenIn)

        //                 setList(response?.data?.data)

        //             })
        //         // handleCloseBackdrop();
        //     })

    }

    const handleChange = (newValue) => {
        // setForm({...form, [e.target.name]: e.target.value} )
        setForm({ date: newValue, ManualEntry: true })
    }

    const handleChangeOne = (e) =>{
        setForm({...form, [e.target.name]: e.target.value} )

    }

    const classes = useStyles();



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
                            sx={{ ml: 3, width: 150 }}
                            value={form.date}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2} >
                        <Button
                            sx={{ ml: 3, width: 150 }}
                            variant="contained"
                            name="TransactionType"
                            color={button === "i am In" ? "secondary" : "primary"}
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
                                    <TableCell>{atten?.UserName}</TableCell>
                                    <TableCell>{new Date(atten?.TakenIn).toLocaleString()}</TableCell>


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

                <div>
                    <Modal
                        open={ val == true ? openModel : openModel == false }
                        onClose={handleCloseModel}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                          {agree == false &&  <Typography id="modal-modal-title" variant="h6" component="h2">
                                Are you sure you want to sign out
                            </Typography>}
                            {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                            </Typography> */}
                           {agree == true && <TextField onChange={handleChangeOne} name="EarlyReason" value={form.EarlyReason} label="Early Reason"  fullWidth  variant="outlined" />}
                        <Button  onClick={handleSignInAndOut}>YES</Button>
                        <Button  onClick={ handleCloseModel}>No</Button>
                        </Box>
                    </Modal>
                </div>

            </Container>
        </LocalizationProvider>
    )


}
