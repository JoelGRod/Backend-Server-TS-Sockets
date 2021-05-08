import { Request, Response } from "express";
// Model
import User from '../models/user';
// Encrypt passwords
import * as bcrypt from 'bcryptjs';
// JWT
import create_jwt from '../helpers/jwt';


export const create_user = async ( req: Request, res: Response ) => {
    const { email, password } = req.body;

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
            msg: `User ${user_db.name} created`
            // Delete this part of the response in future, 
            // you dont need this in a register action
            // uid: user_db.id,
            // name: user_db.name,
            // email: user_db.email,
            // token: token,

        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

export const login_user = async ( req: Request, res: Response ) => {
    const { email, password } = req.body;

    try {
        // User exists? (email)
        const user_db = await User.findOne({ email });

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
        const token = await create_jwt(user_db.id, user_db.name);

        // Successful response
        return res.status(201).json({
            ok: true,
            msg: `User ${user_db.name} logged`,
            uid: user_db.id,
            name: user_db.name,
            email: user_db.email,
            token: token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

export const renew_token = async ( req: Request, res: Response ) => {
    const { uid, name } = req.body;

    try {
        // User exists? (email)
        const user_db = await User.findById(uid);
        if(!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'User not found'
            });
        }
        // Generate JWT
        const token = await create_jwt(uid, name);
        // Successful response
        return res.json({
            ok: true,
            msg: `User ${user_db.name} renew`,
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

// Async validator ?
export const check_email = async ( req: Request, res: Response ) => {

    const { email } = req.query;

    try {
        // User exists? (email)
        const user_db = await User.findOne({ email });
        if (user_db) {
            return res.status(200).json({
                ok: true,
                msg: 'Email already exists'
            });
        } else {
            return res.status(200).json({
                ok: false,
                msg: 'The email does not exist'
            });
        }

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}