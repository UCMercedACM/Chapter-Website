import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CTFComponent } from "./capture-the-flag.component";

describe("CTFComponent", () => {
    let component: CTFComponent;
    let fixture: ComponentFixture<CTFComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CTFComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CTFComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
