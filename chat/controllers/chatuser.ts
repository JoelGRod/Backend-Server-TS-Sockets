import { Request, Response } from "express";
// Model
import User from '../../auth/models/user';
import ChatUser from '../models/chatuser';
import Room from '../models/room';
// Helpers
import { it_belongs_to } from "../helpers/chat";

// Create new chat user
export const create_chat_user = async (req: Request, res: Response ) => {
    const { nickname, desc, photo, uid } = req.body;

    try {
        // Nickname exists?
        const chat_user = await ChatUser.findOne({nickname});
        if(chat_user) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat User already exists'
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

        // Create chat user
        const chat_user_db = new ChatUser({
            nickname,
            desc,
            photo,
            created_at: Date.now(),
            user: user_db.id
        });
        // Save chat user in db
        await chat_user_db.save();
        // Update user_db chat_users array
        await user_db.updateOne({
            $push: {
                chatusers: {
                    _id: chat_user_db.id
                }
            }
        });
        // Succesful response
        return res.status(200).json({
            ok: true,
            msg: `Chat User ${nickname} added`,
            chatuser: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
                desc: chat_user_db.desc,
                photo: chat_user_db.photo,
                created_at: chat_user_db.created_at,
            }
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Update chat user nickname
export const update_chat_user_nickname = async (req: Request, res: Response) => {
    const { chat_user_id, new_nickname, uid } = req.body;

    try {
        // Main User exists?
        const user_db = await User.findById(uid);
        if(!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        };

        // chat_user belongs to main user?
        const is_chat_user_valid = it_belongs_to(user_db.chatusers, chat_user_id);
        if(!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }

        // New Nickname exists?
        const chat_user = await ChatUser.findOne({nickname: new_nickname});
        if(chat_user) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat User already exists'
            });
        };

        // Get chat user and modify it
        const chat_user_db = await ChatUser.findByIdAndUpdate(
            chat_user_id,
            { 
                nickname: new_nickname,
                modified_at: Date.now()
            },
            { new: true, useFindAndModify: false }
        );

        // Succesful response
        return res.status(200).json({
            ok: true,
            msg: `Chat User Updated`,
            chatuser: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
                desc: chat_user_db.desc,
                photo: chat_user_db.photo,
                created_at: chat_user_db.created_at,
                modified_at: chat_user_db.modified_at
            }
        });
  
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Update chat user gral info (desc & photo)
export const update_chat_user_info = async ( req: Request, res: Response ) => {
    const { chat_user_id, new_desc, new_photo, uid } = req.body;

    try {
        // Main User exists?
        const user_db = await User.findById(uid);
        if(!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        };

        // chat_user belongs to main user?
        const is_chat_user_valid = it_belongs_to(user_db.chatusers, chat_user_id);
        if(!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }

        // Get chat user and modify it
        const chat_user_db = await ChatUser.findByIdAndUpdate(
            chat_user_id,
            { 
                desc: new_desc,
                photo: new_photo,
                modified_at: Date.now()
            },
            { new: true, useFindAndModify: false }
        );

        // Succesful response
        return res.status(200).json({
            ok: true,
            msg: `Chat User Updated`,
            chatuser: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
                desc: chat_user_db.desc,
                photo: chat_user_db.photo,
                created_at: chat_user_db.created_at,
                modified_at: chat_user_db.modified_at
            }
        });
  
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Get all chat users 
export const get_all_chat_users = async (req: Request, res: Response) => { 
    try {
        const chatusers = await ChatUser.find({}, {nickname: 1, desc: 1, photo: 1, _id: 0});

        return res.status(200).json({
            ok: true,
            msg: 'get all chat users',
            chatusers
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Get chat users from one main user
export const get_user_chat_users = async (req: Request, res: Response) => { 

    const { uid } = req.body;
    try {
        // Main User exists?
        const exclusions = "-__v -rooms -msgs";
        const user_db = await User.findById(uid).populate('chatusers', exclusions);
        if(!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        };

        return res.status(200).json({
            ok: true,
            msg: 'get user chat users',
            chatusers: user_db.chatusers
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Delete one specific chat user
export const delete_chat_user = async (req: Request, res: Response) => { 

    const { uid, chat_user_id } = req.body;
    try {
        // Main User exists?
        const user_db = await User.findById(uid);
        if(!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        };

        // Chat user exists
        const chat_user_db = await ChatUser.findById(chat_user_id);
        if (!chat_user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat user does not exists'
            });
        };

        // chat_user belongs to main user?
        const is_chat_user_valid = it_belongs_to(user_db.chatusers, chat_user_id);
        if(!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        };

        ///////////////////////////////////////////////////////////////////////
        // STEP I: Delete chat user from rooms where is connected
        const connected_rooms = chat_user_db.rooms;
            // Get room
            // get chat users array 
            // delete chat user 
            // save room with new chat user array
            // Move next room in array
        for (let room_id of connected_rooms) {
            const room_db = await Room.findById(room_id);
            const room_chat_users = room_db.chatusers.filter((id: String) => {
                return id != chat_user_id;
            });
            await room_db.updateOne(
                { chatusers: room_chat_users }
            );
        };
        ///////////////////////////////////////////////////////////////////////

        // SETEP II: Delete chat user from User
        const user_chat_users = user_db.chatusers.filter((id: String) => {
            return id != chat_user_id;
        });
        await user_db.updateOne(
            { chatusers: user_chat_users }
        );

        // STEP III: Delete chat user
        await ChatUser.deleteOne(
            { _id: chat_user_id }, 
            { new: true }
        );

        return res.status(200).json({
            ok: true,
            msg: 'delete chat user',
            chatuser: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname
            }
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

