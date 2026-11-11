import { Response } from 'express';

/**
 * Helper agar format response selalu konsisten di seluruh endpoint:
 * { success: boolean, message: string, data: T | null }
 */
export const sendResponse = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T | null = null
) => {
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data,
    });
};
