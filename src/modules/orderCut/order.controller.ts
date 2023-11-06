import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCutDto } from './dto/orderCut.dto';
import { GetAllOrderResponse } from 'shared/types/response.type';
import { OrderScheduleResponse } from '../../shared/types/response.type';
import { CreateOrderGuard } from 'shared/guards/order.guard';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllOrder(): Promise<GetAllOrderResponse> {
    return this.orderService.getAllOrder();
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CreateOrderGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  CreateOrder(@Body() body: OrderCutDto): Promise<OrderScheduleResponse> {
    return this.orderService.createOrder(body);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  UpdateSchedule(
    @Param('id') id: number,
    @Body() body: Partial<OrderCutDto>,
  ): Promise<OrderScheduleResponse> {
    return this.orderService.updateOrder(id, body);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  DeleteSchedule(@Param('id') id: number): Promise<OrderScheduleResponse> {
    return this.orderService.deleteSchedule(id);
  }
}
