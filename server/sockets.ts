import { Socket } from 'socket.io';
import socketIO from 'socket.io';

// Interfaces
interface MsgPayload {
    from: string;
    msg: string;
}

interface LoginPayload {
    token: string;
    room_id: string;
}

export const disconnect = (client: Socket) => {
    client.on('disconnect', () => {
        console.log('Client disconnected');
    });
}

// Messages
export const get_message = (client: Socket, io: socketIO.Server) => {
    client.on('message', ( payload: MsgPayload ) => {
        console.log('New message:', payload);
        // New event send
        io.emit('new-message', payload);
    });
}

// User Chat
export const chat_user = (client: Socket, io: socketIO.Server) => {
    client.on('login-user', ( payload: LoginPayload, callback ) => {
        console.log(payload.token, payload.room_id);
        // Use this if you want a response from server
        callback = {
            resp: 'ok',
            msg: 'User logged'
        }
    })
}