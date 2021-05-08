import { Schema, model } from 'mongoose';

const MsgSchema = new Schema({
    msg: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    // Refs
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    chatuser: {
        type: Schema.Types.ObjectId,
        ref: "ChatUser"
    }
});

export default model('Msg', MsgSchema);