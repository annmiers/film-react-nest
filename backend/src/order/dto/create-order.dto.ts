export class CreateOrderDto {
    filmId: string;
    sessionId: string;
    seat: {
        row: number;
        seat: number;
    };
}
