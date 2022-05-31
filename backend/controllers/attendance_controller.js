const attendance_repo = require('../repository/attendance_repo');
const user_repo = require('../repository/user_repo');
const excelJs = require("exceljs");
const fs = require("fs");


module.exports.attendance = async (req, res) => {
    const DateStr = new Date(req.body.Date);
    console.log("Body Date ", req.body.Date);
    console.log("Converted Date ", DateStr);
    const TransactionType = req.body.TransactionType;
    const ActionDetails = {
        ActionTakenByName: req.user.FirstName + ' ' + req.user.LastName,
        ActionTakenByID: req.user._id,
        ActionTakenOn: new Date(),
        ActionTakenByLoginID: req.user.Login_ID,
    };
    try {
        if (TransactionType == 'i am In') {
            const findAtt = await attendance_repo.find({
                "Date.Month": DateStr.getMonth(),
                "Date.Day": DateStr.getDate(),
                "Date.Year": DateStr.getFullYear(),
                TakenIn: { $exists: true },
                UserID: req.user._id
            }, true)
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
                ManualEntry: req.body.ManualEntry,
                WorkingHours: req.user.WorkingHours,
                UserName: req.user.Login_ID,
                ActionDetails: ActionDetails
            })
                .then(attendance => {
                    res.send({ status: true, message: "Sign In Succesfully", Data: attendance })
                })
                .catch(error => {
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
                $set: {
                    TakenOut: DateStr,
                    ManualEntry: req.body.ManualEntry,
                    EarlyReason: req.body.EarlyReason
                }
            }
            attendance_repo.updateOne(query, updatequery)
                .then(updateattendance => {
                    if (updateattendance.modifiedCount > 0) {
                        res.send({ status: true, message: "Sign Out Succesfully" })
                    }
                    else {
                        res.send({ status: false, message: "Please Sign In Before Sign Out" })
                    }
                })
                .catch(error => {
                    res.send({ status: false, message: error.message })
                })
        }

    } catch (e) {
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
    attendance_repo.find(query, false, null, "UserName UserID TakenIn")
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


module.exports.report = async (req, res) => {
    console.log(req.body, "Danish")
    let startDate = new Date(req.body.StartDate);
    let endDate = new Date(req.body.EndDate);
    // console.log("===> ", startDate.getDate())
    // console.log("===> ",startDate.getMonth())
    // console.log("===> ",startDate.getFullYear())
    // console.log(endDate.getDate())
    // console.log(endDate.getMonth())
    // console.log(endDate.getFullYear())

    const aggr = [
        {
            '$match': {
                '$and': [
                    {
                        '$and': [
                            {
                                'Date.Day': {
                                    '$gte': startDate.getDate()
                                }
                            }, {
                                'Date.Day': {
                                    '$lte': endDate.getDate()
                                }
                            }
                        ]
                    }, {
                        '$and': [
                            {
                                'Date.Month': {
                                    '$gte': startDate.getMonth()
                                }
                            }, {
                                'Date.Month': {
                                    '$lte': endDate.getMonth()
                                }
                            }
                        ]
                    }, {
                        '$and': [
                            {
                                'Date.Year': {
                                    '$gte': startDate.getFullYear()
                                }
                            }, {
                                'Date.Year': {
                                    '$lte': endDate.getFullYear()
                                }
                            }
                        ]
                    }
                ]
            }
        }, {
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
                'TotalHours': {
                    '$sum': '$HOUR'
                },
                'WorkingHours': {
                    '$sum': '$WorkingHours'
                },
                'ManualAttendance': {
                    '$sum': {
                        '$cond': [
                            {
                                '$eq': [
                                    '$WorkingHours', true
                                ]
                            }, 1, 0
                        ]
                    }
                },
                'TotalHolidays': {
                    '$sum': {
                        '$cond': [
                            {
                                '$eq': [
                                    '$TransactionType', 'Holiday'
                                ]
                            }, 1, 0
                        ]
                    }
                },
                'Leave': {
                    '$sum': {
                        '$cond': [
                            {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$TransactionType', 'Leave'
                                        ]
                                    }, {
                                        '$eq': [
                                            '$Status', 'Approved'
                                        ]
                                    }
                                ]
                            }, 1, 0
                        ]
                    }
                }
            }
        }
    ]

    //====================================//
    // const aggr = [
    //     {
    //         // '$match': {
    //         //     'ActionDetails.ActionTakenOn': {
    //         //         '$gte': new Date(req.body.StartDate),
    //         //         '$lte': new Date(new Date(req.body.EndDate).setHours(23, 59, 59))
    //         //     },
    //         '$match': {
    //             'Date.Day': {
    //               '$gte': startDate.getDate()
    //             }, 
    //             'Date.Month': {
    //               '$gte': startDate.getMonth()
    //             }, 
    //             'Date.Year': {
    //               '$gte': startDate.getFullYear()
    //             },
    //             'Date.Day': {
    //                 '$lte': endDate.getDate()
    //               }, 
    //               'Date.Month': {
    //                 '$lte': endDate.getMonth()
    //               }, 
    //               'Date.Year': {
    //                 '$lte': endDate.getFullYear()
    //               }
    //           }
    //     }, {
    //         '$addFields': {
    //             'HOUR': {
    //                 '$divide': [
    //                     {
    //                         '$subtract': [
    //                             '$TakenOut', '$TakenIn'
    //                         ]
    //                     }, 3600000
    //                 ]
    //             }
    //         }
    //     }, {
    //         '$group': {
    //             '_id': '$UserID',
    //             'Details': {
    //                 '$push': '$$ROOT'
    //             },
    //             'TotalHours': {
    //                 '$sum': '$HOUR'
    //             },
    //             'WorkingHours': {
    //                 '$sum': '$WorkingHours'
    //             },
    //             'ManualAttendance': {
    //                 '$sum': {
    //                     '$cond': [
    //                         {
    //                             '$eq': [
    //                                 '$WorkingHours', true
    //                             ]
    //                         }, 1, 0
    //                     ]
    //                 }
    //             },
    //             'TotalHolidays': {
    //                 '$sum': {
    //                   '$cond': [
    //                     {
    //                       '$eq': [
    //                         '$TransactionType', 'Holiday'
    //                       ]
    //                     }, 1, 0
    //                   ]
    //                 }
    //               }, 
    //               'Leave': {
    //                 '$sum': {
    //                   '$cond': [
    //                     {
    //                       '$and': [
    //                         {
    //                           '$eq': [
    //                             '$TransactionType', 'Leave'
    //                           ]
    //                         }, {
    //                           '$eq': [
    //                             '$Status', 'Approved'
    //                           ]
    //                         }
    //                       ]
    //                     }, 1, 0
    //                   ]
    //                 }
    //               }

    //         }
    //     }
    // ]

    //======================================//

    // const LeaveShow =
    // [
    //     {
    //       '$match': {
    //         'Date.Day': {
    //           '$gte': startDate.getDate()
    //         }, 
    //         'Date.Month': {
    //           '$gte': startDate.getMonth()
    //         }, 
    //         'Date.Year': {
    //           '$gte': startDate.getFullYear()
    //         },
    //         'Date.Day': {
    //             '$lte': endDate.getDate()
    //           }, 
    //           'Date.Month': {
    //             '$lte': endDate.getMonth()
    //           }, 
    //           'Date.Year': {
    //             '$lte': endDate.getFullYear()
    //           }
    //       }
    //     }, {
    //       '$group': {
    //         '_id': '$UserID', 
    //         'Details': {
    //           '$push': '$$ROOT'
    //         }, 
    //         'TotalHolidays': {
    //           '$sum': {
    //             '$cond': [
    //               {
    //                 '$eq': [
    //                   '$TransactionType', 'Holiday'
    //                 ]
    //               }, 1, 0
    //             ]
    //           }
    //         }, 
    //         'Leave': {
    //           '$sum': {
    //             '$cond': [
    //               {
    //                 '$and': [
    //                   {
    //                     '$eq': [
    //                       '$TransactionType', 'Leave'
    //                     ]
    //                   }, {
    //                     '$eq': [
    //                       '$Status', 'Approved'
    //                     ]
    //                   }
    //                 ]
    //               }, 1, 0
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   ]
    console.log(req.body)
    if (req.body.userIds && req.body.userIds.length) {
        aggr[0].$match['UserName'] = { $in: req.body.userIds }
    }
    attendance_repo.aggregate(aggr).then((attend) => {
        res.send({ Status: true, data: attend })
    }).catch(error => {
        res.send({ Status: false, msg: "Msg " + error })
    })
    //const show = await attendance_repo.aggregate(LeaveShow)
    //console.log(show, 'show =======')
    //console.log(rep, ' rep =======')
    // let attend = []
    // attend.push(rep)
    // console.log("242 =====>> ",attend)
    // rep.then(attend => {
    //     console.log(attend, 'Sharjeel')
    //     res.send({ Status: true, data: attend })
    // })
    // .catch(error => {
    //     res.send({ Status: false, msg: "Msg "+error })
    // })
}

