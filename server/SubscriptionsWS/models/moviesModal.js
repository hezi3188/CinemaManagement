const mongoose=require('mongoose');

let schema=mongoose.Schema;

let MoviesSchema = new schema({
    name : String,
    genres :Array,
    image :String, 
    Premiered: Date
});
module.exports=mongoose.model('movies',MoviesSchema);