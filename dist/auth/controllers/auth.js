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
exports.check_email = exports.renew_token = exports.login_user = exports.create_user = void 0;
// Model
const user_1 = __importDefault(require("../models/user"));
// Encrypt passwords
const bcrypt = __importStar(require("bcryptjs"));
// JWT
const jwt_1 = __importDefault(require("../helpers/jwt"));
const create_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Verify that the email does not exist
        // let user = await User.findOne({ email }); 
        const user = yield user_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already exists'
            });
        }
        ;
        // Create user with model
        const user_db = new user_1.default(req.body);
        // Encrypt/hash password
        const salt = bcrypt.genSaltSync(); // Default 10 rounds
        user_db.password = bcrypt.hashSync(password, salt);
        // Generate Json Web Token (this is not saved in database)
        const token = yield jwt_1.default(user_db.id, user_db.name);
        // Create user in DB
        yield user_db.save();
        // Successful response
        return res.status(201).json({
            ok: true,
            msg: `User ${user_db.name} created`
            // Delete this part of the response in future, 
            // you dont need this in a register action
            // uid: user_db.id,
            // name: user_db.name,
            // email: user_db.email,
            // token: token,
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.create_user = create_user;
const login_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // User exists? (email)
        const user_db = yield user_1.default.findOne({ email });
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Wrong credentials - Username does not exist' // In production change msg to 'Wrong credentials' for security reasons
            });
        }
        // Is the password correct??
        const is_correct_password = bcrypt.compareSync(password, user_db.password);
        if (!is_correct_password) {
            return res.status(400).json({
                ok: false,
                msg: 'Wrong credentials - Wrong password' // In production change msg to 'Wrong credentials' for security reasons
            });
        }
        // Generate JWT
        const token = yield jwt_1.default(user_db.id, user_db.name);
        // Successful response
        return res.status(201).json({
            ok: true,
            msg: `User ${user_db.name} logged`,
            uid: user_db.id,
            name: user_db.name,
            email: user_db.email,
            token: token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.login_user = login_user;
const renew_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, name } = req.body;
    try {
        // User exists? (email)
        const user_db = yield user_1.default.findById(uid)
            .populate('rooms', '-__v -password -msgs -chatusers -user')
            .populate('chatusers', '-msgs -__v -user');
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'User not found'
            });
        }
        // Generate JWT
        const token = yield jwt_1.default(uid, name);
        // Successful response
        return res.json({
            ok: true,
            msg: `User ${user_db.name} renew`,
            uid: user_db.id,
            name: user_db.name,
            email: user_db.email,
            token: token,
            rooms: user_db.rooms,
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
exports.renew_token = renew_token;
// Async validator ?
const check_email = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    try {
        // User exists? (email)
        const user_db = yield user_1.default.findOne({ email });
        if (user_db) {
            return res.status(200).json({
                ok: true,
                msg: 'Email already exists'
            });
        }
        else {
            return res.status(200).json({
                ok: false,
                msg: 'The email does not exist'
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.check_email = check_email;
