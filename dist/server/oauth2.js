"use strict";
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
exports.transporter_generator = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const google_auth_library_1 = require("google-auth-library");
const oauth2_token = () => __awaiter(void 0, void 0, void 0, function* () {
    const oauth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_ID, process.env.GOOGLE_SECRET, "https://developers.google.com/oauthplayground");
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });
    const accessToken = yield new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err)
                reject("Failed to create access token");
            resolve(token);
        });
    });
    return accessToken;
});
const transporter_generator = () => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield oauth2_token();
    const transport = nodemailer_1.default.createTransport({
        service: String(process.env.EMAIL_SERVICE),
        auth: {
            type: "OAuth2",
            user: String(process.env.EMAIL_USER),
            accessToken: String(accessToken),
            clientId: String(process.env.GOOGLE_ID),
            clientSecret: String(process.env.GOOGLE_SECRET),
            refreshToken: String(process.env.REFRESH_TOKEN),
        }
    });
    return transport;
});
exports.transporter_generator = transporter_generator;
