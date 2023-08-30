const mongoose = require('mongoose');
const {DateTime} = require('luxon');

const MessageSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  },
  content:{type: String, require: true}
},{
  timestamps: true
});

MessageSchema.virtual("createdAt_formatted").get(function(){
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
})

module.exports = mongoose.model("Message", MessageSchema);