const User=require('./usersModal')
const axios=require('axios');
const jfile=require('jsonfile');


const isUserNameExist=async (uname) => {
    let userNames=await getAllUsersName();
    
    userNames=userNames.filter(user =>user.userName==uname);
    console.log(userNames);
    if(userNames.length==0){
        return false;
    }
    return true;
}

const getAllUsersName=()=>{
    return new Promise(function(resolve, reject) {
        User.find({}, function(err, data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    });
}
const getAllUsersData=function(){
    return new Promise(function(resolve, reject) {
        jfile.readFile('./dataSource/Users.json',function(err,data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}
const getAllUsersPermissions=()=>{
    return new Promise(function(resolve, reject) {
        jfile.readFile('./dataSource/Permissions.json',function(err,data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
   });
}

const getUserData=async (id) => {
    let users=await getAllUsersData();
    let user=users.filter(data=>data.id==id);
    return user[0];
}


exports.getAll=async function(){
    const usersData = await getAllUsersData();
    console.log(usersData);

    const permissions = await getAllUsersPermissions();
    console.log(permissions);

    const usersName = await getAllUsersName();
    console.log(usersName);

    let users=[];

    for (let i = 0; i < usersData.length; i++) {
        users[i]={
            id: usersData[i].id,
            firstName:usersData[i].firstName,
            lastName:usersData[i].lastName,
            username:usersName[i].userName,
            sessionTimeOut:usersData[i].sessionTimeOut,
            created:usersData[i].created,
            permissions:permissions[i].permissions
        };
    }
    return users;
  
}

exports.getUser=async function(id){
    let userData=await getAllUsersData();
    userData=userData.filter(user=>user.id==id);
    if(userData.length==0){
        return "no user with that id";
    }
    userData=userData[0];
    let permissions=await getAllUsersPermissions();
    permissions=permissions.filter(permission=>permission.id==id);
    permissions=permissions[0];
    console.log(permissions);
    console.log(userData);
    return new Promise(function(resolve, reject) {
        User.findById(id, function(err, data){
            if(err) {
                reject(err);
            }
            else{
                let user={
                    id: userData.id,
                    firstName:userData.firstName,
                    lastName:userData.lastName,
                    username:data.userName,
                    sessionTimeOut:userData.sessionTimeOut,
                    created:userData.created,
                    permissions:permissions.permissions
                };
                console.log(user)
                resolve(user);
            }
        })
    })
}

exports.addUser=async function(obj)
{
    if(await isUserNameExist(obj.userName)){
        return "The user name already exists";
    }
    else{
        const newUser=new User({
            userName:obj.userName
        });
        newUser.save(function(err) {
            if(err){
                return err;
            }
        });


       
        const newUserData={
            id:newUser._id,
            firstName:obj.firstName,
            lastName:obj.lastName,
            created:new Date(),
            sessionTimeOut:obj.sessionTimeOut
        };
        const newUserPermissions={
            id:newUser._id,
            permissions:obj.permissions
        };


        let usersData=await getAllUsersData();
        usersData=[...usersData,newUserData];
        console.log(usersData);
        jfile.writeFile('./dataSource/Users.json',usersData,function(err){
            if(err){
                return err;
            }
        });

        let permissions=await getAllUsersPermissions();
        permissions=[...permissions,newUserPermissions];
        jfile.writeFile('./dataSource/Permissions.json',permissions,function(err){
            if(err){
                return err;
            }
        });
     }

     
    return "created";
         
}

exports.updateUser=async function(id,obj){
    let error="";
    User.findByIdAndUpdate(id,
        {
            userName : obj.userName,
        },function(err, user){
            if(err){
                error=err;
            }
    });


    let userData=await getUserData(id);
    const newUserData={
        id:userData.id,
        firstName:obj.firstName,
        lastName:obj.lastName,
        created:userData.created,
        sessionTimeOut:obj.sessionTimeOut
    };
    const newUserPermissions={
        id:userData.id,
        permissions:obj.permissions
    };


    //update users data file
    let usersData=await getAllUsersData();
    usersData=usersData.map(user=>{
        if(user.id==id){
            return newUserData;
        }
        return user;
    });
    jfile.writeFile('./dataSource/Users.json',usersData,function(err){
        if(err){
            error=err;
        }
    });


    //update permissions file
    let permissions=await getAllUsersPermissions();
    permissions=permissions.map(user=>{
        if(user.id==id){
            return newUserPermissions;
        }
        return user;
    });

    jfile.writeFile('./dataSource/Permissions.json',permissions,function(err){
        if(err){
            error=err;
        }
    });
  

    //return
    if(error){
        return error;
    }
    else{
        return "updated";
    }
}


exports.deleteUser=async function(id){
    User.findByIdAndRemove(id, function(err, user){
        if(err) {
            return err;
        }
    });





    let allUsers=await getAllUsersData();
    allUsers=allUsers.filter(data=>data.id!=id);
  
    
    jfile.writeFile('./dataSource/Users.json',allUsers,function(err){
        if(err){
            return err;
        }
    });


    let allUsersPermissions=await getAllUsersPermissions();
    allUsersPermissions=allUsersPermissions.filter((data=>data.id!=id));

    jfile.writeFile('./dataSource/Permissions.json',allUsersPermissions,function(err){
        if(err){
            return err;
        }
    });
  return "deleted";
}

