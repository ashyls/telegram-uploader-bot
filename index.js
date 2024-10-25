import { Markup, Telegraf } from "telegraf";
import { SocksProxyAgent } from 'socks-proxy-agent';
import checkSponserChannels from "./src/utils/membership.js";
import channelPostHandler from "./src/middlewares/channelPostHandler.js";
import connectDB from "./src/database/db.js";
import dotenv from 'dotenv';
import Media from "./src/database/model/media.js";

dotenv.config();

const token = process.env.TOKEN;
const proxyHost = process.env.PROXY_HOST;
const proxyPort = process.env.PROXY_PORT;
const mongoURL = process.env.MONGO_URL;

let botOptions = {};
const socksAgent = new SocksProxyAgent(`socks5://${proxyHost}:${proxyPort}`);
botOptions.telegram = { agent: socksAgent };

const bot = new Telegraf(token, botOptions);

bot.on('channel_post', channelPostHandler)

bot.start(async (ctx, next) => {
    try {
        const userId = ctx.from.id;
        const unjoinedChannels = await checkSponserChannels(bot, userId);

        if (unjoinedChannels.length === 0) {
            const startPayload = ctx.startPayload;
            
            if(startPayload) {
                let file = await Media.findOne({ hash: startPayload });
                if(file) {
                    switch (file.type) {
                        case 'photo':
                                ctx.replyWithPhoto(file.id, {caption: file.caption});
                            break;
                
                        case 'video':
                            ctx.replyWithVideo(file.id, {caption: file.caption});
                            break;
                
                        case 'document':
                            ctx.replyWithDocument(file.id, {caption: file.caption});
                            break;
                
                        default:
                            break;
                    }
                }
            }else{
                next()
            }

        } else {
            const joinButtons = unjoinedChannels.map((channel) => {
                return Markup.button.url(`Join ${channel.name}`, channel.url);
            });

            ctx.reply('You have not joined the following sponsor channels. Please join to continue:', Markup.inlineKeyboard(joinButtons));
        }
    } catch (error) {
        console.error('Error in start handler:', error);
        ctx.reply('An error occurred. Please try again later.');
    }
});

connectDB(mongoURL);
bot.launch();