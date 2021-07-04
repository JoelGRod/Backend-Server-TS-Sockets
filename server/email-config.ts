import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
    service: String(process.env.EMAIL_SERVICE),
    auth: {
        user: String(process.env.EMAIL_USER),
        pass: String(process.env.EMAIL_PASS)
    }
});