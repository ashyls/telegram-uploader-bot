import mongoose from 'mongoose';
import crypto from 'crypto';

const { Schema } = mongoose;

const mediaSchema = new Schema({
    hash: {
        type: String,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    caption: {
        type: String,
    },
    type: {
        type: String,
        enum: ['video', 'photo', 'document']
    }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

export default Media;