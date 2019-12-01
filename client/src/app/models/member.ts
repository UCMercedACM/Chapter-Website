import { Url } from 'url';

export interface Member {
  id: string;
  firstName: string;
  lastname: string;
  email: string;
  year: string;
  studentID: number;
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
