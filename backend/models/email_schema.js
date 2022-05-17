const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



const ActionDetails = {
    ActionTakenByName: { type: String },
    ActionTakenByID: { type: Schema.ObjectId },
    ActionTakenOn: { type: Date },
    ActionTakenByLoginID: { type: String },
    CardNumber: String
};

const MailSchema = new Schema({
    SenderName: String,
    HOST : String,
    PORT : String,
    CreationDetails: ActionDetails,
    Email: String, //0 inactive 1 active,
    Password : String,
})

module.exports = mongoose.model("MailSetup", MailSchema);
