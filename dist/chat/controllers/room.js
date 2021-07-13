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
exports.delete_chat_room_sockets = exports.create_chat_room_sockets = exports.logout_user_sockets = exports.login_user_sockets = exports.check_if_user_can_enter = exports.get_specific_chat_room = exports.delete_chat_room = exports.get_room_chat_users = exports.remove_chat_user_chat_room = exports.add_chat_user_chat_room = exports.get_main_user_chat_rooms = exports.get_all_chat_rooms = exports.modify_room_password = exports.modify_room_info = exports.modify_room_name = exports.create_chat_room = void 0;
// Encrypt passwords
const bcrypt = __importStar(require("bcryptjs"));
// Model
const user_1 = __importDefault(require("../../auth/models/user"));
const room_1 = __importDefault(require("../models/room"));
const chatuser_1 = __importDefault(require("../models/chatuser"));
const msg_1 = __importDefault(require("../models/msg"));
// Helpers
const chat_1 = require("../helpers/chat");
/* ------------------------ HTTP CONTROLLERS -------------------------------- */
// Create Chat Room
const create_chat_room = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { room_name, desc, photo, has_password, password, uid } = req.body;
    try {
        // Room name exists?
        const room = yield room_1.default.findOne({ name: room_name });
        if (room) {
            return res.status(400).json({
                ok: false,
                msg: 'Room name already exists'
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
        ;
        // Create chat room
        const room_db = new room_1.default({
            name: room_name,
            desc,
            photo,
            has_password,
            password,
            created_at: Date.now(),
            user: user_db.id
        });
        if (room_db.has_password) {
            // Encrypt/hash password
            const salt = bcrypt.genSaltSync(); // Default 10 rounds
            room_db.password = bcrypt.hashSync(password, salt);
        }
        // Save chat user in db
        yield room_db.save();
        // Update user_db chat_users array
        yield user_db.updateOne({
            $push: {
                rooms: {
                    _id: room_db.id
                }
            }
        });
        // Succesful response
        return res.status(200).json({
            ok: true,
            msg: 'room created',
            room: {
                _id: room_db.id,
                name: room_db.name,
                desc: room_db.desc,
                photo: room_db.photo,
                has_password: room_db.has_password,
                created_at: room_db.created_at
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator',
            error
        });
    }
});
exports.create_chat_room = create_chat_room;
// Modify Room Name
const modify_room_name = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, room_id, new_name } = req.body;
    try {
        // Main User exists
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        ;
        // Room exists
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        // Room belongs to main user?
        if (user_db.id.toString() !== room_db.user.toString()) {
            return res.status(400).json({
                ok: false,
                msg: 'The Room does not belong to the user'
            });
        }
        ;
        // New Room name exists?
        const exists = yield room_1.default.findOne({ name: new_name });
        if (exists) {
            return res.status(400).json({
                ok: false,
                msg: 'Room name already exists'
            });
        }
        ;
        // Modify Room name
        room_db.name = new_name;
        room_db.modified_at = Date.now();
        yield room_db.save();
        return res.status(200).json({
            ok: true,
            msg: 'Room name modified',
            room: {
                _id: room_db.id,
                name: room_db.name
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
exports.modify_room_name = modify_room_name;
// Modify Room info
const modify_room_info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, room_id, new_desc, new_photo } = req.body;
    try {
        // Main User exists
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        ;
        // Room exists
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        ;
        // Room belongs to main user?
        if (user_db.id.toString() !== room_db.user.toString()) {
            return res.status(400).json({
                ok: false,
                msg: 'The Room does not belong to the user'
            });
        }
        ;
        // Modify Room info
        room_db.desc = new_desc;
        room_db.photo = new_photo;
        room_db.modified_at = Date.now();
        yield room_db.save();
        return res.status(200).json({
            ok: true,
            msg: 'Room info modified',
            room: {
                _id: room_db.id,
                name: room_db.name,
                desc: room_db.desc,
                photo: room_db.photo
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
exports.modify_room_info = modify_room_info;
// Modify Room password
const modify_room_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, room_id, new_password, old_password } = req.body;
    try {
        // Main User exists
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        ;
        // Room exists
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        ;
        // Room belongs to main user?
        if (user_db.id.toString() !== room_db.user.toString()) {
            return res.status(400).json({
                ok: false,
                msg: 'The Room does not belong to the user'
            });
        }
        ;
        // Is the chat room old password correct??
        if (room_db.has_password) {
            const is_correct_password = bcrypt.compareSync(old_password, room_db.password);
            if (!is_correct_password) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Wrong room old password'
                });
            }
            ;
        }
        // Modify Room info
        // Encrypt/hash password
        const salt = bcrypt.genSaltSync(); // Default 10 rounds
        room_db.password = bcrypt.hashSync(new_password, salt);
        room_db.modified_at = Date.now();
        room_db.has_password = true;
        yield room_db.save();
        return res.status(200).json({
            ok: true,
            msg: 'Room password modified',
            room: {
                _id: room_db.id,
                name: room_db.name
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
exports.modify_room_password = modify_room_password;
// Get All chat rooms
const get_all_chat_rooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield room_1.default.find({}, { name: 1, desc: 1, photo: 1, created_at: 1, has_password: 1 });
        return res.status(200).json({
            ok: true,
            msg: 'All chat rooms',
            rooms
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.get_all_chat_rooms = get_all_chat_rooms;
// Get Main user chat rooms (rooms created by him/her)
const get_main_user_chat_rooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    try {
        // Main User exists?
        const exclusions = "-__v -chatusers -msgs -password -user";
        const user_db = yield user_1.default.findById(uid).populate('rooms', exclusions);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        ;
        return res.status(200).json({
            ok: true,
            msg: 'Get user created Rooms',
            rooms: user_db.rooms
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.get_main_user_chat_rooms = get_main_user_chat_rooms;
// Add chat user to chat room
const add_chat_user_chat_room = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { room_id, chat_user_id, room_password, uid } = req.body;
    try {
        // Security Validations
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        ;
        // Room exists?
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        // chat user exists
        const chat_user_db = yield chatuser_1.default.findById(chat_user_id);
        if (!chat_user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat user does not exists'
            });
        }
        // chat_user belongs to main user?
        const is_chat_user_valid = chat_1.it_belongs_to(user_db.chatusers, chat_user_id);
        if (!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }
        // Is the chat room password correct??
        if (room_db.has_password) {
            const is_correct_password = bcrypt.compareSync(room_password, room_db.password);
            if (!is_correct_password) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Wrong room password'
                });
            }
        }
        // Is user chat in room already?
        const is_chat_user_in_room = chat_1.it_belongs_to(room_db.chatusers, chat_user_id);
        if (is_chat_user_in_room) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user is already connected'
            });
        }
        // Is another main user chat user connected to room
        const is_another_main_user_profile_connected = chat_1.is_another_user_profile_connected(user_db.chatusers, room_db.chatusers);
        if (is_another_main_user_profile_connected) {
            return res.status(400).json({
                ok: false,
                msg: 'The User has another profile connected'
            });
        }
        // Add chat user to room
        // STEP I: Update room_db chat_users array
        yield room_db.updateOne({
            $push: {
                chatusers: {
                    _id: chat_user_db.id
                }
            }
        });
        // STEP II: Update chat_user_db rooms array
        yield chat_user_db.updateOne({
            $push: {
                rooms: {
                    _id: room_db.id
                }
            }
        });
        return res.status(200).json({
            ok: true,
            msg: 'chat user connected to room',
            chatuser: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
            },
            room: {
                _id: room_db.id,
                name: room_db.name
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
exports.add_chat_user_chat_room = add_chat_user_chat_room;
// remove user from chat room
const remove_chat_user_chat_room = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { room_id, chat_user_id, uid } = req.body;
    try {
        // Security Validations
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        ;
        // Room exists?
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        // chat user exists
        const chat_user_db = yield chatuser_1.default.findById(chat_user_id);
        if (!chat_user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat user does not exists'
            });
        }
        // chat_user belongs to main user?
        const is_chat_user_valid = chat_1.it_belongs_to(user_db.chatusers, chat_user_id);
        if (!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }
        // Is user chat in room already?
        const is_chat_user_in_room = chat_1.it_belongs_to(room_db.chatusers, chat_user_id);
        if (!is_chat_user_in_room) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user is not connected to room'
            });
        }
        // Remove chat user from Room
        // STEP I: Remove chat user from Room chat users array
        const room_chat_users = room_db.chatusers.filter(function (id) {
            return id != chat_user_db.id;
        });
        yield room_db.updateOne({ chatusers: room_chat_users });
        // STEP II: Remove room from Chat_user rooms array
        const chat_user_rooms = chat_user_db.rooms.filter(function (id) {
            return id != room_db.id;
        });
        yield chat_user_db.updateOne({ rooms: chat_user_rooms });
        return res.status(200).json({
            ok: true,
            msg: 'Removed user from room',
            chatuser: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
            },
            room: {
                _id: room_db.id,
                name: room_db.name
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
exports.remove_chat_user_chat_room = remove_chat_user_chat_room;
// Get all chat users from a room
const get_room_chat_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    const { room_id } = req.query;
    try {
        // Security Validations
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        // Room exists? and populate chatusers from room
        const exclusions = '-rooms -msgs -desc -user -modified_at -__v';
        const room_db = yield room_1.default.findById(room_id).populate('chatusers', exclusions);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'chat users from room',
            room: {
                _id: room_db.id,
                name: room_db.name
            },
            profiles: room_db.chatusers
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.get_room_chat_users = get_room_chat_users;
// Delete chat room
const delete_chat_room = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    const { room_id } = req.query;
    try {
        // Security Validations
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
        ;
        // Room exists
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        ;
        // Room belongs to main user? is main user the creator?
        const is_room_valid = chat_1.it_belongs_to(user_db.rooms, room_db.id);
        if (!is_room_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The Room does not belong to the main user'
            });
        }
        ;
        ///////////////////////////////////////////////////////////////////////
        // STEP I: Delete chat room from every chat_user rooms array
        const connected_users = room_db.chatusers;
        // Get chat_user
        // get rooms array 
        // delete room 
        // save chat_user with new room array
        // Move next chat_user in array
        for (let chat_user_id of connected_users) {
            const chat_user_db = yield chatuser_1.default.findById(chat_user_id);
            const chat_user_rooms = chat_user_db.rooms.filter((id) => {
                return id != room_id;
            });
            // Delete room msgs from chat user msgs
            for (let msg of room_db.msgs) {
                const id = chat_user_db.msgs.indexOf(msg);
                if (id !== -1)
                    chat_user_db.msgs.splice(id, 1);
            }
            ;
            yield chat_user_db.updateOne({ rooms: chat_user_rooms, msgs: chat_user_db.msgs });
        }
        ;
        ///////////////////////////////////////////////////////////////////////
        // STEP II: Delete room from User
        const user_rooms = user_db.rooms.filter((id) => {
            return id != room_id;
        });
        yield user_db.updateOne({ rooms: user_rooms });
        // STEP III: Delete room msgs from Msg
        for (let msg of room_db.msgs) {
            yield msg_1.default.findByIdAndDelete(msg);
        }
        ;
        // STEP IV: Delete room
        yield room_1.default.deleteOne({ _id: room_id }, { new: true });
        return res.status(200).json({
            ok: true,
            msg: 'room deleted',
            room: {
                _id: room_db.id,
                name: room_db.name,
                desc: room_db.desc,
                photo: room_db.photo,
                has_password: room_db.has_password,
                created_at: room_db.created_at
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
exports.delete_chat_room = delete_chat_room;
// Get specific chat room
const get_specific_chat_room = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    const { room_id } = req.query;
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
        // Room exists? and populate chatusers from room
        const chatusers_exc = '-rooms -msgs -modified_at -user -__v';
        const room_db = yield room_1.default.findById(room_id)
            .populate('chatusers', chatusers_exc)
            .populate({
            path: 'msgs',
            select: '_id msg created_at chatuser',
            populate: {
                path: 'chatuser',
                select: 'nickname'
            }
        });
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Get Room',
            room: {
                profiles: room_db.chatusers,
                msgs: room_db.msgs,
                _id: room_db.id,
                name: room_db.name,
                desc: room_db.desc,
                photo: room_db.photo,
                has_password: room_db.has_password,
                created_at: room_db.created_at,
                user: room_db.user
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
exports.get_specific_chat_room = get_specific_chat_room;
// Does the user have the proper permission to enter?
const check_if_user_can_enter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    const { room_id, profile_id } = req.query;
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
        // Room exists?
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }
        ;
        // profile exists?
        const profile_db = yield chatuser_1.default.findById(profile_id);
        if (!profile_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Profile does not exists'
            });
        }
        ;
        // chat_user belongs to main user?
        const is_chat_user_valid = chat_1.it_belongs_to(user_db.chatusers, profile_db.id);
        if (!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }
        ;
        // is profile logged in room?
        const is_chat_user_logged = chat_1.it_belongs_to(room_db.chatusers, profile_db.id);
        if (!is_chat_user_logged) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user is not logged in!!'
            });
        }
        ;
        return res.status(200).json({
            ok: true,
            msg: 'Profile can enter the room'
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.check_if_user_can_enter = check_if_user_can_enter;
/* ------------------------ SOCKETS CONTROLLERS -------------------------------- */
const login_user_sockets = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { room_id, nickname, password } = payload;
    const { uid } = payload.user_token;
    try {
        // Security Validations
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db)
            return { ok: false, msg: 'Invalid main user' };
        // Room exists?
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db)
            return { ok: false, msg: 'Room does not exists' };
        // chat user exists
        const chatuser_db = yield chatuser_1.default.findOne({ nickname });
        if (!chatuser_db)
            return { ok: false, msg: 'Chat user does not exists' };
        // Chat user belongs to main user (token)?
        if (user_db.id.toString() !== chatuser_db.user.toString())
            return { ok: false, msg: 'The Chat user does not belong to the main user' };
        // Is the chat room password correct??
        if (room_db.has_password) {
            const is_correct_password = bcrypt.compareSync(password, room_db.password);
            if (!is_correct_password)
                return { ok: false, msg: 'Wrong room password' };
        }
        // Is user chat in room already?
        const is_chat_user_in_room = chat_1.it_belongs_to(room_db.chatusers, chatuser_db.id.toString());
        if (is_chat_user_in_room)
            return { ok: false, msg: 'The chat user is already connected' };
        // Is another main user chat user connected to room
        const is_another_main_user_profile_connected = chat_1.is_another_user_profile_connected(user_db.chatusers, room_db.chatusers);
        if (is_another_main_user_profile_connected)
            return { ok: false, msg: 'The User has another profile connected' };
        // Add chat user to room
        // STEP I: Update room_db chat_users array
        yield room_db.updateOne({
            $push: {
                chatusers: {
                    _id: chatuser_db.id
                }
            }
        });
        // STEP II: Update chat_user_db rooms array
        yield chatuser_db.updateOne({
            $push: {
                rooms: {
                    _id: room_db.id
                }
            }
        });
        return {
            ok: true,
            msg: 'chat user connected to room',
            chatuser: {
                _id: chatuser_db.id,
                nickname: chatuser_db.nickname,
                desc: chatuser_db.desc,
                photo: chatuser_db.photo,
                created_at: chatuser_db.created_at
            },
            room: {
                _id: room_db.id,
                name: room_db.name
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
exports.login_user_sockets = login_user_sockets;
const logout_user_sockets = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { room_id, nickname } = payload;
    const { uid } = payload.user_token;
    try {
        // Security Validations
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db)
            return { ok: false, msg: 'Invalid main user' };
        // Room exists?
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db)
            return { ok: false, msg: 'Room does not exists' };
        // chat user exists?
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
        // Remove chat user from Room
        // STEP I: Remove chat user from Room chat users array
        const room_chat_users = room_db.chatusers.filter(function (id) {
            return id != chatuser_db.id;
        });
        yield room_db.updateOne({ chatusers: room_chat_users });
        // STEP II: Remove room from Chat_user rooms array
        const chat_user_rooms = chatuser_db.rooms.filter(function (id) {
            return id != room_db.id;
        });
        yield chatuser_db.updateOne({ rooms: chat_user_rooms });
        return {
            ok: true,
            msg: 'Removed user from room',
            chatuser: {
                _id: chatuser_db.id,
                nickname: chatuser_db.nickname
            },
            room: {
                _id: room_db.id,
                name: room_db.name
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
exports.logout_user_sockets = logout_user_sockets;
const create_chat_room_sockets = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { room_name, desc, photo, has_password, password } = payload;
    const { uid } = payload.user_token;
    try {
        // Room name exists?
        const room = yield room_1.default.findOne({ name: room_name });
        if (room) {
            return { ok: false, msg: 'Room name already exists' };
        }
        ;
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return { ok: false, msg: 'Invalid main user' };
        }
        ;
        // Create chat room
        const room_db = new room_1.default({
            name: room_name,
            desc,
            photo,
            has_password,
            password,
            created_at: Date.now(),
            user: user_db.id
        });
        if (room_db.has_password) {
            // Encrypt/hash password
            const salt = bcrypt.genSaltSync(); // Default 10 rounds
            room_db.password = bcrypt.hashSync(password, salt);
        }
        // Save chat user in db
        yield room_db.save();
        // Update user_db chat_users array
        yield user_db.updateOne({
            $push: {
                rooms: {
                    _id: room_db.id
                }
            }
        });
        // Succesful response
        return {
            ok: true,
            msg: 'room created',
            room: {
                _id: room_db.id,
                name: room_db.name,
                desc: room_db.desc,
                photo: room_db.photo,
                has_password: room_db.has_password,
                created_at: room_db.created_at
            }
        };
    }
    catch (error) {
        return { ok: false, msg: 'Please contact the administrator' };
    }
});
exports.create_chat_room_sockets = create_chat_room_sockets;
const delete_chat_room_sockets = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = payload.user_token;
    const { room_id } = payload;
    try {
        // Security Validations
        // Main User exists?
        const user_db = yield user_1.default.findById(uid);
        if (!user_db) {
            return { ok: false, msg: 'Invalid main user' };
        }
        ;
        // Room exists
        const room_db = yield room_1.default.findById(room_id);
        if (!room_db) {
            return { ok: false, msg: 'Room does not exists' };
        }
        ;
        // Room belongs to main user? is main user the creator?
        const is_room_valid = chat_1.it_belongs_to(user_db.rooms, room_db.id);
        if (!is_room_valid) {
            return { ok: false, msg: 'The Room does not belong to the main user' };
        }
        ;
        ///////////////////////////////////////////////////////////////////////
        // STEP I: Delete chat room from every chat_user rooms array
        const connected_users = room_db.chatusers;
        for (let chat_user_id of connected_users) {
            const chat_user_db = yield chatuser_1.default.findById(chat_user_id);
            const chat_user_rooms = chat_user_db.rooms.filter((id) => {
                return id != room_id;
            });
            // Delete room msgs from chat user msgs
            for (let msg of room_db.msgs) {
                const id = chat_user_db.msgs.indexOf(msg);
                if (id !== -1)
                    chat_user_db.msgs.splice(id, 1);
            }
            ;
            yield chat_user_db.updateOne({ rooms: chat_user_rooms, msgs: chat_user_db.msgs });
        }
        ;
        ///////////////////////////////////////////////////////////////////////
        // STEP II: Delete room from User
        const user_rooms = user_db.rooms.filter((id) => {
            return id != room_id;
        });
        yield user_db.updateOne({ rooms: user_rooms });
        // STEP III: Delete room msgs from Msg
        for (let msg of room_db.msgs) {
            yield msg_1.default.findByIdAndDelete(msg);
        }
        ;
        // STEP III: Delete room
        yield room_1.default.deleteOne({ _id: room_id }, { new: true });
        return {
            ok: true,
            msg: 'room deleted',
            room: {
                _id: room_db.id,
                name: room_db.name,
                desc: room_db.desc,
                photo: room_db.photo,
                has_password: room_db.has_password,
                created_at: room_db.created_at
            }
        };
    }
    catch (error) {
        return { ok: false, msg: 'Please contact the administrator' };
    }
});
exports.delete_chat_room_sockets = delete_chat_room_sockets;
