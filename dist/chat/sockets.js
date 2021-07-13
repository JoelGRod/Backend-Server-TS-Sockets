"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.room_delete = exports.room_create = exports.room_logout = exports.room_login = exports.get_message = void 0;
// Middlewares
const validate_jwt_sockets_1 = __importDefault(require("../auth/middlewares/validate-jwt-sockets"));
// Controllers
const msg_1 = require("./controllers/msg");
const room_1 = require("./controllers/room");
// Messages
const get_message = (client, io) => {
    client.on('message', (payload, callback) => {
        // console.log('New message:', payload);
        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets_1.default(payload.token);
        if (!payload.user_token)
            return callback({ ok: false, msg: 'Invalid token' });
        // Controllers
        const msg_controller = new msg_1.MessageController();
        const controller_response = msg_controller.add_message_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            var _a, _b, _c, _d, _e;
            if (!resp.ok)
                return callback(resp);
            else {
                io.emit(`${resp.message.room}-new-message`, {
                    _id: (_a = resp.message) === null || _a === void 0 ? void 0 : _a._id,
                    msg: (_b = resp.message) === null || _b === void 0 ? void 0 : _b.msg,
                    created_at: (_c = resp.message) === null || _c === void 0 ? void 0 : _c.created_at,
                    chatuser: {
                        _id: (_d = resp.message) === null || _d === void 0 ? void 0 : _d.chatuser.id,
                        nickname: (_e = resp.message) === null || _e === void 0 ? void 0 : _e.chatuser.nickname
                    }
                });
                return callback(resp);
            }
        });
    });
};
exports.get_message = get_message;
// Room
const room_login = (client, io) => {
    client.on('login-user', (payload, callback) => {
        // console.log(payload.token, payload.room_id);
        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets_1.default(payload.token);
        if (!payload.user_token)
            return callback({ ok: false, msg: 'Invalid token' });
        // Controllers
        const controller_response = room_1.login_user_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            var _a, _b, _c;
            if (!resp.ok)
                return callback(resp);
            else {
                callback(resp);
                io.emit(`${resp.room._id}-login-user`, {
                    _id: resp.chatuser._id,
                    nickname: resp.chatuser.nickname,
                    desc: (_a = resp.chatuser) === null || _a === void 0 ? void 0 : _a.desc,
                    photo: (_b = resp.chatuser) === null || _b === void 0 ? void 0 : _b.photo,
                    created_at: (_c = resp.chatuser) === null || _c === void 0 ? void 0 : _c.created_at
                });
            }
            ;
        });
    });
};
exports.room_login = room_login;
const room_logout = (client, io) => {
    client.on('logout-user', (payload, callback) => {
        // console.log(payload.token, payload.room_id);
        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets_1.default(payload.token);
        if (!payload.user_token)
            return callback({ ok: false, msg: 'Invalid token' });
        // Controllers
        const controller_response = room_1.logout_user_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            if (!resp.ok)
                return callback(resp);
            else {
                callback(resp);
                io.emit(`${resp.room._id}-logout-user`, { nickname: resp.chatuser.nickname });
            }
            ;
        });
    });
};
exports.room_logout = room_logout;
const room_create = (client, io) => {
    client.on('create-room', (payload, callback) => {
        // console.log(payload.token, payload.room_id);
        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets_1.default(payload.token);
        if (!payload.user_token)
            return callback({ ok: false, msg: 'Invalid token' });
        // Controllers
        const controller_response = room_1.create_chat_room_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            if (!resp.ok)
                return callback(resp);
            else {
                callback(resp);
                io.emit(`new-room-created`, {
                    _id: resp.room._id,
                    name: resp.room.name,
                    desc: resp.room.desc,
                    photo: resp.room.photo,
                    has_password: resp.room.has_password,
                    created_at: resp.room.created_at
                });
            }
            ;
        });
    });
};
exports.room_create = room_create;
const room_delete = (client, io) => {
    client.on('delete-room', (payload, callback) => {
        // console.log(payload.token, payload.room_id);
        // Middlewares 
        // json web token (AUTH Domain)
        payload.user_token = validate_jwt_sockets_1.default(payload.token);
        if (!payload.user_token)
            return callback({ ok: false, msg: 'Invalid token' });
        // Controllers
        const controller_response = room_1.delete_chat_room_sockets(payload);
        // Callback and emit
        controller_response.then(resp => {
            if (!resp.ok)
                return callback(resp);
            else {
                callback(resp);
                io.emit(`room-deleted`, {
                    _id: resp.room._id,
                    name: resp.room.name,
                    desc: resp.room.desc,
                    photo: resp.room.photo,
                    has_password: resp.room.has_password,
                    created_at: resp.room.created_at
                });
            }
            ;
        });
    });
};
exports.room_delete = room_delete;
