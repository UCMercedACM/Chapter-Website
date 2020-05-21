import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CoffeeNCodeComponent } from "./coffee-n-code.component";

describe("CoffeeNCodeComponent", () => {
    let component: CoffeeNCodeComponent;
    let fixture: ComponentFixture<CoffeeNCodeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CoffeeNCodeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoffeeNCodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
