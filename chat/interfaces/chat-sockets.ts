import { UserToken } from "../../auth/interfaces/auth-interfaces";

// Login - Logout
export interface ChatPayload {
    room_id: string;
    token: string;
    nickname: string;
    msg?: string;
    has_password?: boolean;
    password?: string;
    user_token?: UserToken;
}

// Create room
export interface RoomPayload {
    room_name: string;
    desc: string;
    photo: string;
    password: string;
    has_password: boolean;
    token: string;
    user_token?: UserToken;
}


