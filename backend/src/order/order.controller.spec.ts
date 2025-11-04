// order.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BadRequestException } from '@nestjs/common';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create orders from frontend payload and return response', async () => {
      const frontendPayload = {
        email: 'ann@mail.ru',
        phone: '89234563423',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            row: 1,
            seat: 1,
            daytime: '2024-06-28T10:00:53+03:00',
            price: 350,
          },
        ],
      };

      const expectedDtos: CreateOrderDto[] = [
        {
          filmId: 'film-1',
          sessionId: 'session-1',
          seat: { row: 1, seat: 1 },
        },
      ];

      const mockResponse = {
        total: 1,
        items: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 1,
            price: 350,
            id: 'order-123',
          },
        ],
      };

      mockOrdersService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(frontendPayload);

      expect(result).toEqual(mockResponse);
      expect(ordersService.create).toHaveBeenCalledWith(expectedDtos);
      expect(ordersService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if tickets is missing', async () => {
      const invalidPayload = {
        email: 'ann@mail.ru',
        phone: '89234563423',
        // нет поля tickets
      };

      await expect(controller.create(invalidPayload as any)).rejects.toThrow(
        new BadRequestException('Поле "tickets" должно быть непустым массивом'),
      );
    });

    it('should throw BadRequestException if tickets is not an array', async () => {
      const invalidPayload = {
        email: 'ann@mail.ru',
        phone: '89234563423',
        tickets: 'not an array',
      };

      await expect(controller.create(invalidPayload as any)).rejects.toThrow(
        new BadRequestException('Поле "tickets" должно быть непустым массивом'),
      );
    });

    it('should propagate service errors', async () => {
      const frontendPayload = {
        email: 'ann@mail.ru',
        phone: '89234563423',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            row: 1,
            seat: 1,
            daytime: '2024-06-28T10:00:53+03:00',
            price: 350,
          },
        ],
      };

      const expectedDtos: CreateOrderDto[] = [
        {
          filmId: 'film-1',
          sessionId: 'session-1',
          seat: { row: 1, seat: 1 },
        },
      ];

      const errorMessage = 'Место 1:1 уже занято!';
      mockOrdersService.create.mockRejectedValue(new Error(errorMessage));

      await expect(controller.create(frontendPayload)).rejects.toThrow(errorMessage);
      expect(ordersService.create).toHaveBeenCalledWith(expectedDtos);
    });
  });
});
