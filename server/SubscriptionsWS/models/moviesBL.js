const Movies=require('./moviesModal')
const axios=require('axios');
exports.getAll=function(){
    return new Promise(function(resolve, reject) {
        Movies.find({}, function(err, member){
            if(err){
                reject(err);
            }
            else{
                resolve(member);
            }
        })
    })
}

exports.getMovie=function(id){
    return new Promise(function(resolve, reject) {
        Movies.findById(id, function(err, member){
            if(err) {
                reject(err);
            }
            else{
                resolve(member);
            }
        })
    })
}

exports.addMovie=function(obj)
{
    const newMember=new Movies(
        {
        name : obj.name,
        genres :obj.genres,
        image :obj.image, 
        Premiered: obj.Premiered
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

exports.updateMovie=function(id,obj){
    return new Promise(function(resolve, reject) {
        Movies.findByIdAndUpdate(id,
            {
                name : obj.name,
                genres :obj.genres,
                image :obj.image, 
                Premiered: obj.Premiered
            },function(err, member){
                if(err){
                    reject(err);
                }
                else{
                    resolve('Updated!');
                }
            })
    })
}


exports.deleteMovie=function(id){
    return new Promise(function(resolve, reject) {
        Movies.findByIdAndRemove(id, function(err, member){
            if(err) {
                reject(err);
            }
            else{
                resolve('Deleted!');
            }
        })
    })
}

