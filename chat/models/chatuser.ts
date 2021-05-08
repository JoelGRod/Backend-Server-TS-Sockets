import { Schema, model } from 'mongoose';

const ChatUserSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    modified_at: {
        type: Date,
        required: false
    },
    // Refs
    rooms: [
        {
            type: Schema.Types.ObjectId,
            ref: "Room"
        }
    ],
    msgs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Msg"
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

export default model('ChatUser', ChatUserSchema);