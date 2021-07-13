"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_another_user_profile_connected = exports.it_belongs_to = void 0;
const it_belongs_to = (ids_array, id_to_check) => {
    for (let id of ids_array) {
        if (id.toString() == id_to_check) {
            return true;
        }
    }
    return false;
};
exports.it_belongs_to = it_belongs_to;
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
