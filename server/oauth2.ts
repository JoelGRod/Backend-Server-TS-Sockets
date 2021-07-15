import nodemailer from 'nodemailer';
import { OAuth2Client } from "google-auth-library";

const oauth2_token = async () => {
    const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if(err) reject("Failed to create access token");
            resolve(token);
        });
    });

    return accessToken;
}

export const transporter_generator = async (): Promise<nodemailer.Transporter> => {

    const accessToken = await oauth2_token();

    const transport = nodemailer.createTransport({
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
}