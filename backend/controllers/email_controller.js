const MailSetupRepo = require("../repository/email_repo");

exports.CreateMailSetup = (req, res) => {
    let ActionDetails = {
        ActionTakenByName: req.user.FirstName + " " + req.user.LastName,
        ActionTakenByID: req.user._id,
        ActionTakenOn: new Date(),
        ActionTakenByLoginID: req.user.LoginID,
        Designation : req.user.Designation
    };

    let mailSetupObj ={
        SenderName : req.body.senderName,
        HOST : req.body.HOST,
        CreationDetails: ActionDetails,
        Email: req.body.USERID,
        Password : req.body.Password
    };
    if(req.body.PORT){
        mailSetupObj["PORT"] = req.body.PORT
    }

    console.log(JSON.stringify(mailSetupObj))
    console.log(JSON.stringify(ActionDetails))

    MailSetupRepo.create(mailSetupObj).then((success) =>{
        const mailSetup = success
        if(mailSetup.HOST == "Gmail"){
            process.env.Email = mailSetup.UserID
            process.env.Password = mailSetup.Password
            process.env.Host = mailSetup.HOST
            process.env.SenderName = mailSetup.SenderName
            console.log("GMail " , mailSetup);
        }else{
            process.env.Email = mailSetup.UserID
            process.env.Password = mailSetup.Password
            process.env.Host = mailSetup.HOST
            process.env.Port = mailSetup.PORT
            process.env.SenderName = mailSetup.SenderName
            
        }
        res.status(200).json({status : true , data:success})
    }).catch(err =>{
        res.status(500).json({status : false,error  :err})
    })
    
};

exports.GetMailSetup  = (req, res) => {
    MailSetupRepo.find({}, true).then((success) =>{
        res.status(200).json({status : true, data:success})
    }).catch(err =>{
        res.status(500).json({status : false,error  :err})
    })

};

exports.UpdateMailSetup  = (req, res) => {
    let query = {_id : req.body._id};
    let update = {$set : {...req.body}};
    update["$set"]["Email"] = req.body.USERID
    update["$set"]["SenderName"] = req.body.senderName
    // delete update["$set"]["Email"]
    delete update["$set"]["_id"]
    if(update["$set"]["HOST"] === "Gmail"){
        update["$set"]['PORT'] = ""
    }
    else update["$set"]["PORT"] = req.body.PORT
    console.log(update, "update<----")
    console.log(query, "querye<----")
    MailSetupRepo.updateOne(query, update).then((success) =>{
        res.status(200).json({status : true , success})
    }).catch(err =>{
        console.log(err, "err")
        res.status(500).json({status : false,error  :err})
    })
    MailSetupRepo.find({}, true).then((success) =>{
        const mailSetup = success
        if(mailSetup.HOST == "Gmail"){
            process.env.Email = mailSetup.UserID
            process.env.Password = mailSetup.Password
            process.env.Host = mailSetup.HOST
            process.env.SenderName = mailSetup.SenderName
            console.log("GMail " , mailSetup);
        }else{
            process.env.Email = mailSetup.UserID
            process.env.Password = mailSetup.Password
            process.env.Host = mailSetup.HOST
            process.env.Port = mailSetup.PORT
            process.env.SenderName = mailSetup.SenderName
            
        }
        console.log("Set environment and update successfully");
    }).catch(err =>{
        console.log("update but not set in environment " , err);
    })

};