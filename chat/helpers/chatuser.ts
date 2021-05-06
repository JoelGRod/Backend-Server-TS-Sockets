
export const is_chat_user_belongs_to = (chat_users: String[], chat_user_id: String) => {
    for(let chat_user of chat_users) {
        if(chat_user == chat_user_id) {
            return true;
        }
    }
    return false;
}

