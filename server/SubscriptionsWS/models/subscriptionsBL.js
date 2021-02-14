const Subscription=require('./subscriptionsModal');
const axios=require('axios');
exports.getAll=function(){
    return new Promise(function(resolve, reject) {
        Subscription.find({}, function(err, obj){
            if(err){
                reject(err);
            }
            else{
                resolve(obj);
            }
        })
    })
}

exports.getSubscription=function(id){
    return new Promise(function(resolve, reject) {
        Subscription.findById(id, function(err, obj){
            if(err) {
                reject(err);
            }
            else{
                resolve(obj);
            }
        })
    })
}

exports.addSubscription=function(obj)
{
    const newMember=new Subscription(
        {
            memberId : obj.memberId,
            movies :obj.movies
        });

    newMember.save(function(err)
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

exports.updateSubscription=function(id,obj){
    return new Promise(function(resolve, reject) {
        Subscription.findByIdAndUpdate(id,
            {
                memberId : obj.memberId,
                movies :obj.movies
            },function(err, subscription){
                if(err){
                    reject(err);
                }
                else{
                    resolve('Updated!');
                }
            })
    })
}


exports.deleteSubscription=function(id){
    return new Promise(function(resolve, reject) {
        Subscription.findByIdAndRemove(id, function(err, obj){
            if(err) {
                reject(err);
            }
            else{
                resolve('Deleted!');
            }
        })
    })
}