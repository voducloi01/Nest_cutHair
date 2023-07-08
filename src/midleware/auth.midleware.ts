import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.slice(7);

    if (token !== req.cookies.jwt) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    next();
  }
}
