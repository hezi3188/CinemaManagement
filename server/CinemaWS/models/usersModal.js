const mongoose=require('mongoose');

let schema=mongoose.Schema;

let UsersSchema = new schema({
    userName : String,
    password : String
});
module.exports=mongoose.model('users',UsersSchema);