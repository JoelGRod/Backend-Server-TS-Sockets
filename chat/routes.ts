import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
// Custom validator
import validate_jwt from '../auth/middlewares/validate-jwt';
import validate_fields from '../shared/middlewares/validate-fields';
// Controllers
import { create_chat_user, update_chat_user_info, update_chat_user_nickname } from './controllers/chatuser';


const chat_router = Router();

chat_router.post('/create-chat-user', [
    check('nickname', 'nickname is required and must be unique').isLength({min: 3}),
    check('desc', 'desc is required').isLength({min: 3}),
    check('photo', 'photo url o no photo is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], create_chat_user);

chat_router.put('/update-chat-user-nickname', [
    check('new_nickname', 'nickname is required and must be unique').isLength({min: 3}),
    validate_fields,
    validate_jwt
], update_chat_user_nickname);

chat_router.put('/update-chat-user-info', [
    check('new_desc', 'desc is required').isLength({min: 3}),
    check('new_photo', 'photo is required').isLength({min: 3}),
    validate_fields,
    validate_jwt
], update_chat_user_info);


export default chat_router;
