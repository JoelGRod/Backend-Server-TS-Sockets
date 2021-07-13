"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Custom validator
const validate_fields_1 = __importDefault(require("../shared/middlewares/validate-fields"));
// Controllers
const email_1 = require("./controllers/email");
// API Router
const email_router = express_1.Router();
//////////////////////////////////////////////////////////////////
// Email Routes
//////////////////////////////////////////////////////////////////
email_router.post('/send_contact_email', [
    express_validator_1.check('name', 'name is required').isLength({ min: 3 }),
    express_validator_1.check('contact_email', 'email is required').isEmail(),
    express_validator_1.check('subject', 'A subject is required').isLength({ min: 3 }),
    express_validator_1.check('msg', 'A msg is required').isLength({ min: 3 }),
    validate_fields_1.default,
], email_1.send_contact_email);
exports.default = email_router;
