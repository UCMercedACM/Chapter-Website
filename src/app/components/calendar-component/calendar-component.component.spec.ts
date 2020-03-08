import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponentComponent } from './calendar-component.component';

describe('CalendarComponentComponent', () => {
  let component: CalendarComponentComponent;
  let fixture: ComponentFixture<CalendarComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
