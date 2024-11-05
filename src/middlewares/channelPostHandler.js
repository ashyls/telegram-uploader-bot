import Media from "../database/model/media.js";
import generateUrlHash from "../utils/mediaHash.js";
import dotenv from 'dotenv';
dotenv.config();

const uploadChannel = process.env.UPLOAD_CHANNEL;
const botUsername = process.env.BOT_USERNAME;
const ownerId = process.env.OWNER_ID;

async function channelPostHandler(ctx, next) {
  const message = ctx.update.channel_post;
  const caption = message.caption || '';
  const channelId = message.chat.id;

  if (uploadChannel == channelId) {
        
  try {
    let fileType = '';
    let fileId = '';

    if (message.photo) {
      fileId = message.photo[message.photo.length - 1].file_id;
      fileType = 'photo';

    } else if (message.video) {
      fileId = message.video.file_id;
      fileType = 'video';

    } else if (message.document) {
      fileId = message.document.file_id;

      fileType = 'document';
    } else if (message.audio) {
      fileId = message.audio.file_id;
      fileType = 'audio';

    } else if (message.voice) {
      fileId = message.voice.file_id;
      fileType = 'voice';
      
    } else {
      return ctx.telegram.sendMessage(ownerId, 'You sent an unknown file type.');
    }

    const existingMedia = await Media.findOne({ id: fileId });
    if (existingMedia) {
      return ctx.telegram.sendMessage(ownerId,'That file is already uploaded.');
    }
    
    const newMedia = new Media({
        hash: await generateUrlHash(),
        id: fileId,
        caption: caption,
        type: fileType,
    });
    
    await newMedia.save();
    ctx.telegram.sendMessage(ownerId, 'Your file detail has been successfully saved in the database.');

    function escapeMarkdownV2(text) {
      return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
    }
    
    const extraText = `||${escapeMarkdownV2(`https://t.me/${botUsername}?start=${newMedia.hash}`)}||`;
    
    await ctx.telegram.editMessageCaption(
      channelId,
      message.message_id,
      null,
      `${caption}\n\n${extraText}`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Link', url: `https://t.me/${botUsername}?start=${newMedia.hash}` }]
          ]
        }
      }
    );    
    
    } catch (error) {
        console.error('Error handling input message:', error);
        ctx.telegram.sendMessage(ownerId, 'An error occurred while processing your request.');
    }
  }
}

export default channelPostHandler;