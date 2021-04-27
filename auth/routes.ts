import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
// Custom validator
import validate_jwt from './middlewares/validate-jwt';
import validate_fields from '../shared/middlewares/validate-fields';
// Controllers
import { create_user, login_user, renew_token, check_email } from './controllers/auth';

const auth_router = Router();

auth_router.post('/new', [
    // Express validators - Adds an error to the request
    check('name', 'User name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({min: 6}),
    validate_fields
], create_user );

auth_router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'password is required').isLength({min: 6}),
    validate_fields
], login_user );

auth_router.get('/renew', [
    validate_jwt
], renew_token );

auth_router.get('/check_email', [
    check('email', 'Email is required').isEmail(),
    validate_fields
], check_email);


export default auth_router;