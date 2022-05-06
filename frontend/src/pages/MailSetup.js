import React, { useEffect } from "react"
import Paper from '@mui/material/Paper';
import { Box, TextField, MenuItem, IconButton } from "@mui/material";
import { Save } from "@mui/icons-material";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import MuiAlert from '@mui/material/Alert';



function MailSetup(props) {
    const [formData, setFormData] = React.useState({ HOST: 'Gmail', USERID: '', Password: '', senderName: '' , PORT:""});
    const [bool, SetBool] = React.useState(false);
    const [mailID, setMailID] = React.useState();
    const [userData, setUserData] = React.useState({})
    const [mailSetup, setMailSetup] = React.useState({})
    const [openBackdrop, setopenBackdrop] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [message, SetMessage ] = React.useState({value: "", type:""});



    useEffect(()=>{
        const token = localStorage.getItem("token") 

        axios.get('/api/GetMailSetup',{ headers: { "Authorization": `${token}` } } )
            .then(function (response) {
                handleCloseBackdrop();
                if(response?.data?.data && response.data.data?._id)
                setFormData({senderName: response.data.data.SenderName,
                    HOST: response.data.data.HOST,
                    USERID:  response.data.data.Email,
                    Password: response.data.data.Password,
                    PORT: response.data.data.PORT,
                    _id : response.data.data._id
                
                })
                console.log(response, "response")
                
                SetMessage({ value: "Successfully get", type: "success" })
            })
            .catch(function (error) {
                console.log(error);
                handleCloseBackdrop();

            });
    },[])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        SetMessage({})
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });
      

    const handleCloseBackdrop = () => {
        setopenBackdrop(false);
      };

    const changeHandler = (event, name) => {
        setFormData({ ...formData, [name]: event.target.value })
    }

    const onSave = () => {
        
        // console.log(formData);
        const token = localStorage.getItem("token") 
        if (!formData.HOST || !formData.Password || !formData.USERID || !formData.senderName) {
            props.openSnackbar("Please Enter Details", 'error')
            return;
        }
        if (formData.HOST === "Others" && !formData.hasOwnProperty('PORT') && !formData.PORT) {
            props.openSnackbar("Please Enter PORT", 'error')
            return;
        }
        if (mailSetup && Object.keys(mailSetup).length > 0) {
            let formCopy = { ...formData, _id: formData._id }
            if (formData.HOST === "Gmail") delete formCopy.PORT;

        } else {
            let formCopy = { ...formData, _id: formData._id };
            if (formData.HOST === "Gmail") delete formCopy.PORT;
        }

        setOpen(true);
        console.log(mailID,"mailID")
        if(!formData._id && !mailID && formData.senderName && formData.HOST && formData.USERID && formData.Password)
        {
            const data = {
                senderName: formData.senderName,
                HOST: formData.HOST,
                USERID: formData.USERID,
                PORT : formData.PORT || null, 
                Password: formData.Password
            }

            axios.post('/api/CreateMailSetup', data,
            { headers: { "Authorization": `${token}` } }
            )
                .then(function (response) {
                    handleCloseBackdrop();
                    setMailID(response.data.data?._id)
                    console.log(response, "response")
                    SetMessage({ value: "Successfully saved", type: "success" })
                })
                .catch(function (error) {
                    console.log(error);
                    handleCloseBackdrop();

                });
        }

        if( formData._id ||  mailID && formData.senderName && formData.HOST && formData.USERID && formData.Password)
        {
            const data = {
                senderName: formData.senderName,
                HOST: formData.HOST,
                USERID: formData.USERID,
                Password: formData.Password,
                PORT : formData.PORT || null,
                _id: formData._id
            }

            axios.post('/api/UpdateMailSetup', data,
            {headers: { "Authorization": `${token}` }}
            )
                .then(function (response) {
                    handleCloseBackdrop();
                    console.log(response, "response")


                    SetMessage({ value: "Successfully Update", type: "success" })
                })
                .catch(function (error) {
                    console.log(error);
                    handleCloseBackdrop();

                });
        }else{
            SetMessage({ value: "Add some values", type: "error" })
        }

        

    }

    useEffect(() => {
        setUserData(JSON.parse(localStorage.getItem('userData')));
        if (props.mailSetup && Object.keys(props.mailSetup).length === 0) {
            props.getMailSetup()
        }
        if (props.mailSetup && Object.keys(props.mailSetup).length > 0) {
            // console.log("props.mailSetup " , props.mailSetup)
            props.mailSetup.PORT && SetBool(true)
            setMailSetup(props.mailSetup)
            setFormData({_id :  "", HOST: props.mailSetup.HOST, USERID: props.mailSetup.UserID, Password: props.mailSetup.Password, senderName: props.mailSetup.SenderName, PORT: props.mailSetup.PORT || '' })
        }
    }, [props.mailSetup])
    return (
        <Box marginTop={2}>
            <Paper style={{ padding: "20px", width: "50%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }} elevation={3}>
                <TextField value={formData.senderName || ''} onChange={event => changeHandler(event, 'senderName')} id="senderName" label="Sender Name" variant="outlined" />
                <Box mb="10px" />
                <TextField
                    id="filled-select-currency"
                    select
                    label="Please select Host"
                    value={formData.HOST || 'Gmail'}
                    onChange={(event => {
                        setFormData({ ...formData, HOST: event.target.value })
                        if (event.target.value === "Others") {
                            SetBool(true)
                        } else {
                            SetBool(false)
                        }
                    })}
                    variant="outlined"
                >
                    {[{ value: 'Gmail', label: 'Gmail' }, { value: 'Others', label: 'Others' }]
                    .map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))
                    }
                </TextField>
                <Box mb="10px" />
                {formData.HOST !== "Gmail" && (<><TextField value={formData.PORT || ''} id="PORT"
                    onChange={event => setFormData({ ...formData, PORT: event.target.value })} label="PORT" variant="outlined" /><Box mb="10px" /></>)}
                <TextField value={formData.USERID || ''} autoComplete="off" onChange={event => changeHandler(event, 'USERID')} id="USERID" label="User ID" variant="outlined" />
                <Box mb="10px" />
                <TextField value={formData.Password} autoComplete="off" onChange={event => changeHandler(event, 'Password')} id="Password" type="password" label="Password" variant="outlined" />
                <Box mt="10px" margin="auto">
                    <IconButton onClick={onSave} size="medium" color="primary">
                        <Save fontSize="large" />
                    </IconButton>
                </Box>
            </Paper>

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

        </Box>
    )
}

export default MailSetup;