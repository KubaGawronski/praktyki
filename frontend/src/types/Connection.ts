export type Connection = {
    _id?: string;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    price: number;
    changes: number;
};