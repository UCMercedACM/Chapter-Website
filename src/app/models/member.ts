import { Url } from 'url';

export class Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  year: string;
  github: Url;
  linkedin: Url;
  portfolium?: Url;
  handshake?: Url;
  slack: string;
  discord?: string;
  image?: string;
  active: boolean;
  banned: boolean;
  createdDate: Date;
}