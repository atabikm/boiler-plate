import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { LoginSchema } from '../dtos/auth.dto';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/login', validate(LoginSchema), AuthController.login);
authRouter.post('/logout', authMiddleware, AuthController.logout);

export default authRouter;