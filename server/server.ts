import express from 'express';
import cors from 'cors';
import msg_router from '../messages/routes';
import socketIO from 'socket.io';
import http from 'http';

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

        this.http_server = new http.Server(this.app);
        this.io = new socketIO.Server(this.http_server);

        this.listen_to_sockets();
    }

    // Singleton
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    cors() {
        this.app.use(cors({origin: true, credentials: true}));
    }

    body_parse() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    // Domain routes
    define_routes() {
        this.app.use('/', msg_router);
    }

    start_server( callback: VoidFunction ) {
        this.http_server.listen( this.port, callback);
    }

    // Sockets
    private listen_to_sockets() {
        console.log("Listen to sockets");
        this.io.on('connection', client => {
            console.log("New connected client");
        });
    }

}