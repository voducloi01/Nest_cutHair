import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer', '');
    try {
      this.jwtService.verify(token);
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  }
}
