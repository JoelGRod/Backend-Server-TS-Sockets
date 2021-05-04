import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    chatusers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChatUser'
        }
    ]
});

export default model('User', UserSchema);