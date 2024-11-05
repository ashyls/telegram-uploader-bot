import { Markup } from "telegraf";
import sponsers from '../../sponser-channels.json' assert { type: 'json' };

async function isJoinedChannel(bot, userId, channelId) {
    try {
        const chatMember = await bot.telegram.getChatMember(channelId, userId);
        return ['member', 'administrator', 'creator'].includes(chatMember.status);
    } catch (error) {
        console.error(`Error checking channel membership for channel ${channelId}:`, error.message);
        return false;
    }
}

async function checkSponsorChannels(ctx, next) {
    const userId = ctx.from.id;
    const bot = ctx.bot;

    let notJoinedChannels = [];

    for (let channel of sponsers) {
        const isJoined = await isJoinedChannel(bot, userId, channel.id);
        if (!isJoined) {
            notJoinedChannels.push(channel);
        }
    }

    if (notJoinedChannels.length > 0) {
        const joinButtons = notJoinedChannels.map((channel) => {
            return Markup.button.url(`Join ${channel.name}`, channel.url);
        });

        await ctx.reply(
            'You have not joined the following sponsor channels. Please join to continue:',
            Markup.inlineKeyboard(joinButtons, { columns: 1 })
        );
    } else {
        return next();
    }
}

export default checkSponsorChannels;