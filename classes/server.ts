import express from 'express';

export default class Server {

    public app: express.Application;
    public port: number;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT);
    }

    start( callback: VoidFunction ) {
        this.app.listen( this.port, callback);
    }

}