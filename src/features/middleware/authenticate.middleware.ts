// src/middlewares/authenticate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../users/services/jwt.service';
import { UnauthorizedError } from '../../utils/errors/api-error';

export interface AuthenticatedRequest extends Request {
  user: {
    role: string;
    email: string;
    uuid: string;
  };
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('No token provided');
    }

    if (!authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
      throw new UnauthorizedError('Invalid token format');
    }

    const token = authHeader.split('Bearer ')[1];

    // verify jwt
    const jwtService = new JwtService();
    const decoded = jwtService.verifyToken(token);

    // Validate and set role to either 'user' or 'admin'
    const validRole = decoded.role === 'admin' ? 'admin' : 'user';

    if (!decoded.email || !decoded.uuid) {
      throw new UnauthorizedError('Invalid token');
    }
    
    // Convertimos el req a AuthenticatedRequest al inyectar la propiedad user
    (req as AuthenticatedRequest).user = {
      role: validRole,
      email: decoded.email,
      uuid: decoded.uuid,
    };

    next();
  } catch (error) {
    next(error);
  }
};
