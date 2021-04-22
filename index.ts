// Libraries
import dotenv from 'dotenv';
// App
import Server from './server/server';

// Environment variables
dotenv.config();
// Create new server
const server = Server.instance;

// Middlewares

// Cors (Express)
server.cors()

// Read and parse body (middleware) - access to request data in body
server.body_parse();
// Routes
server.define_routes();

// Start server
server.start_server( () => {
    console.log(`Server running on port: ${ server.port }`);
} );

