import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { OrderCutDto } from './dto/orderCut.dto';
import { OrderCutEntity } from '../../entities/orderCut.entity';
import {
  GetAllOrderResponse,
  OrderScheduleResponse,
} from 'shared/types/response.type';
import moment from 'moment';

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
    const currentDate = new Date();

    const existingOrder = await this.orderRepository.findOne({
      where: {
        dateSchedule: requestDate,
      },
    });

    const checkHours = moment(requestDate).format('HH');

    if (existingOrder) {
      throw new BadRequestException('Duplicate Date');
    }

    if (requestDate < currentDate) {
      throw new BadRequestException(
        'You can not create when you chose a past date',
      );
    }

    if (Number(checkHours) < 8 || Number(checkHours) > 20) {
      throw new BadRequestException('Please choose hours within 8 AM to 20 PM');
    }
  }

  async findById(id: number): Promise<OrderScheduleResponse> {
    const findId = await this.orderRepository.findOneBy({
      id: id,
    });

    if (!findId) {
      throw new NotFoundException(`Not Find S
      
      chedule ID ${id}`);
    }
    return {
      result: findId,
      message: `Detail Category ID ${id}!`,
    };
  }

  async createOrder(req: OrderCutDto): Promise<OrderScheduleResponse> {
    const requestDate = new Date(req.dateSchedule);

    await this.checkDuplicateDate(requestDate);

    const result = await this.orderRepository.save(req);

    //send mail when success !
    await this.sendMail(req, true);

    return { result: result, message: 'Create Order schedule success!' };
  }

  async updateOrder(
    id: number,
    req: Partial<OrderCutDto>,
  ): Promise<OrderScheduleResponse> {
    const requestDate = new Date(req.dateSchedule);

    await this.checkDuplicateDate(requestDate);

    const findSchedule = await this.orderRepository.findOne({
      where: { id: id },
    });

    if (!findSchedule) {
      throw new NotFoundException(`Not Find Schedule ID ${id}`);
    }

    const updateSchedule = await this.orderRepository.save({
      ...findSchedule,
      ...req,
    });

    await this.sendMail(updateSchedule, false);

    return {
      result: updateSchedule,
      message: 'Updated schedule cut hair !',
    };
  }

  async deleteSchedule(id: number): Promise<OrderScheduleResponse> {
    await this.findById(id);
    await this.orderRepository.delete(id);
    return { message: 'Delete schedule success !' };
  }

  async sendMail(data: OrderCutDto, isCreate: boolean): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: `${data.email}`,
        from: process.env.EMAIL_ADMIN,
        subject: 'Đơn đặt',
        text: 'Well come',
        html: `<b>${isCreate ? 'Đơn đặt' : 'Cập nhập lại '}t lich ngày ${moment(
          data.dateSchedule,
        ).format('DD/MM/YY HH:MM')} của bạn thành công !</b>`,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
