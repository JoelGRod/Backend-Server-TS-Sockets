import { Request, Response } from "express";
// Model
import User from '../../auth/models/user';
import Room from '../models/room';
import ChatUser from '../models/chatuser';
import Message from '../models/msg';

export class MessageController {

    constructor() { }

    public add_message = async (req: Request, res: Response) => {

        const { uid, room_id, chatuser_nickname, msg } = req.body;

        try {
            // Main User exists?
            const user_db = await User.findById(uid);
            if (!user_db) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Invalid main user'
                });
            };

            // Room Exists?
            const room_db = await Room.findById(room_id);
            if (!room_db) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Room does not exists'
                });
            };

            // Chat user exists?
            const chatuser_db = await ChatUser.findOne({ nickname: chatuser_nickname });
            if (!chatuser_db) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Chat user does not exists'
                });
            };

            // Chat user belongs to main user (token)?
            if (user_db.id.toString() !== chatuser_db.user.toString()) {
                return res.status(400).json({
                    ok: false,
                    msg: 'The Chat user does not belong to the main user'
                });
            };

            // Create message and save in DB
            const message_db = new Message({
                msg,
                created_at: Date.now(),
                room: room_db.id,
                chatuser: chatuser_db.id
            });
            await message_db.save();

            // Update Room msgs array
            await room_db.updateOne({
                $push: {
                    msgs: {
                        _id: message_db.id
                    }
                }
            });

            // Update Chatuser msgs array
            await chatuser_db.updateOne({
                $push: {
                    msgs: {
                        _id: message_db.id
                    }
                }
            });

            return res.status(200).json({
                ok: true,
                msg: 'Message added to room',
                message: {
                    _id: message_db.id,
                    msg: message_db.msg,
                    chatuser: chatuser_db.nickname,
                    room: room_db.name
                }
            });

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'Please contact the administrator'
            });
        }
    }
}