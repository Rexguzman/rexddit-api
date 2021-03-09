const joi = require('@hapi/joi');

const channelIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const channelNameSchema = joi.string().max(80);
const channelCoverSchema = joi.string() || joi.string().uri()
const channelDescriptionSchema = joi.string();
const channelAutorSchema = joi.string().max(40);
const channelAutorIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const channelAutorImgSchema = joi.string()
const channelCommentsSchema = joi.array().items(joi.string());
const channelcommentSchema = joi.string();

const createChannel = {
    name: channelNameSchema.required(),
    cover: channelCoverSchema,
    description: channelDescriptionSchema.required(),
    autor: channelAutorSchema.required(),
    autorId: channelAutorIdSchema.required(),
    autorImg: channelAutorImgSchema,
};
const insertComment = {
    id: channelIdSchema.required(),
    autor: channelAutorSchema.required(),
    autorImg: channelAutorImgSchema.required(),
    comment: channelcommentSchema.required(),
};

module.exports = {
    createChannel,
    insertComment,
}
