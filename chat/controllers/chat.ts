import { Request, Response } from "express";
// Model
import User from '../../auth/models/user';
import ChatUser from '../models/user-chat';
import Room from '../models/room';

export const create_chat_user = async (req: Request, res: Response ) => {
    const { nickname, uid } = req.body;

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
        const chat_user_db = new ChatUser({nickname});
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
            uid: chat_user_db.id,
            nickname: chat_user_db.nickname
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}





