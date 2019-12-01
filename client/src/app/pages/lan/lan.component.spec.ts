import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanComponent } from './lan.component';

describe('LanComponent', () => {
  let component: LanComponent;
  let fixture: ComponentFixture<LanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
