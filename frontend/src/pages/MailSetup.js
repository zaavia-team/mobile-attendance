import React, { useEffect } from "react"
import Paper from '@mui/material/Paper';
import { Box, TextField, MenuItem, IconButton } from "@mui/material";
import { Save } from "@mui/icons-material";




function MailSetup(props) {
    const [formData, setFormData] = React.useState({ HOST: 'Gmail', USERID: '', Password: '', senderName: '' });
    const [bool, SetBool] = React.useState(false);
    const [userData, setUserData] = React.useState({})
    const [mailSetup, setMailSetup] = React.useState({})

    const changeHandler = (event, name) => {
        setFormData({ ...formData, [name]: event.target.value })
    }

    const onSave = () => {
        // console.log(formData);
        if (!formData.HOST || !formData.Password || !formData.USERID || !formData.senderName) {
            props.openSnackbar("Please Enter Details", 'error')
            return;
        }
        if (formData.HOST === "Others" && !formData.hasOwnProperty('PORT') && !formData.PORT) {
            props.openSnackbar("Please Enter PORT", 'error')
            return;
        }

        if (mailSetup && Object.keys(mailSetup).length > 0) {
            let formCopy = { ...formData, _id: mailSetup._id }
            if (formData.HOST === "Gmail") delete formCopy.PORT;

        } else {
            let formCopy = { ...formData, _id: mailSetup._id };
            if (formData.HOST === "Gmail") delete formCopy.PORT;
            props.saveMailSetup({ ...formCopy, OrganizationName: userData.OrganizationName, OrganizationID: userData.OrganizationID })
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
            setFormData({ HOST: props.mailSetup.HOST, USERID: props.mailSetup.UserID, Password: props.mailSetup.Password, senderName: props.mailSetup.SenderName, PORT: props.mailSetup.PORT || '' })
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
                    {[{ value: 'Gmail', label: 'Gmail' }, { value: 'Others', label: 'Others' }].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Box mb="10px" />
                {bool && (<><TextField value={formData.PORT || ''} id="PORT"
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
        </Box>
    )
}

export default MailSetup;