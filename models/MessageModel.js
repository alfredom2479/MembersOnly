const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  },
  title: {type: String, require: true},
  content:{type: String, require: true}
},{
  timestamps: true
});

module.exports = mongoose.model("Message", MessageSchema);