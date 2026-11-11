import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendResponse } from '../utils/response';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => err.message);
            return sendResponse(res, 400, 'Validation Error', { errors: errorMessages });
        }
        req.body = result.data;
        return next();
    }
}
