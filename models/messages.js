const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messagesSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  
  content: {
    type: String,
    required: true
  },
  
  create_time: {
    type: Date,
    default: Date.now
  },
  chat_id: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
  
})
const Messages = mongoose.model('Messages', messagesSchema);
module.exports = Messages;