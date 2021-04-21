import { Socket } from 'socket.io';
import socketIO from 'socket.io';

// Interfaces
interface MsgPayload {
    from: string;
    body: string;
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