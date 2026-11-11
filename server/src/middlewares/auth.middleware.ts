import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { Role } from '@prisma/client';
import { prisma } from '../config/prisma';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const isBlacklisted = await prisma.blacklistedToken.findUnique({
            where: { token },
        });

        if (isBlacklisted) {
            return res.status(401).json({ message: 'exprired token' });
        }
        const decoded = verifyToken(token) as { userID: string; role: Role };

        // Simpan identitas user di req.user agar bisa dipakai controller
        req.user = {
            id: decoded.userID,
            role: decoded.role,
        };
        return next();
    }catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

}
    