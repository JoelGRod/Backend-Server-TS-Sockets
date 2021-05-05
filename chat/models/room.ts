import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
    name: {
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
        required: false
    },
    password: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        required: true
    },
    modified_at: {
        type: Date,
        required: false
    },
    chatusers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChatUser'
        }
    ],
    msgs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Msg'
        }
    ]
});

export default model('Room', RoomSchema);