"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Custom validator
const validate_jwt_1 = __importDefault(require("../auth/middlewares/validate-jwt"));
const validate_fields_1 = __importDefault(require("../shared/middlewares/validate-fields"));
// Controllers
const chatuser_1 = require("./controllers/chatuser");
const room_1 = require("./controllers/room");
const msg_1 = require("./controllers/msg"); // Class controller (above alternative)
const msg = new msg_1.MessageController();
// API Router
const chat_router = express_1.Router();
//////////////////////////////////////////////////////////////////
// Chat User Routes
//////////////////////////////////////////////////////////////////
chat_router.post('/create-chat-user', [
    express_validator_1.check('nickname', 'nickname is required and must be unique').isLength({ min: 3 }),
    express_validator_1.check('desc', 'desc is required').isLength({ min: 3 }),
    express_validator_1.check('photo', 'photo url o no photo is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], chatuser_1.create_chat_user);
chat_router.put('/update-chat-user-nickname', [
    express_validator_1.check('new_nickname', 'nickname is required and must be unique').isLength({ min: 3 }),
    express_validator_1.check('chat_user_id', 'chat user id is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], chatuser_1.update_chat_user_nickname);
chat_router.put('/update-chat-user-info', [
    express_validator_1.check('new_desc', 'desc is required').isLength({ min: 3 }),
    express_validator_1.check('new_photo', 'photo is required').isLength({ min: 3 }),
    express_validator_1.check('chat_user_id', 'chat user id is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], chatuser_1.update_chat_user_info);
chat_router.get('/chat-users', [
    validate_jwt_1.default
], chatuser_1.get_all_chat_users);
chat_router.get('/chat-user', [
    express_validator_1.check('profile_id', 'Profile ID is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], chatuser_1.get_specific_chat_user);
chat_router.get('/chat-user-rooms', [
    express_validator_1.check('profile_id', 'Profile ID is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], chatuser_1.get_chat_user_rooms);
chat_router.get('/user-chat-users', [
    validate_jwt_1.default
], chatuser_1.get_user_chat_users);
chat_router.delete('/delete-chat-user', [
    express_validator_1.check('chat_user_id', 'chat user id is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], chatuser_1.delete_chat_user);
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// Room routes
//////////////////////////////////////////////////////////////////
chat_router.post('/create-chat-room', [
    express_validator_1.check('room_name', 'name is required and must be unique').isLength({ min: 3 }),
    express_validator_1.check('desc', 'desc or no desc msg is required').isLength({ min: 3 }),
    express_validator_1.check('photo', 'photo url or no photo msg is required').isLength({ min: 3 }),
    express_validator_1.check('has_password', 'has password is required'),
    express_validator_1.check('password', 'password or empty password is required'),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.create_chat_room);
chat_router.put('/update-room-name', [
    express_validator_1.check('new_name', 'Name is required and must be unique').isLength({ min: 3 }),
    express_validator_1.check('room_id', 'Room id is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.modify_room_name);
chat_router.put('/update-room-info', [
    express_validator_1.check('new_desc', 'Desc is required').isLength({ min: 3 }),
    express_validator_1.check('new_photo', 'Photo is required').isLength({ min: 3 }),
    express_validator_1.check('room_id', 'Room id is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.modify_room_info);
chat_router.put('/update-room-password', [
    express_validator_1.check('new_password', 'New Password is required').isLength({ min: 3 }),
    express_validator_1.check('old_password', 'Old password is required'),
    express_validator_1.check('room_id', 'Room id is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.modify_room_password);
chat_router.get('/room-chat-users', [
    express_validator_1.check('room_id', 'Room ID is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.get_room_chat_users);
chat_router.get('/room', [
    express_validator_1.check('room_id', 'Room ID is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.get_specific_chat_room);
chat_router.get('/rooms', [
    validate_jwt_1.default
], room_1.get_all_chat_rooms);
chat_router.get('/rooms-user', [
    validate_jwt_1.default
], room_1.get_main_user_chat_rooms);
chat_router.put('/add-chat-user-to-room', [
    express_validator_1.check('room_id', 'Room ID is required').isLength({ min: 3 }),
    express_validator_1.check('chat_user_id', 'Chat User ID is required').isLength({ min: 3 }),
    express_validator_1.check('room_password', 'Room password is required').isLength({ min: 0 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.add_chat_user_chat_room);
chat_router.put('/remove-chat-user-from-room', [
    express_validator_1.check('room_id', 'Room ID is required').isLength({ min: 3 }),
    express_validator_1.check('chat_user_id', 'Chat User ID is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.remove_chat_user_chat_room);
chat_router.delete('/delete-chat-room', [
    express_validator_1.check('room_id', 'Room ID is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.delete_chat_room);
chat_router.get('/check-room-login', [
    express_validator_1.check('room_id', 'Room ID is required').isLength({ min: 3 }),
    express_validator_1.check('profile_id', 'Room ID is required').isLength({ min: 3 }),
    validate_fields_1.default,
    validate_jwt_1.default
], room_1.check_if_user_can_enter);
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// Message Routes
//////////////////////////////////////////////////////////////////
chat_router.post('/message-add', [
    express_validator_1.check('room_id', 'Room Id is required').isLength({ min: 3 }),
    express_validator_1.check('chatuser_nickname', 'Nickname is required').isLength({ min: 3 }),
    express_validator_1.check('msg', 'msg is required').isLength({ min: 1 }),
    validate_fields_1.default,
    validate_jwt_1.default
], msg.add_message);
exports.default = chat_router;
