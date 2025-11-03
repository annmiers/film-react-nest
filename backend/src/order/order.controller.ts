import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async create(@Body() body: any) {
        const { tickets } = body;

        if (!Array.isArray(tickets) || tickets.length === 0) {
        throw new BadRequestException('Поле "tickets" должно быть непустым массивом');
        }

        const createOrderDtos: CreateOrderDto[] = tickets.map(ticket => ({
        filmId: ticket.film,
        sessionId: ticket.session,
        seat: {
            row: ticket.row,
            seat: ticket.seat,
        },
        }));

        return this.ordersService.create(createOrderDtos);
    }
};
