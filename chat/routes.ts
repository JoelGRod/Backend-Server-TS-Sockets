import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
// Custom validator
import validate_jwt from '../auth/middlewares/validate-jwt';
import validate_fields from '../shared/middlewares/validate-fields';
// Controllers
import { create_chat_user } from './controllers/chat';

const chat_router = Router();

chat_router.post('/create-chat-user', [
    check('nickname', 'nickname is required and must be unique').isLength({min: 3}),
    validate_fields,
    validate_jwt
], create_chat_user);

export default chat_router;
