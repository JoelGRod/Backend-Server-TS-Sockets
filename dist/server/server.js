"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
// Sockets events
const socket = __importStar(require("./sockets"));
const chat_socket = __importStar(require("../chat/sockets"));
// DB connection
const db_config_1 = __importDefault(require("./db-config"));
// Routes
const routes_1 = __importDefault(require("../auth/routes"));
const routes_2 = __importDefault(require("../chat/routes"));
const routes_3 = __importDefault(require("../email/routes"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = Number(process.env.PORT);
        // DB Connection
        db_config_1.default();
        // Sockets
        this.http_server = new http_1.default.Server(this.app);
        this.io = new socket_io_1.default.Server(this.http_server, {
            cors: {
                origin: true,
                credentials: true
            }
        });
        this.listen_to_sockets();
    }
    // Singleton
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    // Express cors
    cors() {
        this.app.use(cors_1.default({ origin: true, credentials: true }));
    }
    body_parse() {
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
    }
    // Domain routes
    define_routes() {
        this.app.use('/api/auth/', routes_1.default);
        this.app.use('/api/chat/', routes_2.default);
        this.app.use('/api/email/', routes_3.default);
    }
    // Public directory
    define_public() {
        this.app.use(express_1.default.static('public'));
    }
    // Define extra routes
    define_extra_routes() {
        this.app.get('*', (req, res) => {
            res.sendFile(path_1.default.resolve(__dirname, '../../public/index.html'));
        });
    }
    // Server
    start_server(callback) {
        this.http_server.listen(this.port, callback);
    }
    // Sockets - ALL SOCKETS EVENTS GOES HERE
    listen_to_sockets() {
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
exports.default = Server;
