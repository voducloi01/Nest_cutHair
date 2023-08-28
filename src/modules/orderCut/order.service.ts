import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { OrderCutDto } from './dto/orderCut.dto';
import { OrderCutEntity } from '../../entities/orderCut.entity';
import {
  GetAllOrderResponse,
  OrderScheduleResponse,
} from 'shared/types/response.type';

@Injectable()
export class OrderService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(OrderCutEntity)
    private readonly orderRepository: Repository<OrderCutEntity>,
  ) {
    //khoi tao transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ducloi.hutech@gmail.com', // Tên người dùng SMTP
        pass: 'zbjxcgdhpjdofbhh',
      },
    });
  }

  async getAllOrder(): Promise<GetAllOrderResponse> {
    const order = await this.orderRepository.find();
    return { result: order, message: 'Get All Order schedule success !' };
  }

  async checkDuplicateDate(requestDate: Date) {
    try {
      const existingOrder = await this.orderRepository.findOne({
        where: {
          dateSchedule: requestDate,
        },
      });
      return existingOrder;
    } catch (error) {
      console.log(error);
    }
  }

  async createOrder(data: OrderCutDto): Promise<OrderScheduleResponse> {
    const currentDate = new Date();
    const requestDate = new Date(data.dateSchedule);
    const ExitDuplicateOrder = await this.checkDuplicateDate(requestDate);

    if (ExitDuplicateOrder) {
      throw new Error('Duplicate Date!');
    }

    if (requestDate < currentDate) {
      throw new Error('You can not create when you chose past date !');
    }

    await this.sendMail(data);
    const result = await this.orderRepository.save(data);
    return { result: result, message: 'Create Order schedule success!' };
  }

  async sendMail(data: OrderCutDto): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: `${data.email}`,
        from: 'ducloi.hutech@gmail.com',
        subject: 'Đơn đặt',
        text: 'Well come',
        html: `<b>Đơn đặt lich ngày ${data.dateSchedule} của bạn thành công !</b>`,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
