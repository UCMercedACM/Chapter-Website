import { Url } from 'url';

export interface Workshops {
  id: number;
  name: string;
  time: Date;
  location: Geolocation;
  description: string;
  rsvp: Attendee[];
  github: Url;
  hostedBy: string;
  tags: [];
  series: string;
  difficulty: number;
  image: string;
}

export interface Attendee {
  name: string;
  email: string;
  year: string;
}
