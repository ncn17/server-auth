import { HashPassword } from '../lib/AppHelper.js';
import UserModel from '../models/users.js';

/**
 * Create or register a new user on database
 */
const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (name.length < 2 || email.length < 6 || password.length < 8) {
      return res.status(400).json({
        message: 'Bad request passed !',
      });
    }

    var user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(409).send({
        message: 'User email already used !',
      });
    }

    var hashedPassword = await HashPassword(password);
    await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).send({
      message: 'User created succesfully !',
    });
  } catch (error) {
    next(error);
  }
};

export default Register;
