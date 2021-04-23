interface UserData {
    uid: string,
    name: string
}

declare global {
    namespace e {
        interface Request {
            user_data?: {
                uid: string,
                name: string
            }
        }
    }
}