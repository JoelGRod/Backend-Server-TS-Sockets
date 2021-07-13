"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
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
        required: true
    },
    has_password: {
        type: Boolean,
        required: true
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
    // Refs
    chatusers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'ChatUser'
        }
    ],
    msgs: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Msg'
        }
    ],
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
});
exports.default = mongoose_1.model('Room', RoomSchema);
