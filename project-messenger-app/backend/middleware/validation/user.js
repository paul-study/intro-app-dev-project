import Joi from "joi";

const validatePostUser = (req, res, next) => {
  const userSchema = Joi.object({
    username: Joi.string().min(3).max(100).required().messages({
      "string.base": "username should be a string",
      "string.empty": "username cannot be empty",
      "string.min": "username should have a minimum length of {#limit}",
      "string.max": "username should have a maximum length of {#limit}",
      "any.required": "username is required",
    }),
    name: Joi.string().min(2).max(100).required().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
      "any.required": "name is required",
    }),
    email: Joi.string().email().max(255).required().messages({
      "string.base": "email should be a string",
      "string.empty": "email cannot be empty",
      "string.email": "email must be a valid email",
      "string.max": "email should have a maximum length of {#limit}",
      "any.required": "email is required",
    }),
    password: Joi.string().min(8).max(255).required().messages({
      "string.base": "password should be a string",
      "string.empty": "password cannot be empty",
      "string.min": "password should have a minimum length of {#limit}",
      "string.max": "password should have a maximum length of {#limit}",
      "any.required": "password is required",
    }),
    role: Joi.string().valid("USER", "ADMIN").optional().messages({
      "any.only": "role must be one of USER or ADMIN",
    }),
    gender: Joi.string().valid("MALE", "FEMALE", "UNKNOWN").required().messages({
      "string.base": "gender should be a string",
      "any.only": "gender must be one of MALE, FEMALE, or UNKNOWN",
      "any.required": "gender is required",
    }),
  });

  const { error } = userSchema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (error) {
    return res.status(409).json({
      errors: error.details.map(({ message, type }) => ({ message, type })),
    });
  }

  next();
};

const validatePutUser = (req, res, next) => {
  const userSchema = Joi.object({
    username: Joi.string().min(3).max(100).optional(),
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().max(255).optional(),
    password: Joi.string().min(8).max(255).optional(),
    role: Joi.string().valid("USER", "ADMIN").optional(),
    gender: Joi.string().valid("MALE", "FEMALE", "UNKNOWN").optional(),
  }).min(1);

  const { error } = userSchema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (error) {
    return res.status(409).json({
      errors: error.details.map(({ message, type }) => ({ message, type })),
    });
  }

  next();
};

export { validatePostUser, validatePutUser };