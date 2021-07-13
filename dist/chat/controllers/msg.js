"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
// Model
const user_1 = __importDefault(require("../../auth/models/user"));
const room_1 = __importDefault(require("../models/room"));
const chatuser_1 = __importDefault(require("../models/chatuser"));
const msg_1 = __importDefault(require("../models/msg"));
const chat_1 = require("../helpers/chat");
class MessageController {
    constructor() {
        this.add_message = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { uid, room_id, chatuser_nickname, msg } = req.body;
            try {
                // Main User exists?
                const user_db = yield user_1.default.findById(uid);
                if (!user_db) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Invalid main user'
                    });
                }
                ;
                // Room Exists?
                const room_db = yield room_1.default.findById(room_id);
                if (!room_db) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Room does not exists'
                    });
                }
                ;
                // Chat user exists?
                const chatuser_db = yield chatuser_1.default.findOne({ nickname: chatuser_nickname });
                if (!chatuser_db) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Chat user does not exists'
                    });
                }
                ;
                // Chat user belongs to main user (token)?
                if (user_db.id.toString() !== chatuser_db.user.toString()) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'The Chat user does not belong to the main user'
                    });
                }
                ;
                // Create message and save in DB
                const message_db = new msg_1.default({
                    msg,
                    created_at: Date.now(),
                    room: room_db.id,
                    chatuser: chatuser_db.id
                });
                yield message_db.save();
                // Update Room msgs array
                yield room_db.updateOne({
                    $push: {
                        msgs: {
                            _id: message_db.id
                        }
                    }
                });
                // Update Chatuser msgs array
                yield chatuser_db.updateOne({
                    $push: {
                        msgs: {
                            _id: message_db.id
                        }
                    }
                });
                return res.status(200).json({
                    ok: true,
                    msg: 'Message added to room',
                    message: {
                        _id: message_db.id,
                        msg: message_db.msg,
                        chatuser: chatuser_db.nickname,
                        room: room_db.name
                    }
                });
            }
            catch (error) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Please contact the administrator'
                });
            }
        });
        // Sockets Controllers
        this.add_message_sockets = (payload) => __awaiter(this, void 0, void 0, function* () {
            const { room_id, nickname, msg } = payload;
            const { uid } = payload.user_token;
            try {
                // Main User exists?
                const user_db = yield user_1.default.findById(uid);
                if (!user_db)
                    return { ok: false, msg: 'Invalid main user' };
                // Room Exists?
                const room_db = yield room_1.default.findById(room_id);
                if (!room_db)
                    return { ok: false, msg: 'Room does not exists' };
                // Chat user exists?
                const chatuser_db = yield chatuser_1.default.findOne({ nickname });
                if (!chatuser_db)
                    return { ok: false, msg: 'Chat user does not exists' };
                // Chat user belongs to main user (token)?
                if (user_db.id.toString() !== chatuser_db.user.toString())
                    return { ok: false, msg: 'The Chat user does not belong to the main user' };
                // Is chat user in room already?
                const is_chat_user_in_room = chat_1.it_belongs_to(room_db.chatusers, chatuser_db.id.toString());
                if (!is_chat_user_in_room)
                    return { ok: false, msg: 'The chat user is not connected to room' };
                // Create message and save in DB
                const message_db = new msg_1.default({
                    msg,
                    created_at: Date.now(),
                    room: room_db.id,
                    chatuser: chatuser_db.id
                });
                yield message_db.save();
                // Update Room msgs array
                yield room_db.updateOne({
                    $push: {
                        msgs: {
                            _id: message_db.id
                        }
                    }
                });
                // Update Chatuser msgs array
                yield chatuser_db.updateOne({
                    $push: {
                        msgs: {
                            _id: message_db.id
                        }
                    }
                });
                return {
                    ok: true,
                    msg: 'Message added to room',
                    message: {
                        _id: message_db.id,
                        msg: message_db.msg,
                        created_at: message_db.created_at,
                        room: room_db.id,
                        chatuser: chatuser_db
                    }
                };
            }
            catch (error) {
                return {
                    ok: false,
                    msg: 'Please contact the administrator'
                };
            }
        });
    }
}
exports.MessageController = MessageController;
