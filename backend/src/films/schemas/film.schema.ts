import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilmDocument = Film & Document;

@Schema({ collection: 'films' })
export class Film {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    rating: number;

    @Prop({ required: true })
    director: string;

    @Prop({ required: true })
    tags: string[];

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    cover: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    about: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        required: true,
        _id: false,
    })
    schedule: {
        id: string;
        daytime: string;
        hall: number;
        rows: number;
        seats: number;
        price: number;
        taken: { row: number; seat: number }[];
    }[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
