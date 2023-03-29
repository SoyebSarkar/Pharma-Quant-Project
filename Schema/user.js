const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.connect('mongodb://127.0.0.1:27017/UserDetails')
.then((d)=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log(err);
})

const userSchema = new Schema({
    username:String,
    email:String,
    password:String
})
const UserData = mongoose.model('UserData',userSchema);

module.exports = UserData;