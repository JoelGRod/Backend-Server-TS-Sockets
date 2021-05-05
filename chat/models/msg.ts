import { Schema, model } from 'mongoose';

const MsgSchema = new Schema({
    msg: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    }
});

export default model('Msg', MsgSchema);