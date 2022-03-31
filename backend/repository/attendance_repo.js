const Attendance_Model = require('../models/attendance_schema');



exports.create = (attendance)=>{
    return Attendance_Model.create(attendance);
}

exports.find = (db_query, isSingle, isLeanNotRequired, select, sort, limit, skip)=>{
    let query = null
    if(isSingle){
        query = Attendance_Model.findOne(db_query);
    }
    else{
        query = Attendance_Model.find(db_query);
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
    return Attendance_Model.updateOne(query, update);
}

exports.updateMany = (query, update) =>{
    return Attendance_Model.updateMany(query, update);
}

exports.count = (query) =>{
    return Attendance_Model.count(query);
}

exports.aggregate = (pipeline) =>{
    return Attendance_Model.aggregate(pipeline);
}