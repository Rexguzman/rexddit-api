const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/); //ID de mongo

const userSchema = {
    email: joi.string().min(6).required().email(),
    password: joi.string().required(),
};

const createUserSchema = {
    ...userSchema,
    name: joi.string().max(100).required(),
    img: joi.string().uri(),
};

module.exports = {
    userIdSchema,
    userSchema,
    createUserSchema,
};
