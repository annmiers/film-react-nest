import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
    constructor(private readonly filmsRepository: FilmsRepository) {}

    async create(createOrderDtos: CreateOrderDto[]): Promise<{ total: number; items: any[] }> {
        const results = [];

        for (const dto of createOrderDtos) {
        const { filmId, sessionId, seat } = dto;
        const { row, seat: seatNumber } = seat;

        const film = await this.filmsRepository.findById(filmId);
        if (!film) throw new BadRequestException('Фильм не найден');

        const session = film.schedule.find(s => s.id === sessionId);
        if (!session) throw new BadRequestException('Сеанс не найден');

        const isTaken = session.taken.some(t => t.row === row && t.seat === seatNumber);
        if (isTaken) throw new BadRequestException(`Место ${row}:${seatNumber} уже занято!`);

        session.taken.push({ row, seat: seatNumber });
        await this.filmsRepository.updateOne(filmId, film.schedule);

        results.push({
            film: filmId,
            session: sessionId,
            daytime: session.daytime,
            row,
            seat: seatNumber,
            price: session.price,
            id: randomUUID(),
        });
    }

    return { total: results.length, items: results };
    }
}
