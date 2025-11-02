const { check, validationResult } = require('express-validator');

// A middleware to run the validation checks
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return a 400 (Bad Request) with the first error message
    return res.status(400).json({
      status: 'error',
      message: errors.array()[0].msg,
    });
  }
  next();
};

const registerRules = () => {
  return [
    check('username', 'Username is required').not().isEmpty().trim(),
    check('username', 'Username must be at least 3 characters').isLength({
      min: 3,
    }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({
      min: 6,
    }),
  ];
};

const loginRules = () => {
  return [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ];
};

module.exports = {
  validate,
  registerRules,
  loginRules,
};
