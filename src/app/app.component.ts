import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import {
  faTwitter,
  faLinkedinIn,
  faFacebook,
  faGithub,
  faDiscord,
  faSlack,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright, faHeart } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public route = "";
  public title = "Chapter Website";
  public faTwitter = faTwitter;
  public faLinkedinIn = faLinkedinIn;
  public faFacebook = faFacebook;
  public faGithub = faGithub;
  public faDiscord = faDiscord;
  public faSlack = faSlack;
  public faCopyright = faCopyright;
  public faInstagram = faInstagram;
  public faHeart = faHeart;

  constructor(location: Location, private router: Router) {
    router.events.subscribe(() => {
      this.route = location.path();
    });
  }

  ngOnInit() {}
}
