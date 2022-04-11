let express = require('express');
let routes = express.Router();
let controller = require('../controllers/user_controller');
let attendance_controller =require('../controllers/attendance_controller');
let titlesDictionary =require('../utils/routes_dictionary');
let auth = require('../services/auth');


routes.post('/login', controller.login);
routes.get('/users', controller.getUsers);
routes.post('/user/:id', auth.authMiddleware, controller.editUser);
routes.post('/register',  auth.authMiddleware,controller.register);
routes.post('/attendance_transaction',auth.authMiddleware,attendance_controller.attendance)
routes.get('/gettodayattendance',auth.authMiddleware,attendance_controller.gettodayattendance)
routes.post('/getreportattendance',auth.authMiddleware,attendance_controller.report)
routes.get ('/getalltitles', auth.authMiddleware,titlesDictionary.getAllTitles)


module.exports = routes;