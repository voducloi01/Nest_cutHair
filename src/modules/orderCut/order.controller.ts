import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCutDto } from 'src/modules/orderCut/dto/orderCut.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { OrderModel } from 'src/models/order.model';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllOrder(): Promise<ResponseData<OrderModel>> {
    try {
      return new ResponseData<OrderModel>(
        await this.orderService.getAllOrder(),
        HttpStatus.OK,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);

      return new ResponseData<OrderModel>(
        null,
        HttpStatus.UNAUTHORIZED,
        HttpMessage.ERROR,
      );
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async CreateOrder(
    @Body(new ValidationPipe()) orderCreate: OrderCutDto,
  ): Promise<ResponseData<OrderModel>> {
    try {
      return new ResponseData<OrderModel>(
        await this.orderService.createOrder(orderCreate),
        HttpStatus.OK,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);

      return new ResponseData<OrderModel>(
        null,
        HttpStatus.OK,
        HttpMessage.ERROR,
      );
    }
  }
}
