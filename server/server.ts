import express from 'express';
import cors from 'cors';
import msg_router from '../messages/routes';

export default class Server {

    public app: express.Application;
    public port: number;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT);
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
        this.app.listen( this.port, callback);
    }

}