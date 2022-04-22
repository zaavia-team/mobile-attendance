const user_repo = require('../repository/user_repo');
const uuid = require('uuid').v1;
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res) => {
    try {
        const login_id = req.body.Login_ID;
        const password = req.body.Password;

        const user = await user_repo.find({ Login_ID: login_id }, true, true, {});

        if (!user) {

            res.send({ status: false, message: 'User id or password does not match!' });
        }
        else if (!user.authenticate(password)) {

            res.send({ status: false, message: 'User id or password does not match!' });
        }
        else if (req.body.IsWeb) {
            const checkAdmin = user.RightsTitle.find((title) => title === 'Admin' )
            console.log(checkAdmin,"------")
            if(!checkAdmin) {
                
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
    user_repo.find({ _id:req.body?._id }, true, true, {})
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