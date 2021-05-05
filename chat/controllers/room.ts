import { Request, Response } from "express";
// Model
import User from '../../auth/models/user';
import ChatUser from '../models/chatuser';
import Room from '../models/room';

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

        return res.status(200).json({
            ok: true,
            msg: 'room created'
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