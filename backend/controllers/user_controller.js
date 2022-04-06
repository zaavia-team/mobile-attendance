const user_repo = require('../repository/user_repo');
const uuid = require('uuid').v1;
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res) => {
    console.log('sgasdag')
    console.log(req.body,"req")
    try {
        const login_id = req.body.Login_ID;
        const password = req.body.Password;
        console.log('sgsahfdsk')
        const user = await user_repo.find({ Login_ID: login_id }, true, true, {});
        console.log('sgsahfdsk', user)

        if (!user) {
        console.log('sg', user)

            res.send({ status: false, message: 'User id or password does not match!' });
        }
        else if (!user.authenticate(password)) {
        console.log('ff', user)

            res.send({ status: false, message: 'User id or password does not match!' });
        }
        else {
        console.log('fgb', user)

            const token = uuid();
            const assignJwt = jwt.sign({UID: token, expiresIn: "4h"}, process.env.JWT_SECRET);
            user_repo.updateOne({ _id: user._id }, { $set: { Login_JWT_Token_ID: token } }).then(upd => {
            });
            //   res.('token_zsup', fastify.jwt.sign(token));
            let user_to_send = user.toObject();
            res.send({ data: user_to_send, status: true, token: assignJwt, message: 'User Login Successfully!' });
        }
    } catch (e) {
        console.log("---------------")
        res.send({status : false , message : e.message});
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


