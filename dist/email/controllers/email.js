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
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_contact_email = void 0;
const oauth2_1 = require("../../server/oauth2");
// Create new chat user
const send_contact_email = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, contact_email, subject, msg } = req.body;
    try {
        const transport = yield oauth2_1.transporter_generator();
        const email_options = {
            from: String(process.env.EMAIL_USER),
            to: String(process.env.EMAIL_DESTINATION),
            subject: subject,
            html: `
                <strong>Nombre:</strong> ${name} <br/>
                <strong>E-mail:</strong> ${contact_email} <br/>
                <strong>Mensaje:</strong> ${msg}
            `
        };
        transport.sendMail(email_options, (err, info) => {
            if (err) {
                // Error response
                return res.status(400).json({
                    ok: false,
                    msg: `Error Email`,
                    error: err
                });
            }
            else {
                // Succesful response
                return res.status(200).json({
                    ok: true,
                    msg: `Email Sent`
                });
            }
            ;
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
});
exports.send_contact_email = send_contact_email;
