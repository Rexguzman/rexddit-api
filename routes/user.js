const express = require('express');

const UsersService = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const {
    userToDoIdSchema,
    createUserToDoSchema,
    updateUserToDoSchema,
    completedUserToDoSchema,
} = require('../utils/schemas/userToDos');
const { ObjectId } = require('bson');

function userApi(app) {
    const router = express.Router();
    app.use('/api/user', router);

    const usersService = new UsersService();

    router.put(
        '/update-img',
        //validationHandler(completedUserToDoSchema),
        async (req, res, next) => {
            try {
                const { img, email, id } = req.body;
                const user = await usersService.getUser({email});
                
                const updatedUser = await usersService.updateUser(id,{ img });
                const user2 = await usersService.getUser({email});
                const changeImgUser = {
                    ...user,
                    img: img,
                };
                res.status(200).json({
                    img,
                    message: 'user updated',
                });
            } catch (err) {
                next(err);
            }
        }
    );
}
module.exports = userApi;
