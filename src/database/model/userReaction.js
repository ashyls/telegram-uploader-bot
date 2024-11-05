import mongoose from 'mongoose';

const { Schema } = mongoose;

const userReactionSchema = new Schema({
    userId: { 
        type: String, 
        required: true 
    },
    mediaId: { 
        type: String, 
        required: true 
    },
    reactionType: { 
        type: String, 
        enum: ['like', 'dislike'], 
        required: true 
    }
}, { timestamps: true });

userReactionSchema.index({ userId: 1, mediaId: 1 }, { unique: true });

const UserReaction = mongoose.model('UserReaction', userReactionSchema);

export default UserReaction;