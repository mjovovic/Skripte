const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    cart: { type: [ { type: String } ], default: [] },
    password: String,
    roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }
      ] 
});

const User = mongoose.model('user', userSchema);




module.exports = User;


