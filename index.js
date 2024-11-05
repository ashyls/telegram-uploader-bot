import { Telegraf } from "telegraf";
import { SocksProxyAgent } from 'socks-proxy-agent';
import checkSponserChannels from "./src/middlewares/checkSponsorChannels.js";
import callbackQueryHandler from "./src/middlewares/callbackQueryHandler.js";
import channelPostHandler from "./src/middlewares/channelPostHandler.js";
import connectDB from "./src/database/db.js";
import startCommand from "./src/commands/start.js";
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TOKEN;
const proxyHost = process.env.PROXY_HOST;
const proxyPort = process.env.PROXY_PORT;
const mongoURL = process.env.MONGO_URL;

let botOptions = {};
const socksAgent = new SocksProxyAgent(`socks5://${proxyHost}:${proxyPort}`);
botOptions.telegram = { agent: socksAgent };

const bot = new Telegraf(token, botOptions);
bot.use((ctx, next) => {
    ctx.bot = bot;
    return next();
});

bot.on('callback_query', callbackQueryHandler);
bot.on('channel_post', channelPostHandler);
bot.start(checkSponserChannels, startCommand);

connectDB(mongoURL);
bot.launch();