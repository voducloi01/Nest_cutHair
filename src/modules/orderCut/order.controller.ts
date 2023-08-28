import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCutDto } from './dto/orderCut.dto';
import { GetAllOrderResponse } from 'shared/types/response.type';
import { OrderScheduleResponse } from '../../shared/types/response.type';
import { CreateOrderGuard } from 'shared/guards/order.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllOrder(): Promise<GetAllOrderResponse> {
    return this.orderService.getAllOrder();
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CreateOrderGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async CreateOrder(@Body() body: OrderCutDto): Promise<OrderScheduleResponse> {
    return this.orderService.createOrder(body);
  }
}
