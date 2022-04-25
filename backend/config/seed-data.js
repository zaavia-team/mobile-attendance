const user_repo = require('../repository/user_repo');
const uuid = require('uuid').v1;

const user = {
    FirstName: "Admin",
    LastName: "User",
    EmployeeID: "Admin01",
    Login_ID: "admin01",
    Email: "admin",
    RightsTitle: ["Admin"],
    WorkingHours: 8,
    CreationDetails: {
        ActionTakenByName: "System",
        ActionTakenOn: new Date(),
    },
    IsMaster : true,
    Password: uuid().substr(0, 6),
};


user_repo.find({'Login_ID':'admin01'}, true).then(user_exist => {
    if(!user_exist){ 
        let pwd = user.Password;
        user_repo.create(user).then(user_new => {
            console.log(`User Created. Please note the password: ${pwd}`);
        });
    }
    else{
        console.log(`User Already Exist in this Organization:`);
    }
});
 
