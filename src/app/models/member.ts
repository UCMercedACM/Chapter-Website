import { Url } from "url";

export interface Members {
    members: Member[];
}

export interface Member {
    id: number;
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    year?: string;
    github?: Url;
    linkedin?: Url;
    personalWebsite?: Url;
    stackOverflow?: Url;
    portfolium?: Url;
    handshake?: Url;
    slack?: string;
    discord?: string;
    thumbnail?: string;
    active: boolean;
    banned: boolean;
    privilege: string;
    joined?: Date;
    token: string;
}

export interface FullName {
    firstName: string;
    lastName: string;
}