module.exports.holiday = async (req, res) => {
    const Docs = [];
    const ActionDetails = {
        ActionTakenByName: req.user.FirstName + ' ' + req.user.LastName,
        ActionTakenByID: req.user._id,
        ActionTakenOn: new Date(),
        ActionTakenByLoginID: req.user.Login_ID,
    };
    let TransactionType;
    if (req.body.OtherType) TransactionType = req.body.OtherType
    else TransactionType = req.body.TransactionType;
    const Users = await user_repo.find({
        StatusCode: 1,
    }, false, false);
    Users.map(user => {
        const Datestart = new Date(req.body.Datestart);
        const Dateend = new Date(req.body.Dateend);
        let loop = new Date(req.body.Datestart);
        while (loop <= Dateend) {
            let newDocObj = {
                UserID: user._id,
                UserName: user.Login_ID,
                TransactionType: TransactionType,
                Date: {
                    Month: loop.getMonth(),
                    Day: loop.getDate(),
                    Year: loop.getFullYear(),
                },
                WorkingHours: 0,
                Title: req.body.Title,
                ActionDetails: ActionDetails
            };
            Docs.push(newDocObj)
            var newDate = loop.setDate(loop.getDate() + 1);
            loop = new Date(newDate);
        }

    });
    attendance_repo.createmultiple(Docs)
        .then(user => {
            res.send({ Status: true, data: user })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}



module.exports.LeaveReq = (req, res) => {
    const Req = [];
    let Dateend = "";
    const ActionDetails = {
        ActionTakenByName: req.user.FirstName + ' ' + req.user.LastName,
        ActionTakenByID: req.user._id,
        ActionTakenOn: new Date(),
        ActionTakenByLoginID: req.user.Login_ID,
    };
    const Datestart = new Date(req.body.Datestart);
    // const Dateend = new Date(req.body.Dateend);
    if (req.body.Dateend) {
        Dateend = new Date(req.body.Dateend);
    } else {
        Dateend = new Date(req.body.Datestart);
    }
    let loop = new Date(req.body.Datestart);
    while (loop <= Dateend) {
        let newReqObj = {
            UserID: req.user._id,
            UserName: req.user.Login_ID,
            TransactionType: 'Leave',
            Date: {
                Month: loop.getMonth(),
                Day: loop.getDate(),
                Year: loop.getFullYear(),
            },
            WorkingHours: 0,
            Reason: req.body.Reason,
            Status: 'Pending',
            ActionDetails: ActionDetails
        };
        Req.push(newReqObj);
        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);

    }

    attendance_repo.create(Req)
        .then(user => {
            res.send({ Status: true, data: user })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}

module.exports.getUsershowLeave = async (req, res) => {

    const usershow = await attendance_repo.find({
        UserID: req.user._id,
        TransactionType: 'Leave',
        Status: { $in: ['Pending', 'Approved', 'Rejected'] },
        'Date.Month': new Date().getMonth()

    }, false, false)
        .then(res1 => {
            res.send({ Status: true, data: res1 })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}

module.exports.getlisPendLeave = async (req, res) => {
    const user = await user_repo.find({
        _id: req.user._id
    }, true)
    const approvedRight = user.RightsTitle.find((right) => {
        return right === 'Approved Leave'
    })
    if (approvedRight) {
        console.log(user)
        const pendList = await attendance_repo.find({
            TransactionType: 'Leave',
            Status: 'Pending',
        }, false)
            .then(list => {
                res.send({ Status: true, data: list })
            })
            .catch(error => {
                res.send({ Status: false, message: error.message })
            })
    }
    else {
        res.send({ Status: true, message: "Not Authorized" })
    }
}

module.exports.approvedLeave = async (req, res) => {
    const ActionDetails = {
        ActionTakenByName: req.user.FirstName + ' ' + req.user.LastName,
        ActionTakenByID: req.user._id,
        ActionTakenOn: new Date(),
        ActionTakenByLoginID: req.user.Login_ID,
    };
    attendance_repo.updateOne(
        { _id: req.params.id },
        {
            $set: { ApprovedDetails: ActionDetails, Status: "Approved" },
        }
    )
        .then(user => {
            res.send({ Status: true, data: user })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}

module.exports.rejectedLeave = async (req, res) => {
    const ActionDetails = {
        ActionTakenByName: req.user.FirstName + ' ' + req.user.LastName,
        ActionTakenByID: req.user._id,
        ActionTakenOn: new Date(),
        ActionTakenByLoginID: req.user.Login_ID,
    };
    attendance_repo.updateOne(
        { _id: req.params.id },
        {
            $set: { RejectedDetails: ActionDetails, Status: "Rejected" },
        }
    )
        .then(user => {
            res.send({ Status: true, data: user })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}

module.exports.postExcelReport = async (req, res) => {
    const aggr = [
        {
            $match: {
                'TakenIn': {
                    '$gte': new Date(req.body.StartDate),
                    '$lte': new Date(new Date(req.body.EndDate).setHours(23, 59, 59))
                }
            }
        },
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
        },
        {
            '$group': {
                '_id': '$UserID',
                'Details': {
                    '$push': '$$ROOT'
                },
                'TotalHours': {
                    '$sum': '$HOUR'
                },
                'WorkingHours': {
                    '$sum': '$WorkingHours'
                },
                'ManualAttendance': {
                    '$sum': {
                        $cond: [{ $eq: ['$WorkingHours', true] }, 1, 0]
                    }
                },
                'TotalHolidays': {
                    '$sum': {
                        $cond: [{ $eq: ['$Title', "Holiday"] }, 1, 0]
                    }
                },
                'Leave': {
                    '$sum': {
                        $cond: [{ $eq: ['$Title', "Leave"] }, 1, 0]
                    }
                },
            }
        }
    ]
    if (req.body.userIds && req.body.userIds.length) {
        aggr[0].$match['UserName'] = { $in: req.body.userIds }
    }
    const attendance = await attendance_repo.aggregate(aggr);

    // Create a new worksheet
    const workbook = new excelJs.Workbook();
    // New Worksheet
    const worksheet = workbook.addWorksheet("Attendance_Sheet");
    // Path to downlaod excel
    const path = __dirname + "/attendance.csv";
    //column for data in excel.key must match data key0
    worksheet.columns = [
        { header: "S no.", key: "s_no", width: 10 },
        { header: "Name", key: "Name", width: 10 },
        { header: "Total Hours", key: "TotalHours", width: 10 },
        { header: "Total Working Hours", key: "TotalWorkingHours", width: 10 },
        { header: "Leave", key: "Leave", width: 10 },
    ];

    let counter = 1;

    attendance.forEach((attend) => {
        attend.s_no = counter;
        attend.Name = attend.Details[0].UserName;
        attend.TotalHours = attend.TotalHours;
        attend.TotalWorkingHours = attend.WorkingHours;
        attend.Leave = attend.Leave;
        worksheet.addRow(attend);
        counter++;
    });
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    try {
        const data = await workbook.csv.writeFile(path)
            .then(() => {
                const stream = fs.createReadStream(path)
                res.download(path)
            });
    } catch (err) {
        res.send({
            Status: "error",
            message: "Something went wrong",
        })
    }
};


module.exports.getreportholiday = (req, res) => {
    const aggr = [
        {
            '$match': {
                'Title': 'Holiday'
            }
        }, {
            '$group': {
                '_id': {
                    'Date': {
                        'Day': '$Date.Day',
                        'Month': '$Date.Month',
                        'Year': '$Date.Year'
                    },
                    'Title': '$Title'
                },
                'Details': {
                    '$first': '$TransactionType'
                }
            }
        }
    ];
    attendance_repo.aggregate(aggr)
        .then(holiday => {
            console.log(holiday)
            res.send({ Status: true, data: holiday })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}


module.exports.GetReportDailyAtt = async (req, res) => {
    const agg = [
        {
            $match: {
                'TakenIn': {
                    '$gte': new Date(req.body.StartDate),
                    '$lte': new Date(new Date(req.body.EndDate).setHours(23, 59, 59))
                }
            }
        },
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
        },
        {
            '$group': {
                '_id': '$UserID',
                'Details': {
                    '$push': '$$ROOT'
                },
                'TotalHours': {
                    '$sum': '$HOUR'
                },
                'WorkingHours': {
                    '$sum': '$WorkingHours'
                },

            }
        }
    ]

    const reportattend = await attendance_repo.aggregate(agg)

        .then(daliyattendance => {
            res.send({ Status: true, data: daliyattendance })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}
module.exports.GetLastReport = async (req, res) => {
    const reportagg = [
        {
          '$match': {
            'UserID': req.body.UserID, 
            '$and': [
                {
                    '$and': [
                        {
                            'Date.Day': {
                                '$gte': startDate.getDate()
                            }
                        }, {
                            'Date.Day': {
                                '$lte': endDate.getDate()
                            }
                        }
                    ]
                }, {
                    '$and': [
                        {
                            'Date.Month': {
                                '$gte': startDate.getMonth()
                            }
                        }, {
                            'Date.Month': {
                                '$lte': endDate.getMonth()
                            }
                        }
                    ]
                }, {
                    '$and': [
                        {
                            'Date.Year': {
                                '$gte': startDate.getFullYear()
                            }
                        }, {
                            'Date.Year': {
                                '$lte': endDate.getFullYear()
                            }
                        }
                    ]
                }
            ]
          }
        }, {
          '$addFields': {
            'TotalHours': {
              '$sum': '$HOUR'
            }, 
            'WorkingHours': {
              '$sum': '$WorkingHours'
            }
          }
        }
      ]
       await attendance_repo.aggregate(reportagg)

        .then(lastReport => {
            console.log(lastReport)
            res.send({ Status: true, data: lastReport })
        })
        .catch(error => {
            res.send({ Status: false, message: error.message })
        })
}