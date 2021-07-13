"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_another_user_profile_connected = exports.is_chat_user_belongs_to = void 0;
const is_chat_user_belongs_to = (chat_users, chat_user_id) => {
    for (let chat_user of chat_users) {
        if (chat_user.toString() == chat_user_id) {
            return true;
        }
    }
    return false;
};
exports.is_chat_user_belongs_to = is_chat_user_belongs_to;
const is_another_user_profile_connected = (user_chat_users, room_chat_users) => {
    for (let user_chat_user of user_chat_users) {
        for (let room_chat_user of room_chat_users) {
            if (user_chat_user.toString() == room_chat_user.toString()) {
                return true;
            }
        }
    }
    return false;
};
exports.is_another_user_profile_connected = is_another_user_profile_connected;
