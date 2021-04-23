import * as jwt from 'jsonwebtoken';

const create_jwt = (uid: string, name: string) => {
    const payload = {uid, name};

    return new Promise((resolve, reject) => {
        jwt.sign(payload, String(process.env.SECRET_JWT_SEED), {
            expiresIn: '24h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject(err);
            } else {
                resolve(token);
            }
        });
    });

}

export default create_jwt;