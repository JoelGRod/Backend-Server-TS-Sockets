import { Request, Response } from "express";
// Encrypt passwords
import * as bcrypt from 'bcryptjs';
// Model
import User from '../../auth/models/user';
import Room from '../models/room';
import ChatUser from '../models/chatuser';

// Create Chat Room
export const create_chat_room = async (req: Request, res: Response) => { 
    //TODO
    const { name, desc, photo, password, uid } = req.body;
    try {
        // Room name exists?
        const room = await Room.findOne({name});
        if(room) {
            return res.status(400).json({
                ok: false,
                msg: 'Room name already exists'
            });
        };

        // Main User exists?
        const user_db = await User.findById(uid);
        if(!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }
 
        // Create chat room
        const room_db = new Room({
            name,
            desc,
            photo,
            password,
            created_at: Date.now()
        });
        // Encrypt/hash password
        const salt = bcrypt.genSaltSync();  // Default 10 rounds
        room_db.password = bcrypt.hashSync(password, salt);
        // Save chat user in db
        await room_db.save();
        // Update user_db chat_users array
        await user_db.updateOne({
            $push: {
                rooms: {
                    _id: room_db.id
                }
            }
        });

        // Succesful response
        return res.status(200).json({
            ok: true,
            msg: 'room created',
            room_id: room_db.id,
            room_name: room_db.name,
            desc: room_db.desc,
            photo: room_db.photo,
            created_at: room_db.created_at
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Add chat user to chat room
export const add_chat_user_chat_room = async (req: Request, res: Response) => { 
    //TODO
    const { room_id, chat_user_id } = req.body;
    try {
        return res.status(200).json({
            ok: true,
            msg: 'chat user connected to room',
            room_id,
            chat_user_id
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Get all chat users from a room
export const get_room_chat_users = async (req: Request, res: Response) => { 
    //TODO
    const { room_id } = req.body;
    try {
        return res.status(200).json({
            ok: true,
            msg: 'chat users from room',
            roomId: room_id
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// remove user from chat room
export const remove_chat_user_chat_room = async (req: Request, res: Response) => { 
    //TODO
    const { room_id, chat_user_id } = req.body;
    try {
        return res.status(200).json({
            ok: true,
            msg: 'Removed user from room',
            room_id,
            chat_user_id
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Delete chat room
export const delete_chat_room = async (req: Request, res: Response) => { 
    //TODO
    const { uid, room_id } = req.body;
    try {
        // STEP 0: Validations

        ///////////////////////////////////////////////////////////////////////
        // STEP I: Delete chat room from every chat_user rooms array
            // Get chat_user
            // get rooms array 
            // delete room 
            // save chat_user with new room array
            // Move next chat_user in array
        ///////////////////////////////////////////////////////////////////////

        // SETEP II: Delete room from User

        // STEP III: Delete room

        return res.status(200).json({
            ok: true,
            msg: 'room deleted',
            uid,
            room_id
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}