import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { FilmsRepository } from '../repository/films.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private readonly filmsRepository: FilmsRepository,
    ) {}

    async create(createOrderDtos: CreateOrderDto[]): Promise<{ total: number; items: any[] }> {
        const results = [];

        for (const dto of createOrderDtos) {
        const { filmId, sessionId, seat } = dto;
        const { row, seat: seatNumber } = seat;

        const film = await this.filmsRepository.findById(filmId);
        if (!film) {
            throw new BadRequestException('Фильм не найден');
        }

        const session = film.schedule.find(s => s.id === sessionId);
        if (!session) {
            throw new BadRequestException('Бронирование не найдено');
        }

        const seatKey = `${row}:${seatNumber}`;
        const isTaken = session.taken.some(
            t => `${t.row}:${t.seat}` === seatKey
        );

        if (isTaken) {
            throw new BadRequestException(`Место ${seatKey} уже занято!`);
        }

        session.taken.push({ row, seat: seatNumber });

        await this.filmsRepository.updateOne(
            { id: filmId },
            { $set: { schedule: film.schedule } }
        );

        const { daytime, price } = session;

        const newOrder = new this.orderModel({
            id: uuidv4(),
            filmId,
            sessionId,
            seat: { row, seat: seatNumber },
        });
        const savedOrder = await newOrder.save();

        results.push({
            film: filmId,
            session: sessionId,
            daytime,
            row,
            seat: seatNumber,
            price,
            id: savedOrder.id,
        });
        }

        return {
        total: results.length,
        items: results,
        };
    }
}
