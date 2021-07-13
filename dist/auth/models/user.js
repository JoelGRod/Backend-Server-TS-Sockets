"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
    // Chat implementation
    rooms: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    chatusers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'ChatUser'
        }
    ]
});
exports.default = mongoose_1.model('User', UserSchema);
