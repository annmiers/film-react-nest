import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    daytime: string;

    @Column()
    hall: number;

    @Column()
    rows: number;

    @Column()
    seats: number;

    @Column({ type: 'int' })
    price: number;

    @Column('json')
    taken: { row: number; seat: number }[];

    @ManyToOne(() => Film, film => film.schedule)
    @JoinColumn({ name: 'filmId' })
    film: Film;
}