let express = require('express');
let routes = express.Router();
let controller = require('../controllers/user_controller');
let attendance_controller =require('../controllers/attendance_controller');
let titlesDictionary =require('../utils/routes_dictionary');
let auth = require('../services/auth');


routes.post('/login', controller.login);
routes.get('/users', controller.getUsers);
routes.post('/user/:id',auth.authMiddleware, controller.editUser);
routes.post('/register',auth.authMiddleware,controller.register);
routes.post('/attendance_transaction',auth.authMiddleware,attendance_controller.attendance)
routes.get('/gettodayattendance',auth.authMiddleware,attendance_controller.gettodayattendance)
routes.post('/getreportattendance',auth.authMiddleware,attendance_controller.report)
routes.post('/holiday',auth.authMiddleware,attendance_controller.holiday)
routes.post('/LeaveReq',auth.authMiddleware,attendance_controller.LeaveReq)
routes.post('/getUsershowLeave',auth.authMiddleware,attendance_controller.getUsershowLeave)
routes.post('/getlisPendLeave',auth.authMiddleware,attendance_controller.getlisPendLeave)
routes.put('/approvalLeave/:id',auth.authMiddleware,attendance_controller.approvedLeave)
routes.put('/rejectedLeave/:id',auth.authMiddleware,attendance_controller.rejectedLeave)
routes.post('/postExcelReport',auth.authMiddleware,attendance_controller.postExcelReport)
routes.get ('/getalltitles', auth.authMiddleware,titlesDictionary.getAllTitles)


module.exports = routes;