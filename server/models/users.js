import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: (value) => value.length > 2,
    alias: 'fullName',
  },
  email: {
    type: String,
    required: [true, 'Please provide an email !'],
    unique: [true, 'Email exist'],
    validate: (value) => value.length > 5,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password !'],
    unique: false,
    validate: (value) => value.length > 5,
  },
});

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;
