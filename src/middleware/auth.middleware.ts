import jwt, {Secret, JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
export interface CustomRequest extends Request {
    user: string | JwtPayload;
}

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            if (!token) 
                throw new Error("No token provided");
            const user = jwt.verify(token, JWT_SECRET);
            (req as CustomRequest).user = user;
            next();
        }
    } catch (err) {
        throw new Error(`Authentication error: ${err}`);
    }
}

