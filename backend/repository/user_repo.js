const User_Model = require('../models/user_schema');


exports.create = (user)=>{
    return User_Model.create(user);
}

exports.find = (db_query, isSingle, isLeanNotRequired, select, sort, limit, skip)=>{
    let query = null
    if(isSingle){
        query = User_Model.findOne(db_query);
    }
    else{
        query = User_Model.find(db_query);
    }
    // if(select){
        query.select(select || {Password: false, Salt: false});
    // }
    if(sort){
        query.sort(sort);
    }
    if(skip){
        query.skip(skip);
    }
    if(limit){
        query.limit(limit);
    }    
    if(!isLeanNotRequired){
        query.lean()
    }
    return query;
}

exports.updateOne = (query, update) =>{
    return User_Model.updateOne(query, update);
}

exports.updateMany = (query, update) =>{
    return User_Model.updateMany(query, update);
}

exports.count = (query) =>{
    return User_Model.count(query);
}

exports.aggregate = (pipeline) =>{
    return User_Model.aggregate(pipeline);
}