import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    chatusers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChatUser'
        }
    ]
});

export default model('Room', RoomSchema);