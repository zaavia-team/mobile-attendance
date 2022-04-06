const attendance_repo = require('../repository/attendance_repo');

module.exports.attendance = async (req, res) => {
    console.log('sgasdag')
    const DateStr = new Date(req.body.Date);
    const TransactionType = req.body.TransactionType;
    try {
        console.log('sgsahfdsk', req.body);
        if (TransactionType == 'i am In') {
            const findAtt = await attendance_repo.find({
                "Date.Month": DateStr.getMonth(),
                "Date.Day": DateStr.getDate(),
                "Date.Year": DateStr.getFullYear(),
                TakenIn: { $exists: true },
                UserID: req.user._id
            }, true)
            console.log("findAtt ", findAtt)
            if (findAtt) return res.send({ status: false, message: "User Already Sign In", Data: findAtt })
            attendance_repo.create({
                UserID: req.user._id,
                TransactionType: TransactionType,
                TakenIn: DateStr,
                Date: {
                    Month: DateStr.getMonth(),
                    Day: DateStr.getDate(),
                    Year: DateStr.getFullYear(),
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
                    console.log("attendance ", attendance)
                    res.send({ status: true, message: "Sign In Succesfully", Data: attendance })
                })
                .catch(error => {
                    console.log(error)
                    res.send({ status: false, message: error.message || "Server Error on Sign In", err: error.message })
                })

        }
        if (TransactionType == 'i am Out') {
            let query = {
                TakenIn: { $exists: true },
                "Date.Month": DateStr.getMonth(),
                "Date.Day": DateStr.getDate(),
                "Date.Year": DateStr.getFullYear(),
                "UserID": req.user._id,
            };
            let updatequery = {
                $set: { TakenOut: DateStr }
            }
            attendance_repo.updateOne(query, updatequery)
                .then(updateattendance => {
                    console.log(updateattendance)
                    if (updateattendance.modifiedCount > 0) {
                        res.send({ status: true, message: "Sign Out Succesfully" })
                    }
                    else {
                        res.send({ status: false, message: "Please Sign In Before Sign Out" })
                    }
                })
                .catch(error => {
                    console.log(error)
                    res.send({ status: false, message: error.message })
                })
        }

    } catch (e) {
        console.log(e)
        res.send({ status: false, message: e.message });
    }
}


module.exports.gettodayattendance = (req, res) => {
    let CurrentDate = new Date()
    let query = {
        TakenIn: { $exists: true },
        "Date.Month": CurrentDate.getMonth(),
        "Date.Day": CurrentDate.getDate(),
        "Date.Year": CurrentDate.getFullYear()
    };
    console.log(query)
    attendance_repo.find(query)
        .then(attendance => {
            res.send({ Status: true, data: attendance })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
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


module.exports.report = (req, res) => {
    const aggr = [
        {
            '$addFields': {
                'HOUR': {
                    '$divide': [
                        {
                            '$subtract': [
                                '$TakenOut', '$TakenIn'
                            ]
                        }, 3600000
                    ]
                }
            }
        }, {
            '$group': {
                '_id': '$UserID',
                'Details': {
                    '$push': '$$ROOT'
                },
                'Hours': {
                    '$sum': '$HOUR'
                }
            }
        }, {}
    ]
    attendance_repo.aggregate(aggr)
        .then(attendance => {
            res.send({ Status: true, data: attendance })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}


