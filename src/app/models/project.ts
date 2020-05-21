import { Url } from "url";

export interface Project {
    id: number;
    name: string;
    time: Date;
    location: Geolocation;
    description: string;
    github: Url;
    hostedBy: string;
    tags: [];
    series: string;
    difficulty: number;
    image: string;
}
