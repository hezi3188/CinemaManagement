const User=require('./usersModal')
const axios=require('axios');
const jfile=require('jsonfile');


exports.getAll=async function(){
    //get all data
    const usersData = await getAllUsersData();
    const permissions = await getAllUsersPermissions();
    const usersName = await getAllUserFromDB();



    //create data for client
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
    let userData=await getUserData(id);
    if(!userData){
        throw new Error ("no user with that id");
    }
    let permissions=await getUserPermission(id);



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
                resolve(user);
            }
        })
    })
}

exports.addUser=async function(obj)
{
    let newUser;
    if(await isUserNameExist(obj.userName)){
        throw new Error("The user name already exists");
    }
    else{

        //add new user to mongodb
        newUser=new User({
            userName:obj.userName
        });
        newUser.save(function(err) {
            if(err){
                throw new Error (err);
            }
        });




        //add new user data to the users file
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
        jfile.writeFile('./dataSource/Users.json',usersData,function(err){
            if(err){
                throw new Error (err);
            }
        });



        //add new user permission for the permissions file
        let permissions=await getAllUsersPermissions();
        permissions=[...permissions,newUserPermissions];
        jfile.writeFile('./dataSource/Permissions.json',permissions,function(err){
            if(err){
                throw new Error(err);
            }
        });
     }

     
    return "Created new user with id: "+newUser._id;
         
}

exports.updateUser=async function(id,obj){

    let currentUserName=await getUserFromDB(id);
    currentUserName=currentUserName.userName;
   
    //if the user change the username
    if(currentUserName!=obj.userName){
        if(await isUserNameExist(obj.userName)){
            throw new Error("The username is already in use");
        }
        else{
            //update on mongodb
            User.findByIdAndUpdate(id,
                {
                    userName : obj.userName,
                },function(err, user){
                    if(err){
                        throw new Error(err);
                    }
            });
        }
    }
    
 

    //update users data file
    let userData=await getUserData(id);
    const newUserData={
        id:userData.id,
        firstName:obj.firstName,
        lastName:obj.lastName,
        created:userData.created,
        sessionTimeOut:obj.sessionTimeOut
    };
    let usersData=await getAllUsersData();
    usersData=usersData.map(user=>{
        if(user.id==id){
            return newUserData;
        }
        return user;
    });
    jfile.writeFile('./dataSource/Users.json',usersData,function(err){
        if(err){
            throw new Error(err);
        }
    });


    //update permissions file
    const newUserPermissions={
        id:userData.id,
        permissions:obj.permissions
    };
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
    return "Updated user id: "+id+" successfully!";
}


exports.deleteUser=async function(id){
    //delete from mongodb
    let error;
    try {
        await User.findByIdAndRemove(id, function(err, user){
            if(user==null||err){
                error="the id not valid or we can't connect to dada base";
            }
          
        });
    } catch (error) {
        throw new Error("the id not valid")
    }
    
    if(error)
    {
        throw new Error(error);
    }


    //deleted user data from users.json
    let allUsers=await getAllUsersData();
    allUsers=allUsers.filter(data=>data.id!=id);
    jfile.writeFile('./dataSource/Users.json',allUsers,function(err){
        if(err){
            throw new Error(err);
        }
    });


    //deleted user permission from permissions.json
    let allUsersPermissions=await getAllUsersPermissions();
    allUsersPermissions=allUsersPermissions.filter((data=>data.id!=id));
    jfile.writeFile('./dataSource/Permissiosns.json',allUsersPermissions,function(err){
        if(err){
            throw new Error(err);
        }
    });
  return "Deleted user id: "+id+ " successfully!";
}


exports.register=async function(userName,password){
    let id=await this.getUserId(userName);//if no username like this we throw error
    let user=await getUserFromDB(id);
  

    if(user.password){
        throw new Error ("You have already an account, please login!");
    }

    //update on mongodb
    User.findByIdAndUpdate(id,{
        userName:userName,
        password:password
    },function(err,user){
        if(err) throw new Error (err);
    });

    return "You registered successfully.";
}

//return true if the username&password are correct
exports.login=async function(userName,password){
    let users=await getAllUserFromDB();

    let user=users.filter(data=>data.userName==userName&&data.password==password);
    if(user.length==0){
        return false;
    }
    return true;
}














//Auxiliary functions
exports.getUserId=async function(userName){
    let users= await getAllUserFromDB();
    let user=users.filter(data=>data.userName==userName);
    if(user.length==0){
        throw new Error("The user name is not exist!");
    }
    return user[0].id;
}

exports.getSeesionTimeOut=async function(id){
    let usersData=await getUserData(id);
    return usersData.sessionTimeOut;
}

exports.checkPermission=async (id,permission) =>{

    let userPermission= await getUserPermission(id);
    let data=userPermission.permissions.filter(per=>per==permission)
    if(data.length>0){
        return true;
    }
    return false;
}

const isUserNameExist=async (uname) => {
    let userNames=await getAllUserFromDB();
    
    userNames=userNames.filter(user =>user.userName==uname);
    if(userNames.length==0){
        return false;
    }
    return true;
}

const getAllUserFromDB=()=>{
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
const getUserFromDB=(id)=>{
    return new Promise(function(resolve, reject) {
        User.findById(id, function(err, data){
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

const getUserPermission=async (id)=>{
    return new Promise(function(resolve, reject) {
        jfile.readFile('./dataSource/Permissions.json',function(err,data){
            if(err){
                reject(err);
            }
            else{
                let obj= data.filter(data=>data.id==id)
                if(obj!=[]){
                resolve(obj[0]);
                }
                resolve(null);
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
