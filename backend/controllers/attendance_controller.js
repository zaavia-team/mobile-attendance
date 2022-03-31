const attendance_repo = require('../repository/attendance_repo');

module.exports.attendance = async (req, res) => {
    console.log('sgasdag')
    const DateStr = new Date(req.body.Date);
    const TransactionType = req.body.TransactionType;
    try {
        console.log('sgsahfdsk' , req.body)
        if(TransactionType == 'i am In') {
            attendance_repo.create({
                UserID: req.user._id,
                TransactionType: TransactionType,
                TakenIn:DateStr,
                Date: {
                    Month: DateStr.getMonth(),
                    Day: DateStr.getDate(),
                    Year: DateStr.getFullYear() ,
                },
                UserName: req.user.Login_ID,
                ActionDetails: {
                    ActionTakenByName: req.user.FirstName + ' ' + req.user.LastName,
                    ActionTakenByID: req.user._id,
                    ActionTakenOn: new Date(),
                    ActionTakenByLoginID: req.user.Login_ID,
                },
            })
            .then(attendance => {
                console.log("attendance " , attendance)
                res.send({ status: true, Data: attendance })
            })
            .catch(error => {
                console.log(error)
                res.send({status:false, err:error.message})
            })

        }
        if(TransactionType == 'i am Out'){
            let query = { 
                TakenIn : { $exists: true },
                "Date.Month": DateStr.getMonth(),
                "Date.Day" : DateStr.getDate(),
                "Date.Year" : DateStr.getFullYear()
            };
            let updatequery = {
                $set: {TakenOut: DateStr }
            }
            attendance_repo.updateOne(query,updatequery)
            .then(updateattendance => {
                console.log(updateattendance)
                if(updateattendance.modifiedCount > 0){
                    res.send({ status: true, message : "Sign Out Succesfully" })
                }
                else {
                    res.send({ status: false, message : "Please Sign In Before Sign Out" })
                }
            })
            .catch(error => {
                console.log(error)
                res.send({status:false, err:error.message})
            })
        }

    } catch (e) {
        console.log(e)
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


