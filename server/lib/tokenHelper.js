import jwt from 'jsonwebtoken';

/**
 * Create jwt token
 * @param {object} data
 * @param {string} key
 * @param {string} expireDate
 * @returns string of json token
 */
const CreateToken = (data, key, expireDate) => {
  return jwt.sign(data, key, { algorithm: 'HS256' }, { expiresIn: expireDate });
};

export default CreateToken;
