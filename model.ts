interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    purchaseHistory: Ticket[];
}

interface Event {
    id: string;
    title: string;
    date: Date;
    city: string;
    ticketStock: number;
}

interface Ticket {
    eventId: string;
    eventName: string;
    date: Date;
    quantity: number;
    paymentStatus: string;
}
export { User, Event, Ticket };
