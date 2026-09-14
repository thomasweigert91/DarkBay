import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('I AM A MIDDLEWARE');

    next();
  }
}
