import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schemas/film.schema';
import { FilmsRepository } from './films.repository.interface';

@Injectable()
export class MongooseFilmsRepository extends FilmsRepository{
    constructor(
        @InjectModel(Film.name) private filmModel: Model<FilmDocument>,
    ) {
        super();
    }

    async findAll(): Promise<Film[]> {
        return this.filmModel.find().exec();
    }

    async findById(id: string): Promise<Film | null> {
        return this.filmModel.findOne({ id }).exec();
    }

    async updateOne(filmId: string, schedule: any): Promise<void> {
        await this.filmModel.findOneAndUpdate({ id: filmId }, { $set: { schedule } }).exec();
    }
}
