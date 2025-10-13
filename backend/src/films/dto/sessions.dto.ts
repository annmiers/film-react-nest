export class SessionDto {
    id: string;
    daytime: string;
    hall: number;
    rows: number;
    seats: number;
    price: number;
    taken: {
        row: number;
        seat: number;
    }[];
}
