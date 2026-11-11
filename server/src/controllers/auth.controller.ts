import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const result = await AuthService.login(req.body);
            return sendResponse(res, 200, 'Login successful', result);
        } catch (error: any) {
            return sendResponse(res, 400, error.message);
        }
    }
    static async logout(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                await AuthService.logout(token);
            }
            return sendResponse(res, 200, 'Logout successful');
        } catch (error: any) {
            return sendResponse(res, 400, error.message);
        }
    }
}
