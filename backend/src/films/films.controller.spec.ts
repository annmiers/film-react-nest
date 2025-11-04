import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn(),
    getSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  describe('findAll', () => {
    it('should return an array of films', async () => {
      const result = { total: 1, items: [{ id: '1', title: 'Test' } as FilmDto] };
      mockFilmsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(filmsService.findAll).toHaveBeenCalled();
    });
  });

  describe('getSchedule', () => {
    it('should return schedule for a film', async () => {
      const result = { total: 2, items: [] };
      mockFilmsService.getSchedule.mockResolvedValue(result);

      expect(await controller.getSchedule('1')).toBe(result);
      expect(filmsService.getSchedule).toHaveBeenCalledWith('1');
    });
  });
});