import * as jwt from 'jsonwebtoken';
// Interfaces
import { UserToken } from '../interfaces/auth-interfaces';


const validate_jwt_sockets = ( token: string ): UserToken | undefined => {
    try {
        return jwt.verify(token, String(process.env.SECRET_JWT_SEED)) as UserToken;
    } catch (error) {
        return undefined;
    }
}

export default validate_jwt_sockets;