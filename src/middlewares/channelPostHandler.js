import Media from "../database/model/media.js";
import generateUrlHash from "../utils/mediaHash.js";
import dotenv from 'dotenv';
dotenv.config();

const uploadChannel = process.env.UPLOAD_CHANNEL;

async function channelPostHandler(ctx, next) {
  const message = ctx.update.channel_post;
  const caption = message.caption;
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
    } else {
      return ctx.reply('You sent an unknown file type.');
    }

    const existingMedia = await Media.findOne({ id: fileId });
    if (existingMedia) {
      return ctx.reply('That file is already uploaded.');
    }

    const newMedia = new Media({
        hash: await generateUrlHash(),
        id: fileId,
        caption: caption,
        type: fileType,
    });
    
    await newMedia.save();
    ctx.reply('Your file detail has been successfully saved in the database.');

    } catch (error) {
         console.error('Error handling input message:', error);
        ctx.reply('An error occurred while processing your request.');
    }
  }
}

export default channelPostHandler;