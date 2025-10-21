import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ collection: 'orders' })
export class Order {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    filmId: string;

    @Prop({ required: true })
    sessionId: string;

    @Prop({
        required: true,
        type: MongooseSchema.Types.Mixed,
    })
    seat: {
        row: number;
        seat: number;
    };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
