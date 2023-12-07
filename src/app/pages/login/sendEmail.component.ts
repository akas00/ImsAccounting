import { LoginService } from './loginService.service';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
@Component(
    {
        selector: 'SendEmail',
        templateUrl: './sendEmail.component.html',
        styleUrls: ["./forgetPassword.css"],
    }
)
export class SendEmailComponent {
    securityCode=true;
    email:any;
    constructor(fb: FormBuilder, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
        this.securityCode=false;
        this.email=this.loginService.UsersObj;
        ////console.log("this Eai",this.email)
    }
    sendmail(){
      this.loginService.sendEmail(this.email)
      this.loginService.securityCode=true;
      this.loginService.email=this.email;
      ////console.log("SendMail",this.email);
    }
    Cancel(){
        this.loginService.loginpage=true;
        this.loginService.sendMail=false;
    }
    Nolonger(){
        alert("If you dont have access to the email. Please contact your adminstration for new password.")
    }
}