const Member=require('./membersModal')
const axios=require('axios');
exports.getAll=function(){
    return new Promise(function(resolve, reject) {
        Member.find({}, function(err, member){
            if(err){
                reject(err);
            }
            else{
                resolve(member);
            }
        })
    })
}

exports.getMember=function(id){
    return new Promise(function(resolve, reject) {
        Member.findById(id, function(err, member){
            if(err) {
                reject(err);
            }
            else{
                resolve(member);
            }
        })
    })
}

exports.addMember=function(obj)
{
    const newMember=new Member({
        name: obj.name,
        email: obj.email,
        city: obj.city
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

exports.updateMember=function(id,obj){
    return new Promise(function(resolve, reject) {
        Member.findByIdAndUpdate(id,
            {
                name: obj.name,
                email: obj.email,
                city: obj.city
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


exports.deleteMember=function(id){
    return new Promise(function(resolve, reject) {
        Member.findByIdAndRemove(id, function(err, member){
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
    let count = await Member.count();

    if(count==0){
        let members=await axios.get("https://jsonplaceholder.typicode.com/users");
        let membersArr=members.data;
        
        members=membersArr.map(x=>{
            return {name:x.name,email:x.email,city:x.address.city}
        })
        members.forEach(element => {
          exports.addMember(element);
           
       });
    }
}

initData().then();