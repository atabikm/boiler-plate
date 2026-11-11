import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { LoginInput } from '../dtos/auth.dto';
import { prisma } from '../config/prisma';

export class AuthService {
    static async login(input: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if(!user){
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = generateToken({ userID: user.id, role: user.role });
        return {
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token
        };
    }
    static async logout(token: string) {
        return await prisma.blacklistedToken.create({
            data: { token },
        });
    }
}