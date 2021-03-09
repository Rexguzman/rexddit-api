const express = require('express');

const ChannelsService = require('../services/channels');
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const { createChannel, insertComment } = require('../utils/schemas/channels');
const { ObjectId } = require('bson');


function channelsApi(app) {
    const router = express.Router();
    app.use('/api/channels', router);

    const channelsService = new ChannelsService();

    router.get( '/',
        async (req, res, next) => {
            try {
                const channels = await channelsService.getChannels();

                res.status(200).json({
                    data: channels,
                    message: 'channels listed',
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.post(
        '/',
        //validationHandler(createChannel),
        async (req, res, next) => {
            try {
                const data = req.body;
                const createChannel = await channelsService.createChannel({
                    ...data,
                    comments: [],
                });

                res.status(201).json({
                    data: createChannel,
                    message: 'to-do created',
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.put(
        '/comment',
        validationHandler(insertComment),
        async (req, res, next) => {
            try {
                const {id, autor, autorImg, comment} = req.body;
                const channel = await channelsService.getChannel(id);
                console.log(comment)
                const commentInfo = {
                    id: ObjectId(),
                    autor,
                    comment,
                    autorImg,
                }
                
                const edditedChannel = channel.comments.push(commentInfo);

                const updatedChannel = await channelsService.updateChannel(
                   id,
                   channel
               );
               console.log(id)

                res.status(200).json({
                    channelId: id,
                    commentInfo,
                   message: 'comment posted',
                });
            } catch (err) {
                next(err);
            }
        }
    );

}
module.exports = channelsApi;
