import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      body: ["", [Validators.required, Validators.minLength(20)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    }

    const { firstName, lastName, email, body } = this.contactForm.value;

    window.location.href = `mailto:acm@ucmerced.edu?subject=[ACM Website Contact Form] Questions&body=Hello ACM,%0D%0A${body}%0D%0A%0D%0AFrom,%0D%0A${firstName} ${lastName}&CC=${email}`;
  }
}
