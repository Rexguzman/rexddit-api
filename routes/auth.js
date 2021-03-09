const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const UsersService = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');

const { createUserSchema, createProviderUserSchema, userSchema } = require('../utils/schemas/users');

// Basic strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const usersService = new UsersService();

  router.post('/sign-in', validationHandler({userSchema}) ,async function(req, res, next) {

    passport.authenticate('basic', function(error, user) {
      try {
        if (error || !user) {
          next(boom.unauthorized());
        }

        req.login(user, { session: false }, async function(error) {
          if (error) {
            next(error);
          }

          const { _id: id, name, email, img} = user;

          const payload = {
            id: id,
            name,
            email,
            img: 'https://firebasestorage.googleapis.com/v0/b/rexddit.appspot.com/o/images%2Fuser-circle-solid-white.svg?alt=media&token=f7d4ed70-713e-41ae-827e-87d5038abc9a',
          };

          return res.status(200).json(payload);
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