import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectsDisplayComponent } from "./projects-display.component";

describe("ProjectsDisplayComponent", () => {
  let component: ProjectsDisplayComponent;
  let fixture: ComponentFixture<ProjectsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();

  });



});



