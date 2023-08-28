const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  first_name:{
    type: String,
    require: true
  },
  last_name: {type: String, require: true},
  username: {type: String, require: true},
  email: {type: String, require: true},
  password: {type:String, requie: true},
  is_member: {type: Boolean, require: true}
})

module.exports = mongoose.model('User',userSchema);