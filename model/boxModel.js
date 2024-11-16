import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  boxId: {
    type: String
  },
  userPassWord: {
    type: String
  },
  temporaryPassword: { 
    type: String
  },
});

const boxModel = mongoose.models.box || mongoose.model('box', boxSchema);

export default boxModel;
