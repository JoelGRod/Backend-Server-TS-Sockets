import { Socket } from 'socket.io';
import socketIO from 'socket.io';
// Chat Sockets Interfaces
import { ChatPayload } from './interfaces/chat-sockets';
// Middlewares
import validate_jwt_sockets from '../auth/middlewares/validate-jwt-sockets';
// Controllers
import { MessageController } from './controllers/msg';
import { login_user_sockets, logout_user_sockets } from './controllers/room';

// Messages
export const get_message = (client: Socket, io: socketIO.Server) => {
    client.on('message', ( payload: ChatPayload, callback ) => {
        console.log('New message:', payload);

        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets(payload.token);
        if(!payload.user_token) return callback({ ok: false, msg: 'Invalid token' });

        // Controllers
        const msg_controller = new MessageController();
        const controller_response = msg_controller.add_message_sockets(payload);

        // Callback and emit
        controller_response.then( resp => {
            if( !resp.ok ) return callback(resp);
            else io.emit(
                `${resp.message!.room}-new-message`, 
                { nickname: payload.nickname, msg: payload.msg });
        });
        
    });
}

// Room
export const room_login = (client: Socket, io: socketIO.Server) => {
    client.on('login-user', ( payload: ChatPayload, callback: Function ) => {
        // console.log(payload.token, payload.room_id);

        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets(payload.token);
        if(!payload.user_token) return callback({ ok: false, msg: 'Invalid token' });
        
        // Controllers
        const controller_response = login_user_sockets(payload);
        // Callback and emit
        controller_response.then( resp => {
            if( !resp.ok ) return callback(resp);
            else {
                callback(resp);
                io.emit(
                    `${resp.room!.name}-login-user`, 
                    { 
                        nickname: resp.chatuser!.nickname, 
                        desc: resp.chatuser?.desc, 
                        photo: resp.chatuser?.photo 
                    });
            }; 
        });
    })
}

export const room_logout = (client: Socket, io: socketIO.Server) => {
    client.on('logout-user', ( payload: ChatPayload, callback ) => {
        // console.log(payload.token, payload.room_id);

        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets(payload.token);
        if(!payload.user_token) return callback({ ok: false, msg: 'Invalid token' });
        
        // Controllers
        const controller_response = logout_user_sockets(payload);
        // Callback and emit
        controller_response.then( resp => {
            if( !resp.ok ) return callback(resp);
            else {
                callback(resp);
                io.emit(
                    `${resp.room!.name}-login-user`, 
                    { nickname: resp.chatuser!.nickname });
            }; 
        });
    })
}