import { Schema, model } from 'mongoose';

const ChatUserSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    rooms: [
        {
            type: Schema.Types.ObjectId,
            ref: "Room"
        }
    ]
});

export default model('ChatUser', ChatUserSchema);