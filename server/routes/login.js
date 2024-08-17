import { ComparePassword, GenerateTokens } from '../lib/AppHelper.js';
import UserModel from '../models/users.js';

/**
 * SignUp auth user and get credentials
 */
const Login = async (req, res, next) => {
  try {
    const GetBadRequestResponse = (res) => {
      return res
        .status(400)
        .json({ message: 'Error: bad email or password !' });
    };

    const { email, password } = req.body;
    if (!email || email.length < 5 || !password || password.length < 8) {
      return GetBadRequestResponse(res);
    }

    var user = await UserModel.findOne({ email: email });
    if (!user) {
      return GetBadRequestResponse(res);
    }

    var isValidPassword = await ComparePassword(password, user.password);
    if (isValidPassword) {
      //Generate cookies for refresh token and return auth token
      const { token, refreshToken } = GenerateTokens(
        { email: user.email, name: user.name },
        res
      );
      //save user with refreshToken
      user.refreshToken = refreshToken;
      await user.save();

      return res.status(200).json({ message: 'Login sucess !', token });
    }

    return GetBadRequestResponse(res);
  } catch (error) {
    next(error);
  }
};

export default Login;
