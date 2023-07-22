import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCutEntity } from 'src/entities/orderCut.entity';
import { Repository } from 'typeorm';
import { OrderCutDto } from 'src/dto/orderCut.dto';
import * as nodemailer from 'nodemailer';

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

  async getAllOrder() {
    const order = await this.orderRepository.find();
    return order;
  }

  async createOrder(data: OrderCutDto): Promise<OrderCutEntity> {
    try {
      await this.sendMail(data);
      return await this.orderRepository.save(data);
    } catch (error) {
      console.log(error);
    }
  }

  async sendMail(data: OrderCutDto): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: `${data.email}`,
        from: 'ducloi.hutech@gmail.com',
        subject: 'Đơn đặt',
        text: 'Well come',
        html: `<b>Đơn đặt lich giờ ${data.hour} ngày ${data.dateSchedule} của bạn thành công !</b>`,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
