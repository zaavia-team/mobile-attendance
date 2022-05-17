const Email_Model = require('../models/email_schema');



exports.create = (user)=>{
    return Email_Model.create(user);
}

exports.find = (db_query, isSingle, isLeanNotRequired, select, sort, limit, skip)=>{
    let query = null
    if(isSingle){
        query = Email_Model.findOne(db_query);
    }
    else{
        query = Email_Model.find(db_query);
    }

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
    return Email_Model.updateOne(query, update);
}

exports.updateMany = (query, update) =>{
    return Email_Model.updateMany(query, update);
}

exports.count = (query) =>{
    return Email_Model.count(query);
}
