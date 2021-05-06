
export const it_belongs_to = (ids_array: String[], id_to_check: String) => {
    for(let id of ids_array) {
        if(id.toString() == id_to_check) {
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



