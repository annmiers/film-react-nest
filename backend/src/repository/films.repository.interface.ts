export abstract class FilmsRepository {
    abstract findAll(): Promise<any[]>;
    abstract findById(id: string): Promise<any | null>;
    abstract updateOne(filmId: string, schedule: any): Promise<void>;
}