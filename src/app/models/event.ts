import { Attendee } from "./attendee";

export interface Event {
    id: number;
    name: string;
    description: string;
    location?: Geolocation;
    time: Date;
    date: Date;
    attendees?: Attendee[];
    hostedBy: string;
    tags?: [];
    series?: string;
    image?: string;
    flyer?: string;
    active: boolean;
}
