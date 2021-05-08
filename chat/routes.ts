import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
// Custom validator
import validate_jwt from '../auth/middlewares/validate-jwt';
import validate_fields from '../shared/middlewares/validate-fields';
// Controllers
import { 
    create_chat_user, 
    delete_chat_user, 
    get_all_chat_users, 
    get_user_chat_users, 
    update_chat_user_info, 
    update_chat_user_nickname 
} from './controllers/chatuser';

import { 
    add_chat_user_chat_room,
    create_chat_room, 
    get_room_chat_users, 
    remove_chat_user_chat_room,
    delete_chat_room, 
    modify_room_name,
    modify_room_info,
    modify_room_password,
    get_all_chat_rooms
} from './controllers/room';


const chat_router = Router();

//////////////////////////////////////////////////////////////////
// Chat User Routes
//////////////////////////////////////////////////////////////////
chat_router.post('/create-chat-user', [
    check('nickname', 'nickname is required and must be unique').isLength({min: 3}),
    check('desc', 'desc is required').isLength({min: 3}),
    check('photo', 'photo url o no photo is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], create_chat_user);

chat_router.put('/update-chat-user-nickname', [
    check('new_nickname', 'nickname is required and must be unique').isLength({min: 3}),
    check('chat_user_id', 'chat user id is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], update_chat_user_nickname);

chat_router.put('/update-chat-user-info', [
    check('new_desc', 'desc is required').isLength({min: 3}),
    check('new_photo', 'photo is required').isLength({min: 3}),
    check('chat_user_id', 'chat user id is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], update_chat_user_info);

chat_router.get('/chat-users', [
    validate_jwt
], get_all_chat_users);

chat_router.get('/user-chat-users', [
    validate_jwt
], get_user_chat_users);

chat_router.delete('/delete-chat-user', [
    check('chat_user_id', 'chat user id is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], delete_chat_user);
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
// Room routes
//////////////////////////////////////////////////////////////////
chat_router.post('/create-chat-room', [
    check('room_name', 'name is required and must be unique').isLength({min: 3}),
    check('desc', 'desc or no desc msg is required').isLength({min: 3}),
    check('photo', 'photo url or no photo msg is required').isLength({min: 3}),
    check('password', 'password or no password msg is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], create_chat_room);

chat_router.put('/update-room-name', [
    check('new_name', 'Name is required and must be unique').isLength({min: 3}),
    check('room_id', 'Room id is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], modify_room_name);

chat_router.put('/update-room-info', [
    check('new_desc', 'Desc is required').isLength({min: 3}),
    check('new_photo', 'Photo is required').isLength({min: 3}),
    check('room_id', 'Room id is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], modify_room_info);

chat_router.put('/update-room-password', [
    check('new_password', 'New Password is required').isLength({min: 3}),
    check('old_password', 'Old password is required').isLength({min: 3}),
    check('room_id', 'Room id is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], modify_room_password);

chat_router.get('/room-chat-users', [
    check('room_id', 'Room ID is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], get_room_chat_users);

chat_router.get('/rooms', [
    validate_jwt
], get_all_chat_rooms);

chat_router.put('/add-chat-user-to-room', [
    check('room_id', 'Room ID is required').isLength({min: 3}),
    check('chat_user_id', 'Chat User ID is required').isLength({min: 3}),
    check('room_password', 'Room password is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], add_chat_user_chat_room);

chat_router.put('/remove-chat-user-from-room', [
    check('room_id', 'Room ID is required').isLength({min: 3}),
    check('chat_user_id', 'Chat User ID is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], remove_chat_user_chat_room);

chat_router.delete('/delete-chat-room', [
    check('room_id', 'Room ID is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], delete_chat_room);
//////////////////////////////////////////////////////////////////

export default chat_router;
