import { Request, Response } from "express";
// Model
import User from '../../auth/models/user';
import ChatUser from '../models/user-chat';
import Room from '../models/room';

export const get_room_chat_users = async (req: Request, res: Response) => { 
    //TODO
}

// Create Chat Room
export const create_chat_room = async (req: Request, res: Response) => { 
    //TODO
}

// Add chat user to chat room
export const add_chat_user_chat_room = async (req: Request, res: Response) => { 
    //TODO
}

// remove user from chat room
export const remove_chat_user_chat_room = async (req: Request, res: Response) => { 
    //TODO
}

// Delete chat room
export const delete_chat_room = async (req: Request, res: Response) => { 
    //TODO
}