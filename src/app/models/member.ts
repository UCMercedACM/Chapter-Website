import { Url } from "url";

export interface Members {
  members: Member[];
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  year?: string;
  token?: string;
  github?: Url;
  linkedin?: Url;
  portfolium?: Url;
  handshake?: Url;
  slack?: string;
  discord?: string;
  active?: boolean;
  banned?: boolean;
  privilege?: string;
  createdDate?: Date;
}

export interface FullName {
  firstName: string;
  lastName: string;
}
