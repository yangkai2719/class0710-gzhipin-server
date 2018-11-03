const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const usersSchema= new Schema({

  username:{
    type:string,
    unique:true,
    required:true
  },
  password:{
    type:string,
    required:true
  },
  type:{
    type:string
    required:true
  }
})
const Users=mongoose.model('Users',usersSchema);

module.exports=Users;