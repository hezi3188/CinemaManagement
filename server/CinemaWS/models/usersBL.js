const User=require('./usersModal')
const axios=require('axios');
exports.getAll=function(){
    return new Promise(function(resolve, reject) {
        User.find({}, function(err, user){
            if(err){
                reject(err);
            }
            else{
                resolve(user);
            }
        })
    })
}

exports.getUser=function(id){
    return new Promise(function(resolve, reject) {
        User.findById(id, function(err, user){
            if(err) {
                reject(err);
            }
            else{
                resolve(user);
            }
        })
    })
}

exports.addUser=function(obj)
{
    const newUser=new User({
        userName : obj.userName,
        password : obj.password
    });

    newUser.save(function(err)
    {
        return new Promise((resolve, reject)=>
         {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve("Created!");
            }
        })
    })
}

exports.updateUser=function(id,obj){
    return new Promise(function(resolve, reject) {
        User.findByIdAndUpdate(id,
            {
                userName : obj.userName,
                password : obj.password
            },function(err, user){
                if(err){
                    reject(err);
                }
                else{
                    resolve('Updated!');
                }
            })
    })
}


exports.deleteUser=function(id){
    return new Promise(function(resolve, reject) {
        User.findByIdAndRemove(id, function(err, user){
            if(err) {
                reject(err);
            }
            else{
                resolve('Deleted!');
            }
        })
    })
}
