"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTransport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailTransport {
    constructor() {
        this._transport = nodemailer_1.default.createTransport({
            service: String(process.env.EMAIL_SERVICE),
            auth: {
                user: String(process.env.EMAIL_USER),
                pass: String(process.env.EMAIL_PASS)
            }
        });
    }
    get transport() {
        return this._transport;
    }
}
exports.EmailTransport = EmailTransport;
