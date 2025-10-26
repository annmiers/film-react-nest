import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository.interface';

@Injectable()
    export class FilmsService {
    constructor(private readonly filmsRepository: FilmsRepository) {}

    async findAll(): Promise<{ total: number; items: any[] }> {
        const films = await this.filmsRepository.findAll();
        const items = films.map(film => ({
        id: film.id,
        rating: film.rating,
        director: film.director,
        tags: film.tags,
        title: film.title,
        about: film.about,
        image: film.image,
        cover: film.cover,
        }));
        return {
        total: items.length,
        items,
        };
    }

    async getSchedule(id: string): Promise<{ total: number; items: any[] }> {
        const film = await this.filmsRepository.findById(id);
        if (!film) {
        throw new Error('Film not found');
        }

        const items = film.schedule.map(session => ({
        id: session.id,
        daytime: session.daytime,
        hall: String(session.hall),
        rows: session.rows,
        seats: session.seats,
        price: session.price,
        taken: session.taken.map(t => `${t.row}:${t.seat}`),
        }));

        return {
        total: items.length,
        items,
        };
    }
}
