// Define sponsor channels with valid URLs for both public and private channels
import sponsers from '../../sponser-channels.json' assert { type: 'json' };

async function isJoinedChannel(bot, userId, channelId) {
    try {
        const chatMember = await bot.telegram.getChatMember(channelId, userId);

        if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Error checking channel membership for channel ${channelId}:`, error.message);
        return false;
    }
}

async function checkSponserChannels(bot, userId) {
    let notJoinedChannels = [];

    for (let channel of sponsers) {
        let isJoined = await isJoinedChannel(bot, userId, channel.id);
        if (!isJoined) {
            notJoinedChannels.push(channel);
        }
    }

    return notJoinedChannels;
}

export default checkSponserChannels;