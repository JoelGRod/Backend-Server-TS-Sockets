import { Request, Response } from "express";
import { transport } from "../../server/email-config";

// Create new chat user
export const send_contact_email = async (req: Request, res: Response) => {
    const { name, contact_email, subject, msg } = req.body;

    try {

        const email_options = {
            from: 'joelgr@hotmail.es',
            to: 'joelgrdev@gmail.com',
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
                    err
                });
            } else {
                // Succesful response
                return res.status(200).json({
                    ok: true,
                    msg: `Email Sent`,
                    info
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