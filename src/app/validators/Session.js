const Joi = require('joi')

module.exports = {
  body: {
    email: Joi.string()
      .email()
      .required(),
    passwor: Joi.string().required()
  }
}
