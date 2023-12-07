import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import 'style-loader!./login.scss';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../common/services/permission';
import { LoginService } from './loginService.service';
import { Http } from '@angular/http';
//import {getmac} from 'getmac';
@Component({
  selector: 'logincopy',
  templateUrl: './login.html',
  providers: [Http]
})
export class LoginCopy implements OnInit {
  @Output('signedIn') signedIn = new EventEmitter();
  @Input('toUrl')
  set toUrl(value: string) {
    this._toUrl = value;
    //console.log(value);
  }
  private _toUrl: string = '';
  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  returnUrl: string;
  signOut;
  constructor(fb: FormBuilder, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
    try {
      this.form = fb.group({
        'email': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      });

      this.email = this.form.controls['email'];
      this.password = this.form.controls['password'];
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  ngOnInit() {
    try {
      ////console.log("login");
      let logout = this.route.snapshot.params['logout'];
      //console.log(logout);
      this.returnUrl = this.route.snapshot.params['returnUrl'] || '/';
      //console.log({ retUrl1: this.returnUrl });

      if (logout) {
        ////console.log("log out");
        this.onLogOut();
      }
      ////console.log(this.returnUrl);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  public onSubmit(values: Object): void {
    try {
      this.submitted = true;
      //console.log({ valid: this.form.valid, url: this.returnUrl });
      if (this.form.valid) {
        //console.log(this.email.value, this.password.value);
        this.loginService.login(this.email.value, this.password.value)
          .subscribe(
          data => {
            //console.log(this.returnUrl + "/pages/dashboard");
            if (this._toUrl != '') {
              this.signedIn.emit("logged In");
            }
            else {
              this.router.navigate([this.returnUrl]);
            }
          },
          error => {
            //console.log(error);
            if (error._body == "Invalid credentials") {
              alert("Invalid username or password")
              return;
            }
            alert(error._body);
            this.submitted = false;
          }
          )
        // your code goes here
        // //console.log(values);
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  public onLogOut(): void {
    this.loginService.logout();
  }
}
