import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (payload: { userID: string; role: string }) =>{
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as { userID: string; role: string }}