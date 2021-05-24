import { Socket } from 'socket.io';
import socketIO from 'socket.io';
// Chat Sockets Interfaces
import { ChatPayload, DeleteRoomPayload, RoomPayload } from './interfaces/chat-sockets';
// Middlewares
import validate_jwt_sockets from '../auth/middlewares/validate-jwt-sockets';
// Controllers
import { MessageController } from './controllers/msg';
import { login_user_sockets, logout_user_sockets, create_chat_room_sockets, delete_chat_room_sockets } from './controllers/room';

// Messages
export const get_message = (client: Socket, io: socketIO.Server) => {
    client.on('message', (payload: ChatPayload, callback) => {
        // console.log('New message:', payload);

        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets(payload.token);
        if (!payload.user_token) return callback({ ok: false, msg: 'Invalid token' });

        // Controllers
        const msg_controller = new MessageController();
        const controller_response = msg_controller.add_message_sockets(payload);

        // Callback and emit
        controller_response.then(resp => {
            if (!resp.ok) return callback(resp);
            else {
                io.emit( `${resp.message!.room}-new-message`,
                {
                    _id: resp.message?._id,
                    msg: resp.message?.msg,
                    created_at: resp.message?.created_at,
                    chatuser: {
                        _id: resp.message?.chatuser.id,
                        nickname: resp.message?.chatuser.nickname
                    }
                });
                return callback(resp);
            }
        });

    });
}

// Room
export const room_login = (client: Socket, io: socketIO.Server) => {
    client.on('login-user', (payload: ChatPayload, callback: Function) => {
        // console.log(payload.token, payload.room_id);

        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets(payload.token);
        if (!payload.user_token) return callback({ ok: false, msg: 'Invalid token' });

        // Controllers
        const controller_response = login_user_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            if (!resp.ok) return callback(resp);
            else {
                callback(resp);
                io.emit(
                    `${resp.room!._id}-login-user`,
                    {
                        _id: resp.chatuser!._id,
                        nickname: resp.chatuser!.nickname,
                        desc: resp.chatuser?.desc,
                        photo: resp.chatuser?.photo,
                        created_at: resp.chatuser?.created_at
                    });
            };
        });
    })
}

export const room_logout = (client: Socket, io: socketIO.Server) => {
    client.on('logout-user', (payload: ChatPayload, callback) => {
        // console.log(payload.token, payload.room_id);

        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets(payload.token);
        if (!payload.user_token) return callback({ ok: false, msg: 'Invalid token' });

        // Controllers
        const controller_response = logout_user_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            if (!resp.ok) return callback(resp);
            else {
                callback(resp);
                io.emit(
                    `${resp.room!._id}-logout-user`,
                    { nickname: resp.chatuser!.nickname });
            };
        });
    })
}

export const room_create = (client: Socket, io: socketIO.Server) => {
    client.on('create-room', (payload: RoomPayload, callback) => {
        // console.log(payload.token, payload.room_id);

        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets(payload.token);
        if (!payload.user_token) return callback({ ok: false, msg: 'Invalid token' });

        // Controllers
        const controller_response = create_chat_room_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            if (!resp.ok) return callback(resp);
            else {
                callback(resp);
                io.emit(
                    `new-room-created`,
                    {
                        _id: resp.room!._id,
                        name: resp.room!.name,
                        desc: resp.room!.desc,
                        photo: resp.room!.photo,
                        has_password: resp.room!.has_password,
                        created_at: resp.room!.created_at
                    }
                );
            };
        });
    })
}

export const room_delete = (client: Socket, io: socketIO.Server) => {
    client.on('delete-room', (payload: DeleteRoomPayload, callback) => {
        // console.log(payload.token, payload.room_id);

        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets(payload.token);
        if (!payload.user_token) return callback({ ok: false, msg: 'Invalid token' });

        // Controllers
        const controller_response = delete_chat_room_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            if (!resp.ok) return callback(resp);
            else {
                callback(resp);
                io.emit(
                    `room-deleted`,
                    {
                        _id: resp.room!._id,
                        name: resp.room!.name,
                        desc: resp.room!.desc,
                        photo: resp.room!.photo,
                        has_password: resp.room!.has_password,
                        created_at: resp.room!.created_at
                    }
                );
            };
        });
    })
}