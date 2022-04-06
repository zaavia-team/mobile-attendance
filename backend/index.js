// Require express and create an instance of it
let express = require('express');
const req = require('express/lib/request');
let mongoose = require('mongoose');
let app = express();
let routes = require('./routes/routes');

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
  if(process.env.SEED && process.env.SEED === 'true'){
    require('./config/seed-data');
  }
}
app.use(express.json());
app.use(express.urlencoded());
app.use('/api', routes);

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 3000 !
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
    console.log('Attendance app listening on port ' , PORT);
});

mongoose.connect (process.env.MONGO_URI || 'mongodb://localhost:27017/attendanceapp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
