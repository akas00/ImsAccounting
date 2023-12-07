import { LoginService } from './loginService.service';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';

@Component(
    {
        selector: 'SearchUser',
        templateUrl: './searchUser.component.html',
        styleUrls: ["./forgetPassword.css"],
    }
)
export class SearchUserComponent {
    public form: FormGroup;
    public email: AbstractControl;
    SendMail = true;
    DialogMessage: string = " ";
    @ViewChild('childModal') childModal: ModalDirective;
    constructor(fb: FormBuilder, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        });
        this.email = this.form.controls['email'];
        this.SendMail = false;

    }
    SearchUser() {
        if (this.email.value == '') {
            alert("Please enter your username")
            return
        }
        else {
            this.DialogMessage = "Searching Account..."
            this.childModal.show();
            this.loginService.ForgetPwd(this.email.value)
                .subscribe(
                data => {
                    //console.log('saDATA', data)
                    if (data == "Userincorrect") {
                        this.DialogMessage = "Account not found"
                        this.childModal.show();
                        setTimeout(() => {
                            this.childModal.hide();
                        }, 1000)
                        this.form.patchValue({ email: "", })

                    }
                    else {
                        setTimeout(() => {
                            this.childModal.hide();
                            this.loginService.UsersObj = data;
                            this.SendMail = this.loginService.sendMail = true;
                        }, 2000)

                    }

                });
        }
    }
    Cancel() {
        this.loginService.loginpage = true;
    }
    clickedEnter(){
        this.SearchUser();
    }
}