import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
    export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async create(@Body() createOrderDtos: CreateOrderDto[]) {
        return this.ordersService.create(createOrderDtos);
    }
}
