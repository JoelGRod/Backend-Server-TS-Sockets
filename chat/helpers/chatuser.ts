import { ObjectId } from "mongoose";

export const is_chat_user_belongs_to = (chat_users: String[], chat_user_id: String) => {
    for(let chat_user of chat_users) {
        if(chat_user.toString() == chat_user_id) {
            return true;
        }
    }
    return false;
}

export const is_another_user_profile_connected = (user_chat_users: String[], room_chat_users: String[]) => {
    for(let user_chat_user of user_chat_users) {
        for(let room_chat_user of room_chat_users) {
            if( user_chat_user.toString() == room_chat_user.toString() ) {
                return true;
            }
        }
    }
    return false;
}



