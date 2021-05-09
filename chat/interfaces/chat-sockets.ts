import { UserToken } from "../../auth/interfaces/auth-interfaces";

export interface ChatPayload {
    room_id: string;
    token: string;
    nickname: string;
    msg?: string;
    password?: string;
    user_token?: UserToken;
}


