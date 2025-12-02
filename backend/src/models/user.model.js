import mongoose, { Schema } from "mongoose";

export const UserSchema = new Schema({


    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true
        
    },
    firstName: {
        type: String,
        required: [true, "First Name Is Required"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name Is Required"]
    },
    password: {
        type: String,
        required: [true, "Password Is Required"]
    },
    role: {
        type: String,
        enum: ['tutor', 'student']
    }
});

// Model create
 const User = mongoose.models.User || mongoose.model("User", UserSchema);
 export default User
