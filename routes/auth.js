const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys.js');

const { config } = require('../config');

const UsersService = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');

const { createUserSchema, createProviderUserSchema, userSchema } = require('../utils/schemas/users');

// Basic strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const usersService = new UsersService();
  const apiKeysService = new ApiKeysService();

  router.post('/sign-in', validationHandler({userSchema}) ,async function(req, res, next) {

    const apiKeyToken = config.adminApiKeyToken;

    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', function(error, user) {
      try {
        if (error || !user) {
          next(boom.unauthorized());
        }

        req.login(user, { session: false }, async function(error) {
          if (error) {
            next(error);
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          const { _id: id, name, email, img} = user;

          const payload = {
            id: id,
            name,
            email,
            scopes: apiKey.scopes,
          };
          const token = jwt.sign(payload, config.authJwtSecret, {
            //expiresIn: '15m'
          });

          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
          });

          return res.status(200).json({ token, user: { id, name, email, img } });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });

  router.post('/sign-up', validationHandler(createUserSchema), async function(
    req,
    res,
    next
  ) {
    const { body: user } = req;

    try {
      const createdUserId = await usersService.createUser({ user });

      res.status(201).json({
        data: createdUserId,
        message: 'user created'
      });
    } catch (error) {
      next(error);
    }
  });

}

module.exports = authApi;