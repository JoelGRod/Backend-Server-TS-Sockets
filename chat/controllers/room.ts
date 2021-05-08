import { Request, Response } from "express";
// Encrypt passwords
import * as bcrypt from 'bcryptjs';
// Model
import User from '../../auth/models/user';
import Room from '../models/room';
import ChatUser from '../models/chatuser';
// Helpers
import { is_another_user_profile_connected, it_belongs_to } from "../helpers/chat";

// Create Chat Room
export const create_chat_room = async (req: Request, res: Response) => {

    const { room_name, desc, photo, password, uid } = req.body;
    try {
        // Room name exists?
        const room = await Room.findOne({ name: room_name });
        if (room) {
            return res.status(400).json({
                ok: false,
                msg: 'Room name already exists'
            });
        };

        // Main User exists?
        const user_db = await User.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }

        // Create chat room
        const room_db = new Room({
            name: room_name,
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
            room: {
                _id: room_db.id,
                name: room_db.name,
                desc: room_db.desc,
                photo: room_db.photo, 
                created_at: room_db.created_at
            }
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

// Modify Room Name
export const modify_room_name = async (req: Request, res: Response) => {
    //TODO
}

// Modify Room info
export const modify_room_info = async (req: Request, res: Response) => {
    //TODO
}

// Get All chat rooms
export const get_all_chat_rooms = async (req: Request, res: Response) => {
    //TODO
}

// Add chat user to chat room
export const add_chat_user_chat_room = async (req: Request, res: Response) => {

    const { room_id, chat_user_id, room_password, uid } = req.body;
    try {

        // Security Validations
        // Main User exists?
        const user_db = await User.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        };

        // Room exists?
        const room_db = await Room.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }

        // chat user exists
        const chat_user_db = await ChatUser.findById(chat_user_id);
        if (!chat_user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat user does not exists'
            });
        }

        // chat_user belongs to main user?
        const is_chat_user_valid = it_belongs_to(user_db.chatusers, chat_user_id);
        if (!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }

        // Is the chat room password correct??
        const is_correct_password = bcrypt.compareSync(room_password, room_db.password);
        if (!is_correct_password) {
            return res.status(400).json({
                ok: false,
                msg: 'Wrong room password'
            });
        }

        // Is user chat in room already?
        const is_chat_user_in_room = it_belongs_to(room_db.chatusers, chat_user_id);
        if (is_chat_user_in_room) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user is already connected'
            });
        }

        // Is another main user chat user connected to room
        const is_another_main_user_profile_connected = is_another_user_profile_connected(user_db.chatusers, room_db.chatusers);
        if (is_another_main_user_profile_connected) {
            return res.status(400).json({
                ok: false,
                msg: 'The User has another profile connected'
            });
        }

        // Add chat user to room
        // STEP I: Update room_db chat_users array
        await room_db.updateOne({
            $push: {
                chatusers: {
                    _id: chat_user_db.id
                }
            }
        });
        // STEP II: Update chat_user_db rooms array
        await chat_user_db.updateOne({
            $push: {
                rooms: {
                    _id: room_db.id
                }
            }
        });

        return res.status(200).json({
            ok: true,
            msg: 'chat user connected to room',
            chatuser: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
            },
            room: {
                _id: room_db.id,
                name: room_db.name
            }
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

    const { room_id, chat_user_id, uid } = req.body;
    try {
        // Security Validations
        // Main User exists?
        const user_db = await User.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        };

        // Room exists?
        const room_db = await Room.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }

        // chat user exists
        const chat_user_db = await ChatUser.findById(chat_user_id);
        if (!chat_user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Chat user does not exists'
            });
        }

        // chat_user belongs to main user?
        const is_chat_user_valid = it_belongs_to(user_db.chatusers, chat_user_id);
        if (!is_chat_user_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user does not belong to the user'
            });
        }

        // Is user chat in room already?
        const is_chat_user_in_room = it_belongs_to(room_db.chatusers, chat_user_id);
        if (!is_chat_user_in_room) {
            return res.status(400).json({
                ok: false,
                msg: 'The chat user is not connected to room'
            });
        }

        // Remove chat user from Room
        // STEP I: Remove chat user from Room chat users array
        const room_chat_users = room_db.chatusers.filter(function (id: String) {
            return id != chat_user_db.id;
        });
        await room_db.updateOne(
            { chatusers: room_chat_users }
        );

        // STEP II: Remove room from Chat_user rooms array
        const chat_user_rooms = chat_user_db.rooms.filter(function (id: String) {
            return id != room_db.id;
        });
        await chat_user_db.updateOne(
            { rooms: chat_user_rooms }
        );

        return res.status(200).json({
            ok: true,
            msg: 'Removed user from room',
            chatuser: {
                _id: chat_user_db.id,
                nickname: chat_user_db.nickname,
            },
            room: {
                _id: room_db.id,
                name: room_db.name
            }
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

    const { room_id, uid } = req.body;
    try {
        // Security Validations
        // Main User exists?
        const user_db = await User.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        }

        // Room exists? and populate chatusers from room
        const exclusions: String = '-_id -rooms -msgs -created_at -modified_at -__v';
        const room_db = await Room.findById(room_id).populate('chatusers', exclusions);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'chat users from room',
            room: {
                _id: room_db.id,
                name: room_db.name
            },
            chatusers: room_db.chatusers
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

    const { uid, room_id } = req.body;
    try {
        // Security Validations
        // Main User exists?
        const user_db = await User.findById(uid);
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid main user'
            });
        };

        // Room exists
        const room_db = await Room.findById(room_id);
        if (!room_db) {
            return res.status(400).json({
                ok: false,
                msg: 'Room does not exists'
            });
        };

        // Room belongs to main user? is main user the creator?
        const is_room_valid = it_belongs_to(user_db.rooms, room_id);
        if (!is_room_valid) {
            return res.status(400).json({
                ok: false,
                msg: 'The Room does not belong to the main user'
            });
        };

        ///////////////////////////////////////////////////////////////////////
        // STEP I: Delete chat room from every chat_user rooms array
        const connected_users = room_db.chatusers;
        // Get chat_user
        // get rooms array 
        // delete room 
        // save chat_user with new room array
        // Move next chat_user in array
        for (let chat_user_id of connected_users) {
            const chat_user_db = await ChatUser.findById(chat_user_id);
            const chat_user_rooms = chat_user_db.rooms.filter((id: String) => {
                return id != room_id;
            });
            await chat_user_db.updateOne(
                { rooms: chat_user_rooms }
            );
        };
        ///////////////////////////////////////////////////////////////////////

        // STEP II: Delete room from User
        const user_rooms = user_db.rooms.filter((id: String) => {
            return id != room_id;
        });
        await user_db.updateOne(
            { rooms: user_rooms }
        );

        // STEP III: Delete room
        await Room.deleteOne(
            { _id: room_id },
            { new: true }
        );

        return res.status(200).json({
            ok: true,
            msg: 'room deleted',
            room: {
                _id: room_db.id,
                name: room_db.name
            }
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}