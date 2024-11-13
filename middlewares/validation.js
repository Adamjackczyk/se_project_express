const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

/**
 * Custom Joi validation for URLs using the `validator` package.
 *
 * @param {string} value - The URL string to validate.
 * @param {object} helpers - Joi helpers for custom error messages.
 * @returns {string} - Returns the valid URL if validation passes.
 */
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

/**
 * 1. Validation Schema for Creating a Clothing Item
 *
 * Validates the request body when a new clothing item is created.
 */
const createClothingItemValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.empty": "Item name is required.",
      "string.min": "Item name must be at least 2 characters long.",
      "string.max": "Item name must not exceed 30 characters.",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in.',
      "string.uri": 'The "imageUrl" field must be a valid URL.',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": "Weather type is required.",
      "any.only": "Weather must be one of hot, warm, or cold.",
    }),
  }),
});

/**
 * 2. Validation Schema for Creating a User (Signup)
 *
 * Validates the request body when a new user is created.
 */
const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 2 characters long.",
      "string.max": "Name must not exceed 30 characters.",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in.',
      "string.uri": 'The "avatar" field must be a valid URL.',
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  }),
});

/**
 * 3. Validation Schema for User Authentication (Login)
 *
 * Validates the request body when a user logs in.
 */
const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  }),
});

/**
 * 4. Validation Schema for Validating Item ID
 *
 * Validates the `itemId` route parameter to ensure it's a valid MongoDB ObjectID.
 */
const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.empty": "Item ID is required.",
      "string.length": "Item ID must be a 24-character hexadecimal string.",
      "string.hex": "Item ID must be a valid hexadecimal string.",
    }),
  }),
});

/**
 * 5. Validation Schema for Validating User ID
 *
 * Validates the `userId` route parameter to ensure it's a valid MongoDB ObjectID.
 */
const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.empty": "User ID is required.",
      "string.length": "User ID must be a 24-character hexadecimal string.",
      "string.hex": "User ID must be a valid hexadecimal string.",
    }),
  }),
});

/**
 * Validation Schema for Updating User Profile
 *
 * Validates the request body when a user updates their profile.
 */
const updateUserProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.empty": 'The "name" field must be filled in.',
      "string.min": 'The "name" field must be at least 2 characters long.',
      "string.max": 'The "name" field must not exceed 30 characters.',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in.',
      "string.uri": 'The "avatar" field must be a valid URL.',
    }),
  }),
});

module.exports = {
  createClothingItemValidation,
  createUserValidation,
  loginValidation,
  validateItemId,
  validateUserId,
  validateURL,
  updateUserProfileValidation,
};
