import express from 'express';
import cors from 'cors';
import socketIO from 'socket.io';
import http from 'http';
// Sockets events
import * as socket from './sockets';
import * as chat_socket from '../chat/sockets';
// DB connection
import dbConnection from './db-config';
// Routes
import auth_router from '../auth/routes';
import chat_router from '../chat/routes';
import email_router from '../email/routes';


export default class Server {

    // Singleton
    private static _instance: Server;

    // Express App
    public app: express.Application;
    public port: number;
    // Sockets
    public io: socketIO.Server;         // Socket server
    private http_server: http.Server;   // App server socket compatible

    private constructor() {
        this.app = express();
        this.port = Number(process.env.PORT);
        // DB Connection
        dbConnection();
        
        // Sockets
        this.http_server = new http.Server(this.app);
        this.io = new socketIO.Server(this.http_server, {
            cors: {
                origin: true,
                credentials: true
            }
        });

        this.listen_to_sockets();
    }

    // Singleton
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    // Express cors
    cors() {
        this.app.use(cors({origin: true, credentials: true}));
    }

    body_parse() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    // Domain routes
    define_routes() {
        this.app.use('/api/auth/', auth_router);
        this.app.use('/api/chat/', chat_router);
        this.app.use('/api/email/', email_router);
    }

    // Public directory
    define_public() {
        this.app.use( express.static('public') );
    }

    // Server
    start_server( callback: VoidFunction ) {
        this.http_server.listen( this.port, callback);
    }

    // Sockets - ALL SOCKETS EVENTS GOES HERE
    private listen_to_sockets() {
        console.log("Listen to sockets");
        this.io.on('connection', client => {
            console.log("New connected client");

            // ALL SOCKETS EVENTS GOES BELOW HERE

            // CHAT DOMAIN
            // Messages
            chat_socket.get_message(client, this.io);
            // Room Login
            chat_socket.room_login(client, this.io);
            // Room Logout
            chat_socket.room_logout(client, this.io);
            // Room create
            chat_socket.room_create(client, this.io);
            // Room delete
            chat_socket.room_delete(client, this.io);

            // GRAL DOMAIN
            // Disconnected client
            socket.disconnect(client);
        });
    }

}