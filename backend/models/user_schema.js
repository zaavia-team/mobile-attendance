const mongoose = require("mongoose");
const uuid = require('uuid').v1;
const Schema = mongoose.Schema;
const crypto = require("crypto");

const ActionDetails = {
  ActionTakenByName: { type: String },
  ActionTakenByID: { type: Schema.ObjectId },
  ActionTakenOn: { type: Date },
  ActionTakenByLoginID: { type: String },
};

const UserSchema = new Schema({
  FirstName: String,
  LastName: String,
  MiddleName: String,
  EmployeeID: String,
  // NationalID: String,
  Designation: { type: String},
  Address: { type: String},
  Login_ID: {type: String , required: true},
  Email: { type: String, required: true},
  RightsTitle: [String],
  CreationDetails: ActionDetails,
  Salt: { type: String, required: true, default: uuid },
  Password: { type: String, required: true },
  StatusCode: {type: Number, default: 1}, // 0 for pending , 1 for active , 2 for delete
  LastUpdatedOn: Date,
  // IsMaster: {type: Boolean, default: false},
  DeletionDetails: ActionDetails,
  ForgotPasswordEmailSentTimeStamp: Date,
  Password_ResetToken: String,
  LastLoginOn: Date,
  LastLoginFromIP: String,
  DateOfBirth: Date,
  WorkingHours: Number,
  DateOfJoining: Date,
  PhoneNumber: Number,
  NIC: Number,
  Organization : {ID : Schema.ObjectId, Name : String},
  Login_JWT_Token_ID : { type: String},
  Status: Boolean
});

const validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre("save", function (next) {
  // Handle new/update passwords

  if (!this.isModified("Password")) {
    return next();
  }

  if (!validatePresenceOf(this.Password)) {
    return next(new Error("Invalid password"));
  }

  // Make Salt with a callback
  this.makeSalt((saltErr, Salt) => {
    if (saltErr) {
      return next(saltErr);
    }
    this.Salt = Salt;
    this.encryptPassword(this.Password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr);
      }
      this.Password = hashedPassword;
      next();
    });
  });
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} Password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.Password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        console.log('Error in Encryption : ', err)
        return callback(err);
      }

      if (this.Password === pwdGen) {
        console.log("With Call Back PWD Matched!");
        callback(null, true);
      } else {
        console.log("With Call Back PWD Does not Matched!");
        callback(null, false);
      }
    });
  },

  /**
   * Make Salt
   *
   * @param {Number} byteSize Optional Salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    console.log("Inside Salt Creation!!");
    let defaultByteSize = 16;

    if (typeof arguments[0] === "function") {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === "function") {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString("base64");
    }

    return crypto.randomBytes(byteSize, (err, Salt) => {
      if (err) {
        callback(err);
      } else {
        callback(null, Salt.toString("base64"));
      }
    });
  },

  /**
   * Encrypt Password
   *
   * @param {String} Password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.Salt) {
      if (!callback) {
        return null;
      } else {
        return callback("Missing password or Salt");
      }
    }

    let defaultIterations = 10000;
    let defaultKeyLength = 64;
    let Salt =  Buffer.from(this.Salt, "base64");

    if (!callback) {
      return crypto
        .pbkdf2Sync(password, Salt, defaultIterations, defaultKeyLength, "sha512")
        .toString("base64");
    }

    return crypto.pbkdf2(
      password,
      Salt,
      defaultIterations,
      defaultKeyLength,
      "sha512",
      (err, key) => {
        if (err) {
          callback(err);
        } else {
          callback(null, key.toString("base64"));
        }
      }
    );
  }
};

exports.authenticate = (password, password_to_match, salt, callback) =>{
  encryptPassword = (password, Salt, callback) =>{
    if (!password || !Salt) {
      if (!callback) {
        return null;
      } else {
        return callback("Missing password or Salt");
      }
    }

    let defaultIterations = 10000;
    let defaultKeyLength = 64;
    Salt = Buffer.from(Salt, "base64");

    if (!callback) {
      return crypto
        .pbkdf2Sync(password, Salt, defaultIterations, defaultKeyLength, "sha512")
        .toString("base64");
    }

    return crypto.pbkdf2(
      password,
      Salt,
      defaultIterations,
      defaultKeyLength,
      "sha512",
      (err, key) => {
        if (err) {
          callback(err);
        } else {
          callback(null, key.toString("base64"));
        }
      }
    );
  }
  encryptPassword(password, salt, (err, password_generated)=>{
    if(err){
      callback(err);
    }
    if(password_to_match == password_generated){
      callback(null, true);
    }
    else{
      callback(null, false);
    }
  });
}

UserSchema.index({ Login_ID: 1, "Organization.Name": 1}, { unique: true });

module.exports = mongoose.model("users", UserSchema);
