"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatUserSchema = new mongoose_1.Schema({
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
    rooms: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Room"
        }
    ],
    msgs: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Msg"
        }
    ]
});
exports.default = mongoose_1.model('ChatUser', ChatUserSchema);
