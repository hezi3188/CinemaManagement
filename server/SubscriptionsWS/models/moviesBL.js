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
            premiered: obj.premiered
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
                premiered: obj.premiered
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



//pull the data from axios if no data in
initData= async function(){ 
    let count = await Movies.count();

    if(count==0){
        let movies=await axios.get("https://api.tvmaze.com/shows");
        let moviesArr=movies.data;

        movies=moviesArr.map(x=>{
            return {name:x.name,genres:x.genres,image:x.image.original,premiered:x.premiered}
        });
        console.log(movies);
        movies.forEach(element => {
            exports.addMovie(element);
           
       });
    }
}

initData().then();

