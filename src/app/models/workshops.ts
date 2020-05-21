import { Url } from "url";
import { Attendee } from "./attendee";

export interface Workshop {
    id: number;
    name: string;
    description: string;
    location?: Geolocation;
    time: Date;
    date: Date;
    github?: Url;
    googleSlide?: Url;
    attendees?: Attendee[];
    hostedBy: string;
    tags?: [];
    series?: string;
    difficulty?: number;
    image?: string;
    flyer?: string;
    active: boolean;
}
