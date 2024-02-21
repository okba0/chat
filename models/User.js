import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true,
      },
    profileimage:{
        type:String,
        default:"",
    },
    chats:{
        type:[{ type:mongoose.Schema.Types.ObjectId,ref:"Chat"}]
    }
})
const User= mongoose.models.User || mongoose.model("User",UserSchema)
export default User