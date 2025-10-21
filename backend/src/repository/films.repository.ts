import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schemas/film.schema';

@Injectable()
export class FilmsRepository {
    constructor(
        @InjectModel(Film.name) private filmModel: Model<FilmDocument>,
    ) {}

    async findAll(): Promise<Film[]> {
        return this.filmModel.find().exec();
    }

    async findById(id: string): Promise<Film | null> {
        return this.filmModel.findOne({ id }).exec();
    }

    async updateOne(filter: any, update: any): Promise<Film | null> {
        return this.filmModel.findOneAndUpdate(filter, update, { new: true }).exec();
    }
}
