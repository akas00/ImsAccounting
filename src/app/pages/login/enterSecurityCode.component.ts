import { LoginService } from './loginService.service';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
@Component(
    {
        selector: 'enterSecurity',
        templateUrl: './enterSecurityCode.component.html',
        styleUrls: ["./forgetPassword.css"],
    }
)
export class enterSecurityComp {
    securityCode = true;
    public form: FormGroup;
    public security: AbstractControl;
    DialogMessage: string = " ";
    @ViewChild('childModal') childModal: ModalDirective;
    constructor(fb: FormBuilder, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
        this.securityCode = false;
        this.form = fb.group({
            Security: ['', Validators.required],
        });
        // this.security = this.form.controls['Security'];
    }
    enterSecurity() {
        this.DialogMessage = "Checking Code..."
        this.childModal.show();
        this.loginService.emailCode(this.form.value.Security)
            .subscribe(
            data => {
                ////console.log("entryyyy", data)
                if (data > 0) {
                    setTimeout(() => {
                        this.childModal.hide();
                        this.loginService.newPassword = true
                    }, 2000)
                }
                else {
                    this.DialogMessage = "Incorrect Code. Please try again"
                    setTimeout(() => {
                        this.childModal.hide();
                        this.form.patchValue({ email: "", })
                        this.form.patchValue({ Security: "", })
                        return;
                    }, 1000)

                }
            });
    }
    Cancel() {
        this.loginService.loginpage = true;
        this.loginService.securityCode = false;
        this.loginService.sendMail = false;
    }
    ResendCode() {
        this.loginService.sendEmail(this.loginService.email);
        alert("A new code has sent to your email.")
    }
}