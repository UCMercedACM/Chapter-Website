import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-section-title",
  templateUrl: "./section-title.component.html",
  styleUrls: ["./section-title.component.scss"],
})
export class SectionTitleComponent implements OnInit {
  @Input() text: string;

  constructor() {
    this.text = "Section Title";
  }

  ngOnInit(): void {}
}
