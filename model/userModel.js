
import mongoose  from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone:{
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  address:{
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 6, 
  },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  boxId:{
    type:String,
    default:""
  }
});





const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
