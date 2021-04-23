import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validate_fields = ( req: Request, res: Response, next: NextFunction ) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            msg: errors.mapped()
        });
    }

    next();
}

export default validate_fields;