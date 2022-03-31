const Jwt = require('jsonwebtoken');
const UserRepo = require("../repository/user_repo");


let allowed_to_all_authorized_users = [
    "/api/user/changePassword",
    "/api/branch/getAllBranch",
    "/api/section/getAllSections/:BranchID?",
];

let unrestricted_routes = [
    "/api/user/login",
    "/api/user/createAdminUser",
    "/api/user/send_email_forgot_password",
    "/api/user/send_email_forgot_password"  
];
exports.authMiddleware = function(req, res, next){
    let token = req.get('Authorization');
    console.log("token",token)
    if(token){

        try {
            var decoded = Jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded._id",decoded)
            if(decoded.UID){
                
                let query =  { Login_JWT_Token_ID : decoded.UID };
                UserRepo.find(query , true).then(function (data) {       
                    console.log("data auth" , data)
                    if(data){
                        req.user = data;
                        next()
        
                    }
                    else {
                        res.status(401).send({ status : false, message : "Not Authorized" });
                    }
                }, function(err){
                    res.status(401).send({ status : false, message : "Not Authorized", error : err });
                });
            }
            
        } catch (error) {
            res.status(401).send({ status : false, message : "Not Authorized" });
        }


    } 
    else {
        res.status(401).send({ status : false, message : "Not Authorized" });
    }
}