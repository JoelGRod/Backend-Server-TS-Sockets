import { Request, Response } from "express";
// Model
import User from '../models/user';
// Encrypt passwords
import * as bcrypt from 'bcryptjs';
// JWT
import create_jwt from '../helpers/jwt';


export const create_user = async ( req: Request, res: Response ) => {
    const { name, email, password } = req.body;

    try {
        // Verify that the email does not exist
        // let user = await User.findOne({ email }); 
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already exists'
            });
        };

        // Create user with model
        const user_db = new User(req.body);

        // Encrypt/hash password
        const salt = bcrypt.genSaltSync();  // Default 10 rounds
        user_db.password = bcrypt.hashSync(password, salt);

        // Generate Json Web Token (this is not saved in database)
        const token = await create_jwt(user_db.id, user_db.name);

        // Create user in DB
        await user_db.save();

        // Successful response
        return res.status(201).json({
            ok: true,
            // Delete this part of the response in future, 
            // you dont need this in a register action
            uid: user_db.id,
            name: user_db.name,
            email: user_db.email,
            token: token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

export const login_user = async ( req: Request, res: Response ) => {
    return res.json({
        ok: true,
        msg: 'Login user'
    })
}

export const renew_token = async ( req: Request, res: Response ) => {
    return res.json({
        ok: true,
        msg: 'Renew token'
    })
}