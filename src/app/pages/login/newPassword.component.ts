import { LoginService } from './loginService.service';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
@Component(
    {
        selector: 'newPassword',
        templateUrl: './newPassword.component.html',
        styleUrls: ["./forgetPassword.css"],
    }
)
export class NewPasswordComp {
    newpassword = true;
    public form: FormGroup;
    username: any;
    DialogMessage: string = " ";
    @ViewChild('childModal') childModal: ModalDirective;

    constructor(fb: FormBuilder, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
        this.newpassword = false;
        this.form = fb.group({
            NEWPASSWORD: ['', Validators.required],
        });
        // this.security = this.form.controls['Security'];
    }
    confirmPassword() {
        this.DialogMessage = "Checking Code..."
        this.childModal.show();
        this.username = this.loginService.UsersObj.username;
        this.loginService.updatePassword(this.form.value.NEWPASSWORD, this.username)
            .subscribe(
            data => {
                //console.log('saDATA', data)
                if (data == "error") {
                    this.DialogMessage = "cannot save password. please try again"
                    setTimeout(() => {
                        this.childModal.hide();
                        this.form.patchValue({ NEWPASSWORD: "", })
                        return;
                    }, 1000)

                }
                else {
                    this.DialogMessage = "Password Changed"
                    this.childModal.show();
                    setTimeout(() => {
                        this.childModal.hide();
                        this.loginService.loginpage = true;
                        this.loginService.securityCode = false;
                        this.loginService.sendMail = false;
                        this.loginService.newPassword = false;

                    }, 2000)

                }

            });

    }
    Cancel() {
        this.loginService.newPassword = false;
        this.loginService.loginpage = true;
        this.loginService.securityCode = false;
        this.loginService.sendMail = false;
    }
}