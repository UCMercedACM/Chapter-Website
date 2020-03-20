import { Url } from "url";

export interface Members {
  members: Member[];
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
  year?: string;
  github?: Url;
  linkedin?: Url;
  token: string;
  portfolium?: Url;
  handshake?: Url;
  slack?: string;
  discord?: string;
  image?: string;
  active?: boolean;
  banned?: boolean;
  createdDate?: Date;
}

export interface FullName {
  firstName: string;
  lastName: string;
}
