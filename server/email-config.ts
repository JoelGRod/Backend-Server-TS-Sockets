import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: String(process.env.EMAIL_USER),
        pass: String(process.env.EMAIL_PASS)
    }
});