import { Markup } from 'telegraf';
import Media from "../database/model/media.js";

async function startCommand(ctx, next) {
    try {
        const userId = ctx.from.id;
        const startPayload = ctx.startPayload;  
        if(startPayload) {
            let file = await Media.findOne({ hash: startPayload });
            if(file) {
                const likeDislikeButtons = Markup.inlineKeyboard([
                    [
                        Markup.button.callback(`👍 Like (${file.reactions.like})`, `like_${file.hash}_${userId}`),
                        Markup.button.callback(`👎 Dislike (${file.reactions.dislike})`, `dislike_${file.hash}_${userId}`)
                    ],
                    [
                        Markup.button.callback(`📥 Downloads: ${file.downloadCount}`, 'no_action')
                    ]
                ]);
                
                const details = {
                    caption: file.caption,
                    reply_markup: likeDislikeButtons.reply_markup
                };

                switch (file.type) {
                    case 'photo':
                            ctx.replyWithPhoto(file.id, details);
                        break;
            
                    case 'video':
                        ctx.replyWithVideo(file.id, details);
                        break;
            
                    case 'document':
                        ctx.replyWithDocument(file.id, details);
                        break;
            
                    case 'voice':
                        ctx.replyWithVoice(file.id, details);
                        break;
                    
                    case 'audio':
                        ctx.replyWithAudio(file.id, details);
                        break;
            
                    default:
                        break;
                }
            }else {
                await Media.deleteOne({ hash: startPayload });
                ctx.reply('The requested file is no longer available and has been removed.');
            }
        }else{
            ctx.reply('Hi welcome to the uploader bot');
            next()
        }
    }catch (error) {
        console.error('Error in start handler:', error);
        ctx.reply('An error occurred. Please try again later.');
    }
};

export default startCommand;