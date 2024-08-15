import { DecryptToken, GenerateTokens } from '../lib/AppHelper.js';

/**
 * Global function for authentificate user by token or refresh Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const AuthenticateUser = async (req, res, next) => {
  let authToken = req.headers['authorization'];
  authToken =
    authToken != undefined && authToken.length > 150
      ? authToken.split(' ')[1]
      : undefined;

  if (!authToken) {
    return await refreshToken(req, res, next);
  }
  DecryptToken(authToken, process.env.TOKEN_KEY, async (err, decodedValue) => {
    if (err) {
      console.log(err);
      return await refreshToken(req, res, next);
    }
    res.locals.email = decodedValue.email;
    next();
  });
};

/**
 * Renew user tokens
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns headers : token && refreshToken
 */
const refreshToken = async (req, res, next) => {
  const UnAuthorizedResponse = (res) => {
    res.status(401).json({ message: 'Error : Unauthorized user !' });
  };

  const refreshToken = req.headers['refreshtoken'];
  if (!refreshToken || refreshToken.length < 150) {
    return UnAuthorizedResponse(res);
  }

  DecryptToken(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY,
    (err, decodedValue) => {
      if (err) {
        console.log(err);
        return UnAuthorizedResponse(res);
      }
      res.locals.email = decodedValue.email;
      res.set(
        GenerateTokens({
          email: decodedValue.email,
          name: decodedValue.name,
        })
      );
      next();
    }
  );
};

export default AuthenticateUser;
