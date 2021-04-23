import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

interface UserToken {
    uid: string,
    name: string
}


const validate_jwt = (req: Request, res: Response, next: NextFunction) => {

    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Token error'
        });
    }

    try {
        const { uid, name } = jwt.verify(token, String(process.env.SECRET_JWT_SEED)) as UserToken;

        console.log(uid, name);

        // TODO: ADD THIS TO REQUEST OBJECT, FIND A SOLUTION
        
        // req.user_data = { uid, name };
        
        next(); // Everything In Its Right Place :)
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    }
    
}

export default validate_jwt;