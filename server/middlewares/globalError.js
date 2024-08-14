/**
 * Catch app global errors
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const globaErrors = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    message: 'Server Error : operation failled !',
  });
};

export default globaErrors;
