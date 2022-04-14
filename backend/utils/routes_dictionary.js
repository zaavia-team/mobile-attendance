let routes = {
    //General Settings
    "/api/alltitles/get" : {
        RightTitles : [{
            Title:"Approved Leave",
            ModuleName: "Setup"
        }],
        Methods : ["get"]
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



