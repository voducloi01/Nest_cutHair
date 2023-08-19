import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCutDto } from 'src/modules/orderCut/dto/orderCut.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { OrderModel } from 'src/models/order.model';

@Controller('order')
export class OrderCotroller {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  async getAllOrder(): Promise<ResponseData<OrderModel>> {
    try {
      return new ResponseData<OrderModel>(
        await this.orderService.getAllOrder(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);

      return new ResponseData<OrderModel>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post('create')
  async CreateOrder(
    @Body(new ValidationPipe()) orderCreate: OrderCutDto,
  ): Promise<ResponseData<OrderModel>> {
    try {
      return new ResponseData<OrderModel>(
        await this.orderService.createOrder(orderCreate),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);

      return new ResponseData<OrderModel>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }
}
