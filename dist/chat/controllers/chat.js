"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export const create_chat_user = async (req: Request, res: Response ) => {
//     const { nickname, uid } = req.body;
//     try {
//         // Nickname exists?
//         const chat_user = await ChatUser.findOne({nickname});
//         if(chat_user) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'Chat User already exists'
//             });
//         };
//         // Main User exists?
//         const user_db = await User.findById(uid);
//         if(!user_db) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'Invalid main user'
//             });
//         }
//         // Create chat user
//         const chat_user_db = new ChatUser({nickname});
//         // Save chat user in db
//         await chat_user_db.save();
//         // Update user_db chat_users array
//         await user_db.updateOne({
//             $push: {
//                 chatusers: {
//                     _id: chat_user_db.id
//                 }
//             }
//         });
//         // Succesful response
//         return res.status(200).json({
//             ok: true,
//             msg: `Chat User ${nickname} added`,
//             chat_user_id: chat_user_db.id,
//             nickname: chat_user_db.nickname
//         });
//     } catch (error) {
//         return res.status(500).json({
//             ok: false,
//             msg: 'Please contact the administrator'
//         });
//     }
// }
// export const update_chat_user = async (req: Request, res: Response) => {
//     const { chat_user_id, new_nickname, uid } = req.body;
//     try {
//         // Main User exists?
//         const user_db = await User.findById(uid);
//         if(!user_db) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'Invalid main user'
//             });
//         };
//         // Is chat_user_id a chat_user from main user?
//         let isCorrectChatUser = false;
//         for(let chat_user of user_db.chatusers) {
//             if(chat_user == chat_user_id) {
//                 isCorrectChatUser = true;
//                 break;
//             }
//         }
//         if(!isCorrectChatUser) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'The chat user does not belong to the user'
//             });
//         }
//         // New Nickname exists?
//         const chat_user = await ChatUser.findOne({nickname: new_nickname});
//         if(chat_user) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'Chat User already exists'
//             });
//         };
//         // Get chat user and modify it
//         const chat_user_db = await ChatUser.findByIdAndUpdate(
//             chat_user_id,
//             { nickname: new_nickname },
//             { new: true, useFindAndModify: false }
//         );
//         // Succesful response
//         return res.status(200).json({
//             ok: true,
//             msg: `Chat User Updated`,
//             chat_user_id: chat_user_db.id,
//             nickname: chat_user_db.nickname
//         });
//     } catch (error) {
//         return res.status(500).json({
//             ok: false,
//             msg: 'Please contact the administrator'
//         });
//     }
// }
// // Get all chat users 
// export const get_all_chat_users = async (req: Request, res: Response) => { 
//     //TODO
// }
// Get all users connected to one specific room
// export const get_room_chat_users = async (req: Request, res: Response) => { 
//     //TODO
// }
// Get chat users from one main user
// export const get_user_chat_users = async (req: Request, res: Response) => { 
//     //TODO
// }
// // Delete one specific chat user
// export const delete_chat_user = async (req: Request, res: Response) => { 
//     //TODO
// }
// // Create Chat Room
// export const create_chat_room = async (req: Request, res: Response) => { 
//     //TODO
// }
// // Add chat user to chat room
// export const add_chat_user_chat_room = async (req: Request, res: Response) => { 
//     //TODO
// }
// // remove user from chat room
// export const remove_chat_user_chat_room = async (req: Request, res: Response) => { 
//     //TODO
// }
// // Delete chat room
// export const delete_chat_room = async (req: Request, res: Response) => { 
//     //TODO
// }
