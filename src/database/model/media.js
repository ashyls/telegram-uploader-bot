import mongoose from 'mongoose';

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
        enum: ['video', 'photo', 'document', 'audio', 'voice']
    }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

export default Media;