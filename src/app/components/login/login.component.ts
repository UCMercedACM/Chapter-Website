import { Component, OnInit } from '@angular/core';
import {Member} from '../../models/member'
import { MemberStoreActions } from 'src/app/root-store';
import{Store} from '@ngrx/store';
import{MemberState} from '../../root-store/member/state'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  member:Member = new Member();

  constructor(
    private store: Store<MemberState>
  ) {}

  ngOnInit() {
  }
  OnSubmit(): void{
    const payload = {
      email:this.member.email,
      password:this.member.password 
    };
    this.MemberStore.dispatch(new LoginComponent(payload));
  }

}
