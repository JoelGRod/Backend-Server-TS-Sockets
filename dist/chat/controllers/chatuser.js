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
exports.get_chat_user_rooms = exports.get_specific_chat_user = exports.delete_chat_user = exports.get_user_chat_users = exports.get_all_chat_users = exports.update_chat_user_info = exports.update_chat_user_nickname = exports.create_chat_user = void 0;
// Model
const user_1 = __importDefault(require("../../auth/models/user"));
const chatuser_1 = __importDefault(require("../models/chatuser"));
const room_1 = __importDefault(require("../models/room"));
const msg_1 = __importDefault(require("../models/msg"));
// Helpers
const chat_1 = require("../helpers/chat");
// Create new chat user
const create_chat_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickname, desc, photo, uid } = req.body;
    try {
        // Nickname exists?
        const chat_user = yield chatuser_1.default.findOne({ nickname });
        if (chat_user) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat User already exists'
            });
        }
        ;
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        // Create chat user
        const chat_user_db = new chatuser_1.default({
            nickname,
            desc,
            photo,
            created_at: Date.now(),
            user: user_db.id
        });
        // Save chat user in db
        yield chat_user_db.save();
        // Update user_db chat_users array
        yield user_db.updateOne({
            $push: {
                chatusers: {
                    _id: chat_user_db.id
                }
            }
        });
        // Succesful response
        return res.status(200).json({
            ok: true,
            msg: `Chat User ${nickname} added`,
            profile: {
                rooms: chat_user_db.rooms,
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
                desc: chat_user_db.desc,
                photo: chat_user_db.photo,
                created_at: chat_user_db.created_at,
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
exports.create_chat_user = create_chat_user;
// Update chat user nickname
const update_chat_user_nickname = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat_user_id, new_nickname, uid } = req.body;
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
        // chat_user belongs to main user?
        const is_chat_user_valid = chat_1.it_belongs_to(user_db.chatusers, chat_user_id);
        if (!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }
        ;
        // New Nickname exists?
        const chat_user = yield chatuser_1.default.findOne({ nickname: new_nickname });
        if (chat_user) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat User already exists'
            });
        }
        ;
        // Get chat user and modify it
        const chat_user_db = yield chatuser_1.default.findByIdAndUpdate(chat_user_id, {
            nickname: new_nickname,
            modified_at: Date.now()
        }, { new: true, useFindAndModify: false });
        // Succesful response
        return res.status(200).json({
            ok: true,
            msg: `Chat User Updated`,
            profile: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
                desc: chat_user_db.desc,
                photo: chat_user_db.photo,
                created_at: chat_user_db.created_at,
                modified_at: chat_user_db.modified_at
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
exports.update_chat_user_nickname = update_chat_user_nickname;
// Update chat user gral info (desc & photo)
const update_chat_user_info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat_user_id, new_desc, new_photo, uid } = req.body;
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
        // chat_user belongs to main user?
        const is_chat_user_valid = chat_1.it_belongs_to(user_db.chatusers, chat_user_id);
        if (!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }
        // Get chat user and modify it
        const chat_user_db = yield chatuser_1.default.findByIdAndUpdate(chat_user_id, {
            desc: new_desc,
            photo: new_photo,
            modified_at: Date.now()
        }, { new: true, useFindAndModify: false });
        // Succesful response
        return res.status(200).json({
            ok: true,
            msg: `Chat User Updated`,
            profile: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
                desc: chat_user_db.desc,
                photo: chat_user_db.photo,
                created_at: chat_user_db.created_at,
                modified_at: chat_user_db.modified_at
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
exports.update_chat_user_info = update_chat_user_info;
// Get all chat users 
const get_all_chat_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatusers = yield chatuser_1.default.find({}, { nickname: 1, desc: 1, photo: 1, _id: 0 });
        return res.status(200).json({
            ok: true,
            msg: 'get all chat users',
            chatusers
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.get_all_chat_users = get_all_chat_users;
// Get chat users from one main user
const get_user_chat_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    try {
        // Main User exists?
        const exclusions = "-__v -msgs -user";
        const user_db = yield user_1.default.findById(uid).populate('chatusers', exclusions);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        ;
        return res.status(200).json({
            ok: true,
            msg: 'get user chat users',
            profiles: user_db.chatusers
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.get_user_chat_users = get_user_chat_users;
// Delete one specific chat user
const delete_chat_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    const { chat_user_id } = req.query;
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
        // Chat user exists
        const chat_user_db = yield chatuser_1.default.findById(chat_user_id);
        if (!chat_user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat user does not exists'
            });
        }
        ;
        // chat_user belongs to main user?
        const is_chat_user_valid = chat_1.it_belongs_to(user_db.chatusers, chat_user_db.id);
        if (!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }
        ;
        ///////////////////////////////////////////////////////////////////////
        // STEP I: Delete chat user and msgs from rooms where is connected
        const connected_rooms = chat_user_db.rooms;
        // Get room
        // get chat users array 
        // delete chat user 
        // delete chat user msgs from room
        // save room with new chat user and room array
        // Move next room in array
        for (let room_id of connected_rooms) {
            const room_db = yield room_1.default.findById(room_id);
            const room_chat_users = room_db.chatusers.filter((id) => {
                return id != chat_user_id;
            });
            // Delete chat user msgs from room
            for (let msg of chat_user_db.msgs) {
                const id = room_db.msgs.indexOf(msg);
                if (id !== -1)
                    room_db.msgs.splice(id, 1);
            }
            ;
            yield room_db.updateOne({ chatusers: room_chat_users, msgs: room_db.msgs });
        }
        ;
        ///////////////////////////////////////////////////////////////////////
        // STEP II: Delete chat user from User
        const user_chat_users = user_db.chatusers.filter((id) => {
            return id != chat_user_id;
        });
        yield user_db.updateOne({ chatusers: user_chat_users });
        // STEP III: Delete chat user msgs from Msg
        for (let msg of chat_user_db.msgs) {
            yield msg_1.default.findByIdAndDelete(msg);
        }
        ;
        // STEP IV: Delete chat user
        yield chatuser_1.default.deleteOne({ _id: chat_user_id }, { new: true });
        return res.status(200).json({
            ok: true,
            msg: 'delete chat user',
            profile: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname
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
exports.delete_chat_user = delete_chat_user;
// Get specific profile
const get_specific_chat_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    const { profile_id } = req.query;
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
        // chatuserexists? and populate chatusers from room
        const chatuser_db = yield chatuser_1.default.findById(profile_id, { nickname: 1, desc: 1, photo: 1 });
        if (!chatuser_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Profile does not exists'
            });
        }
        ;
        // chat_user belongs to main user?
        const is_chat_user_valid = chat_1.it_belongs_to(user_db.chatusers, chatuser_db.id);
        if (!is_chat_user_valid) {
            return res.status(200).json({
                ok: false,
                msg: 'The chat user does not belong to the user',
                profile: chatuser_db
            });
        }
        ;
        return res.status(200).json({
            ok: true,
            msg: 'Get Profile',
            profile: chatuser_db
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.get_specific_chat_user = get_specific_chat_user;
// Get specific profile
const get_chat_user_rooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    const { profile_id } = req.query;
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
        // chatuserexists? and populate rooms chat user
        const exclusions = "-__v -chatusers -msgs -desc -photo -has_password -password -created_at -user";
        const chatuser_db = yield chatuser_1.default.findById(profile_id, { rooms: 1 }).populate('rooms', exclusions);
        if (!chatuser_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Profile does not exists'
            });
        }
        ;
        return res.status(200).json({
            ok: true,
            msg: 'Get Profile rooms',
            rooms: chatuser_db.rooms
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.get_chat_user_rooms = get_chat_user_rooms;
