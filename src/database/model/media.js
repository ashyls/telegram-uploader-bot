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
    },
    reactions: {
        like: { type: Number, default: 0, min: 0 },
        dislike: { type: Number, default: 0, min: 0 }
    },
    downloadCount: {
        type: Number,
        default: 0,
        min: 0
    },
    tags: {
        type: [String],
        default: []
    }
}, { timestamps: true });

mediaSchema.index({ type: 1 });

const Media = mongoose.model('Media', mediaSchema);

export default Media;