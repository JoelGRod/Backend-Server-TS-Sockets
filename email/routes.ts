import { Router } from 'express';
import { check } from 'express-validator';
// Custom validator
import validate_fields from '../shared/middlewares/validate-fields';
// Controllers
import { send_contact_email } from './controllers/email';

// API Router
const email_router = Router();

//////////////////////////////////////////////////////////////////
// Email Routes
//////////////////////////////////////////////////////////////////
email_router.post('/send_contact_email', [
    check('name', 'name is required').isLength({min: 3}),
    check('contact_email', 'email is required').isEmail(),
    check('subject', 'A subject is required').isLength({min: 3}),
    check('msg', 'A msg is required').isLength({min: 3}),
    validate_fields,   
], send_contact_email );

export default email_router;