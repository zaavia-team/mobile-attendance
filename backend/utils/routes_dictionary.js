let routes = {
    //General Settings
    "/api/alltitles/get" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["get"]
    },
    "/api/users" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["get"]
    },
    "/api/user/:id" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["post"]
    },
    "/api/register" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["post"]
    },
    "/api/attendance_transaction" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["post"]
    },
    "/api/gettodayattendance" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["get"]
    },
    "/api/getreportattendance" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["post"]
    },
    "/api/holiday" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["post"]
    },
    "/api/LeaveReq" : {
        RightTitles : [{
            Title:"Common",
            ModuleName: "Common"
        }],
        Methods : ["post"]
    },  
     "/api/getUsershowLeave" : {
        RightTitles : [{
            Title:"Approved Leave",
            ModuleName: "Setup"
        }],
        Methods : ["post"]
    },  
     "/api/getlisPendLeave" : {
        RightTitles : [{
            Title:"Approved Leave",
            ModuleName: "Setup"
        }],
        Methods : ["post"]
    },
    "/api/approvalLeave/:id" : {
        RightTitles : [{
            Title:"Approved Leave",
            ModuleName: "Setup"
        }],
        Methods : ["put"]
    },
    "/api/rejectedLeave/:id" : {
        RightTitles : [{
            Title:"Approved Leave",
            ModuleName: "Setup"
        }],
        Methods : ["put"]
    },
};

exports.getTitle = (path)=>{
    let titles = null;
    if(routes[path]){
        titles = routes[path].RightTitles.map(x => x.Title.toLowerCase());
    }
    return titles;
}

exports.getAllTitles = async (req,res) => {
    console.log("titles")
    try {
        let titles = {};
        for(let url in routes){
            console.log('url: ', url)
            for(let i = 0; i < routes[url].RightTitles.length; i++){
                // common roles does not show in frontend
                if(routes[url].RightTitles[i].ModuleName == "Common") continue;
                if(i == 0){
                    let module_name = routes[url].RightTitles[i].ModuleName;
                    titles[module_name] = titles[module_name] || {};
                    titles[module_name]["Title"] = titles[module_name]["Title"] || [];
                    if(titles[module_name]["Title"].indexOf(routes[url].RightTitles[i].Title) == -1){
                        titles[module_name]["Title"].push(routes[url].RightTitles[i].Title);
        
                    }
                }            
            }
        }
        console.log(titles)
        
        res.send({ data: titles, status: true, message: 'get All Title Successfully!' });

    } catch (e) {
    console.log("---------------")
    res.send({status : false , message : e.message});
    }
};



