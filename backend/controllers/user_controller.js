const user_repo = require('../repository/user_repo');
const uuid = require('uuid').v1;
const jwt = require("jsonwebtoken");
const emailer = require('../services/mailer');

module.exports.login = async (req, res) => {
    try {
        const login_id = req.body.Login_ID;
        const password = req.body.Password;
        console.log("__")

        const user = await user_repo.find({ Login_ID: login_id, StatusCode: 1 }, true, true, {});

        if (!user) {

            res.send({ status: false, message: 'User id or password does not match!' });
        }
        else if (!user.authenticate(password)) {

            res.send({ status: false, message: 'User id or password does not match!' });
        }
        else if (req.body.IsWeb) {
            const checkAdmin = user_repo.find({ RightsTitle: { $in: ["Admin"] } })
            console.log(checkAdmin, "------")
            if (!checkAdmin) {

                res.send({ status: false, message: 'No rights to Access!' });
            }
            else {

                const token = uuid();
                const assignJwt = jwt.sign({ UID: token, expiresIn: "4h" }, process.env.JWT_SECRET);
                user_repo.updateOne({ _id: user._id }, { $set: { Login_JWT_Token_ID: token } }).then(upd => {
                });
                //   res.('token_zsup', fastify.jwt.sign(token));
                let user_to_send = user.toObject();
                res.send({ data: user_to_send, status: true, token: assignJwt, message: 'User Login Successfully!' });
            }

        }
        else {

            const token = uuid();
            const assignJwt = jwt.sign({ UID: token, expiresIn: "4h" }, process.env.JWT_SECRET);
            user_repo.updateOne({ _id: user._id }, { $set: { Login_JWT_Token_ID: token } }).then(upd => {
            });
            //   res.('token_zsup', fastify.jwt.sign(token));
            let user_to_send = user.toObject();
            res.send({ data: user_to_send, status: true, token: assignJwt, message: 'User Login Successfully!' });
        }
    } catch (e) {
        res.send({ status: false, message: e.message });
    }
}



module.exports.register = (req, res) => {
    user_repo.create(req.body)
        .then(user => {
            res.send({ Status: true, data: user })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}

module.exports.getUsers = (req, res) => {
    user_repo.find()
        .then(user => {
            res.send({ Status: true, data: user })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}

module.exports.editUser = async (req, res) => {

    try {
        _id = req.params.id
        FirstName = req.body.FirstName
        LastName = req.body.LastName
        Email = req.body.Email
        Designation = req.body.Designation
        DateOfBirth = req.body.DateOfBirth
        WorkingHours = req.body.WorkingHours
        DateOfJoining = req.body.DateOfJoining
        PhoneNumber = req.body.PhoneNumber
        NIC = req.body.NIC
        StatusCode = req.body.StatusCode
        RightsTitle = [];
        if (req.body.RightsTitle) {
            RightsTitle = req.body.RightsTitle;
        }

        const user = await user_repo.find({ _id: _id }, true, true, {});

        if (!user) {

            res.send({ status: false, message: `User doesn't exists!` });
        }
        else {
            const updUsr = await user_repo.updateOne({ _id: _id }, { $set: { FirstName, LastName, Email, Designation, WorkingHours, DateOfBirth, DateOfJoining, PhoneNumber, NIC, StatusCode, RightsTitle } })

            res.send({ data: updUsr, status: true, message: 'User Updates Successfully!' });
        }
    } catch (e) {
        res.send({ status: false, message: e.message });
    }
}

module.exports.ChangePassword = (req, res) => {
    user_repo.find({ _id: req.body?._id }, true, true, {})
        .then(user => {
            if (!user) {
                console.log("User not found!");
                return res.send({
                    message: "This login ID is not registered.",
                    status: false
                });
            }
            else {
                user.authenticate(req.body.oldPassword, function (
                    authError,
                    authenticated
                ) {
                    if (authError) {
                        console.log("authError->", authError);
                        return res.send(authError);
                    }
                    if (!authenticated) {
                        console.log("!authenticated");
                        return res.send({
                            message: "This password is not correct.",
                            status: false
                        });
                    } else {
                        console.log("Auth Successfull!!!");
                        user.Password = req.body.newPassword
                        user.save().then((success) => {
                            console.log('Password Changed Successfully!');
                            res.send({ status: true, message: 'Password changed!' })
                        }).catch(err => {
                            res.send(err);

                        })

                    }
                });
            }
        })
        .catch(err => {
            console.log("Error in Finding User: ", err);
            res.send(err);
        });

}


module.exports.ForgotPassword = async (req, res) => {
    try {
        let emailID = req.body.resetEmail;
        console.log("object", req.body)
        let user = await user_repo.find({ Email: emailID },true);
        if (user) {
            console.log(user, "------")
            const token = uuid();
            let EmailMessage =
            "Dear &nbsp;<u>" +
            user.FirstName +
            " " +
            user.LastName +
            "</u><br> We are sending this email to your request for reset the password in Attendance App" +
            "<br>" +
            "Please find below the link to reset your password!" +
            '<br><a href="';
            console.log(EmailMessage,"sgshgs")
            EmailMessage +=
                process.env.NODE_ENV === 'production' ? req.protocol + '://' + req.hostname + '/auth/change-password?token=' + token :
                    req.protocol + '://localhost:3001' + '/auth/change-password?token=' + token +
                    '">' +
                    'Reset Password' +
                    "</a>"
            console.log(EmailMessage,'some info')
            await user_repo.updateOne({ Email: emailID }, { $set: { Password_ResetToken: token, ForgotPasswordEmailSentTimeStamp: new Date() } })
            let email_to_send_for_reset = {
                To: emailID,
                Subject: 'Reset Email',
                message: EmailMessage

            };
            emailer.sendEmail(email_to_send_for_reset, emailID)
                .then(success => {
                    console.log('Email Sent: ', success);
                    res.send({ status: true, message: 'Email has been sent' });
                })
                .catch(err => {
                    console.log('Error in Email: ', err);
                    res.send({ status: true, message: 'Email could not be sent!' });
                });
        }
    } catch (e) {
        res.send(e);
    }
}



module.exports.ResetPassword = (req, res) => {
    try {
        console.log(req.body)
        let token = req.body.token;
        // let user = await user_repo.find({Password_ResetToken : token}, {$set: {Password_ResetToken: undefined,ForgotPasswordEmailSentTimeStamp:undefined}});
        user_repo.find({ Password_ResetToken: token }, true, true, null, null)
            .then(user => {
                console.log("Inside User Found!", user);
                if (!user) {
                    console.log("User not found!");
                    return res.send({
                        message: "Your Token is Expire or Not valid.",
                        status: false
                    });
                } else {
                    user.Password = req.body.new_password
                    user.Password_ResetToken = undefined
                    user.ForgotPasswordEmailSentTimeStamp = undefined
                    user.save().then((success) => {
                        console.log('Password Changed Successfully!');

                        res.send({ status: true, message: 'Password changed!' })
                    }).catch(err => {
                        res.send(err)
                    })
                }
            })
    }
    catch (e) {
        res.send(e);
    }
}


