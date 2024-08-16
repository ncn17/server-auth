import { DecryptToken, GenerateTokens } from '../lib/AppHelper.js';

/**
 * Return custom unAuthorize response
 * @param {express} res
 */
const UnauthorizedResponse = (res) => {
  res.status(401).json({ message: 'Error : Unauthorized user !' });
};

/**
 * Global function for authentificate user by token or refresh Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const AuthenticateUser = async (req, res, next) => {
  const authToken =
    req.headers['authorization']?.replace('Bearer ', '') || undefined;
  if (!authToken) {
    return UnauthorizedResponse(res);
  }

  DecryptToken(authToken, process.env.TOKEN_KEY, async (err, decodedValue) => {
    if (err) {
      console.log(err);
      return UnauthorizedResponse(res);
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
const RefreshToken = async (req, res, next) => {
  const refreshToken = req.signedCookies.refreshToken;
  if (!refreshToken || refreshToken.length < 150) {
    return UnauthorizedResponse(res);
  }

  DecryptToken(refreshToken, process.env.TOKEN_KEY, (err, decodedValue) => {
    if (err) {
      console.log(err);
      return UnauthorizedResponse(res);
    }
    //Generate cookies for refresh token and return auth token
    GenerateTokens(
      {
        email: decodedValue.email,
        name: decodedValue.name,
      },
      res
    );

    res.json({ message: 'Refresh token success !' });
  });
};

export { AuthenticateUser, RefreshToken };
