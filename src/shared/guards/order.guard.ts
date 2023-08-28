import {
  CanActivate,
  Injectable,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CreateOrderGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const body = req.body;
    if (Object.keys(body).length === 4) {
      return true;
    }
    throw new InternalServerErrorException('Internal server error');
  }
}
