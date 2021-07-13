"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MsgSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Room"
    },
    chatuser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ChatUser"
    }
});
exports.default = mongoose_1.model('Msg', MsgSchema);
