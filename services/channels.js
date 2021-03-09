const MongoLib = require('../lib/mongo');

class ChannelsService {
    constructor() {
        this.collection = 'channels';
        this.mongoDB = new MongoLib();
    }

    async getChannels() {
        
        const channels = await this.mongoDB.getAll(this.collection, {});

        return channels || [];
    }

    async getChannel( channelId ) {
        
        const channel = await this.mongoDB.get(this.collection, channelId);

        return channel || [];
    }

    async createChannel(data) {
        const createdChannel = await this.mongoDB.create(this.collection, data);

        return createdChannel;
    }

    async updateChannel(channelId, data) {
        const updatedChannel = await this.mongoDB.update(
            this.collection,
            channelId,
            data
        );
        return updatedChannel;
    }

    async deleteUserToDo({ toDoId }) {
        const deletedUserToDoId = await this.mongoDB.delete(
            this.collection,
            toDoId
        );

        return deletedUserToDoId;
    }
}

module.exports = ChannelsService;
