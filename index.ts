import dotenv from 'dotenv';
import Server from './classes/server';

// Environment variables
dotenv.config();
// Create new server
const server = new Server();

// Middlewares

// Start server
server.start( () => {
    console.log(`Server running on port: ${ server.port }`);
} );
