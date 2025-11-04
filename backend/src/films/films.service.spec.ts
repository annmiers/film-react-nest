import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository.interface';

const mockFilmsRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  updateSchedule: jest.fn(),
};

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});