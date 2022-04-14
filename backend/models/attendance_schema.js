const mongoose = require("mongoose");
const uuid = require('uuid').v1;
const Schema = mongoose.Schema;

const ActionDetails = {
    ActionTakenByName: { type: String },
    ActionTakenByID: { type: Schema.ObjectId },
    ActionTakenOn: { type: Date },
    ActionTakenByLoginID: { type: String },
  };


const AttendanceSchema = new Schema({
    UserID: String,
    TransactionType: String,
    TakenIn : Date,
    TakenOut : Date,
    WorkingHours: Number,
    ManualEntry: Boolean,
    Title: String,
    Reason : String,
    Status : String,
    Date: { 
      Month: Number,
      Day: Number,
      Year: Number ,
    },
    ActionDetails,
    ApprovedDetails: ActionDetails,
    RejectedDetails: ActionDetails,
    UserName: String,
    Comment: String,
});




module.exports = mongoose.model("attendance", AttendanceSchema);