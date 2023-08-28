import {
  CanActivate,
  Injectable,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CreateOrderGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();
    // const body = req.body;
    // if (body.email && body.password && Object.keys(body).length === 2) {
    //   return true;
    // }
    // throw new InternalServerErrorException('Internal server error');
  }
}
