let express = require('express');
let routes = express.Router();
let controller = require('../controllers/index')


routes.post('/login', controller.login);
routes.post('/register', controller.register);



module.exports = routes;