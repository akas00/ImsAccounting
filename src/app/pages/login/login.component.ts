import { MasterRepo } from './../../common/repositories/masterRepo.service';
import { CookieService } from 'angular2-cookie/core';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import 'style-loader!./login.scss';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../common/services/permission';
import { LoginService } from './loginService.service';
import { Http } from '@angular/http';
import { ModalDirective } from 'ng2-bootstrap';
export var var1: string;
import * as moment from 'moment';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  providers: [Http]
})
export class Login implements OnInit {
  @Output('signedIn') signedIn = new EventEmitter();
  @Input('toUrl')
  set toUrl(value: string) {
    this._toUrl = value;
  }
  @Output() filterData = new EventEmitter();
  private _toUrl: string = '';
  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public submitButtonStatus: boolean = true;
  userProfile: any = <any>{};
  returnUrl: string;
  signOut;
  @ViewChild('childModal') childModal: ModalDirective;
  DialogMessage: string = " "
  SendMail = true;
  SearchUser = true;
  securityCode = true;
  newPassword = true
  PhiscalYearList: any[] = [];
  public NewPhiscalYear: AbstractControl;

  constructor(fb: FormBuilder, private route: ActivatedRoute, private router: Router, private loginService: LoginService, private _cookieService: CookieService,private _authService:AuthService) {
    try {
      this.form = fb.group({
        'email': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'NewPhiscalYear': ['']
      });

      this.email = this.form.controls['email'];
      this.password = this.form.controls['password'];
      this.NewPhiscalYear = this.form.controls['NewPhiscalYear'];

    } catch (ex) {
      alert(ex);
    }



  }
  ngOnInit() {
    try {


      this.loginService.getAllPhiscalYear().subscribe(res => {
        if (res.status == 'ok') {
          // ////console.log("@@res",res)
          this.PhiscalYearList = res.result.result;
          this.form.controls.NewPhiscalYear.setValue(this.PhiscalYearList[0].PhiscalID);
          this.loginService.updatePhiscalYear(this.PhiscalYearList[0].PhiscalID).subscribe(res => {
            if (res.status == 'ok') {
            }
          })

        } else {
          this.PhiscalYearList = [];
          this.DialogMessage = "CompanyID not defined.";
          this.childModal.show();
          setTimeout(() => {
            this.childModal.hide();
          }, 4000)
        }
      }, error => {
        this.PhiscalYearList = []
      });

      let logout = this.route.snapshot.params['logout'];
      this.returnUrl = this.route.snapshot.params['returnUrl'] || '/';

      if (logout) {
        this.onLogOut();
      }
    } catch (ex) {
    }
    this.SendMail = false;
    this.SearchUser = false;
    this.loginService.sendMail = false;
    this.securityCode = false;
    this.loginService.securityCode = false;
    this.loginService.newPassword = false
    this.loginService.searchUser = false;
    this.loginService.loginpage = true;
  }
  public onSubmit(values: Object): void {
    try {
      this.updateFiscalYear();
      this.submitted = true;
      if (this.form.valid) {
        this.submitButtonStatus = false

        this.login(this.email.value, this.password.value);

      }
    } catch (ex) {
      alert(ex);
    }
  }

  public onLogOut(): void {
    this.loginService.logout();
  }

  public forgetPassword: boolean = false
  ForgetPassword() {
    this.loginService.searchUser = true;
    this.loginService.loginpage = false;

  }

  login(email, password) {
    this.loginService.login(email, password)
      .subscribe(
        data => {
          if (this._toUrl != '') {
            this.signedIn.emit("logged In");
            this.submitButtonStatus = true
          }
          else {
            sessionStorage.clear()
            if (this.returnUrl == "/")
              this.returnUrl = "/pages/dashboard/dashboard"

            this.router.navigate([this.returnUrl]);
            this.submitButtonStatus = true;
            var setting =this._authService.getSetting();
            if(setting.IS_DATABASE_SPLIT==0){
              let today_date=new Date().toJSON().split('T')[0];
                
              this.userProfile = this._authService.getUserProfile();
                var fiscalYearEndDateInDate = moment(this.userProfile.CompanyInfo.FEDATE).add(1, 'days');
                var fiscalYearEndDateInDateFormat=fiscalYearEndDateInDate.format('YYYY-MM-DD')
                 console.log("fiscalYearEndDateInDateFormat",fiscalYearEndDateInDateFormat);
                 console.log("@@today_Date",today_date);
            
                if(today_date >= fiscalYearEndDateInDateFormat){
                 //  alert("reached")
                   var PhiscalObj = this._authService.getPhiscalInfo();

                   if(setting.Is_Account_Independent==1 ){
                    if (this.userProfile.CompanyInfo.ActualFY == PhiscalObj.PhiscalID) {
                      this._authService.showfiscalPopup=true;
                    }
                  }
                  else{
                    if (this.userProfile.CompanyInfo.ActualFY == PhiscalObj.PhiscalID) {
                      alert("Please Change Phiscal Year from inventory system");
                    }
                }
              }
            }

                      
          }
        },
        error => {
          this.submitButtonStatus = true
           this.DialogMessage =JSON.parse(error._body).result;
          this.childModal.show();
          setTimeout(() => {
            this.childModal.hide();
          }, 4000)
          this.submitted = false;
        }
      )
  }

  updateFiscalYear() {
    this.loginService.updatePhiscalYear(this.form.controls.NewPhiscalYear.value).subscribe(res => {
      if (res.status == 'ok') {

      }
    })
  }

}
