import UserModel from '../models/users.js';
/**
 * Get client information by authentification cookies
 */

const Identity = async (req, res, next) => {
  var user = await UserModel.findOne({
    email: res.locals.email,
  });
  user.password = undefined;

  res.json(user);
};

export default Identity;
