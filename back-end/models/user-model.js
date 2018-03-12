const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const UserSchema = new Schema({
  username: {
      type: String,
      required: true
    }, 
  encryptedPassword: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    }, 
    lastName: {
      type: String,
      required: true
    },
    role: {
      type: String, 
      enum: ['Doctor', 'Nurse', 'Office', 'Patient'],
      required: true
    }
  },
  {
      timestamps: true
  }
);

const User = mongooe.model('User', UserSchema);
module.exports = User;