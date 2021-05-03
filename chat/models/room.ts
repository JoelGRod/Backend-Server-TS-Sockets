import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
});

export default model('Room', RoomSchema);