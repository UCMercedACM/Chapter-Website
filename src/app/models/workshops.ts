import { Url } from "url";

export interface Workshops {
  id: number;
  name: string;
  description: string;
  location: Geolocation;
  time: Date;
  date: Date;
  github: Url;
  googleSlide: Url;
  attendees: Attendee[];
  hostedBy: string;
  tags?: [];
  series?: string;
  difficulty?: number;
  image: string;
  flyer: string;
  active: boolean;
}

export interface Attendee {
  name: string;
  email: string;
  year: string;
}




