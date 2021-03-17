import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SigsComponent } from "./sigs.component";

describe("SigsComponent", () => {
  let component: SigsComponent;
  let fixture: ComponentFixture<SigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
