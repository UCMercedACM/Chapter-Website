import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Member } from "../models";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private http: HttpClient) {}
  getItems(): Observable<Member[]> {
    return Object.assign({
      id: 100247152,
      firstName: "Adrian",
      lastName: "Darian",
      email: "adarian@ucmerced.edu",
      year: "senior",
      github: "https://github.com/adriandarian",
      linkedin: "https://www.linkedin.com/in/adriandarian",
      portfolium: null,
      handshake: null,
      slack: "adarian",
      discord: "Wohin#0233",
      image: null,
      active: true,
      banned: false,
      createdDate: new Date(),
    });
  }
}
