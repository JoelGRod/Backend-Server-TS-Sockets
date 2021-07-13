"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Custom validator
const validate_jwt_1 = __importDefault(require("./middlewares/validate-jwt"));
const validate_fields_1 = __importDefault(require("../shared/middlewares/validate-fields"));
// Controllers
const auth_1 = require("./controllers/auth");
const auth_router = express_1.Router();
auth_router.post('/new', [
    // Express validators - Adds an error to the request
    express_validator_1.check('name', 'User name is required').not().isEmpty(),
    express_validator_1.check('email', 'Email is required').isEmail(),
    express_validator_1.check('password', 'Password is required').isLength({ min: 6 }),
    validate_fields_1.default
], auth_1.create_user);
auth_router.post('/login', [
    express_validator_1.check('email', 'Email is required').isEmail(),
    express_validator_1.check('password', 'password is required').isLength({ min: 6 }),
    validate_fields_1.default
], auth_1.login_user);
auth_router.get('/renew', [
    validate_jwt_1.default
], auth_1.renew_token);
auth_router.get('/check_email', [
    express_validator_1.check('email', 'Email is required').isEmail(),
    validate_fields_1.default
], auth_1.check_email);
exports.default = auth_router;
