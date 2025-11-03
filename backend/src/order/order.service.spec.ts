import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './order.service';
import { FilmsRepository } from '../repository/films.repository.interface';

const mockFilmsRepository = {
  findById: jest.fn(),
  updateSchedule: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: FilmsRepository,
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});