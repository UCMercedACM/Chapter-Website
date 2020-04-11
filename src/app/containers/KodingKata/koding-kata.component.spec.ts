import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { KodingKataComponent } from "./koding-kata.component";

describe("KodingKataComponent", () => {
  let component: KodingKataComponent;
  let fixture: ComponentFixture<KodingKataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KodingKataComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KodingKataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
