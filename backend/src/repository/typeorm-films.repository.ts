import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { FilmsRepository } from './films.repository.interface';

@Injectable()
export class TypeOrmFilmsRepository extends FilmsRepository {
    constructor(
        @InjectRepository(Film)
        private filmRepository: Repository<Film>,
    ) {
        super();
    }

    async findAll(): Promise<any[]> {
        const films = await this.filmRepository.find({
        relations: ['schedule'],
        });
        return films;
    }

    async findById(id: string): Promise<any | null> {
        const film = await this.filmRepository.findOne({
        where: { id },
        relations: ['schedule'],
        });
        return film;
    }

    async updateOne(filmId: string, schedule: any): Promise<void> {
        const film = await this.filmRepository.findOne({ where: { id: filmId } });
        if (film) {
        film.schedule = schedule;
        await this.filmRepository.save(film);
        }
    }
}