"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = void 0;
// import socketIO from 'socket.io';
const disconnect = (client) => {
    client.on('disconnect', () => {
        console.log('Client disconnected');
    });
};
exports.disconnect = disconnect;
