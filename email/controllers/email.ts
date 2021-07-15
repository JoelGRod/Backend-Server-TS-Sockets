import { Request, Response } from "express";
import { transporter_generator } from '../../server/oauth2';

// Create new chat user
export const send_contact_email = async (req: Request, res: Response) => {
    const { name, contact_email, subject, msg } = req.body;

    try {

        const transport = await transporter_generator();

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
            } else {
                // Succesful response
                return res.status(200).json({
                    ok: true,
                    msg: `Email Sent`
                });
            };
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}