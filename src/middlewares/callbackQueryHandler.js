import { Markup } from 'telegraf';
import UserReaction from '../database/model/userReaction.js';
import Media from '../database/model/media.js';

async function callbackQueryHandler(ctx) {
    const callbackData = ctx.callbackQuery.data;
    const [action, hash, userId] = callbackData.split('_');
    const currentUserId = ctx.from.id.toString();
    
    const existingReaction = await UserReaction.findOne({ userId: currentUserId, mediaId: hash });
    
    if (existingReaction) {
        return ctx.answerCbQuery("You've already reacted to this post!", { show_alert: true });
    }

    if (action === 'like' || action === 'dislike') {
        let file = await Media.findOne({ hash });
        if (!file) return ctx.answerCbQuery('Media not found.', { show_alert: true });
        
        if (action === 'like') {
            file.reactions.like += 1;
        } else if (action === 'dislike') {
            file.reactions.dislike += 1;
        }

        const userReaction = new UserReaction({
            userId,
            mediaId: hash,
            reactionType: action
        });

        await userReaction.save()
        await file.save();

        const updatedButtons = [
            [
                Markup.button.callback(`👍 Like (${file.reactions.like})`, 'no_action'),
                Markup.button.callback(`👎 Dislike (${file.reactions.dislike})`, 'no_action')
            ],
            [
                Markup.button.callback(`📥 Downloads: ${file.downloadCount}`, 'no_action')
            ]
        ];

        await ctx.editMessageReplyMarkup({
            inline_keyboard: updatedButtons
        });

        return ctx.answerCbQuery(action === 'like' ? 'You liked this!' : 'You disliked this!');
    } else if (action === 'no_action') {
        return ctx.answerCbQuery();
    }
}

export default callbackQueryHandler;