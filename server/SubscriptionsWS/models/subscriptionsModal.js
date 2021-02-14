const mongoose=require('mongoose');

let schema=mongoose.Schema;

let SubscriptionsSchema = new schema({
    memberId : String,
    movies :Array
});
module.exports=mongoose.model('subscriptions',SubscriptionsSchema);