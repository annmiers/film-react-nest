import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'float' })
    rating: number;

    @Column()
    director: string;

    @Column('simple-array')
    tags: string[];

    @Column()
    image: string;

    @Column()
    cover: string;

    @Column()
    title: string;

    @Column()
    about: string;

    @Column()
    description: string;

    @OneToMany(() => Schedule, schedule => schedule.film, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    schedule: Schedule[];
}