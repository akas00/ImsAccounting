import { Component } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TAcList } from "../../../../common/interfaces";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { Subscription } from "rxjs";
import { AuthService } from "../../../../common/services/permission";
import { BankMasterService } from "./bank.service";


@Component({
  selector: 'bankdetails',
  templateUrl: './bank.component.html',
  providers: [MasterRepo, BankMasterService],
  styleUrls: ["../../../modal-style.css"],
})
export class BankComponent {
  form: FormGroup;
  viewMode = false;
  mode: string = "add";
  private returnUrl: string
  userProfile: any;
  private subcriptions: Array<Subscription> = [];
  modeTitle: string = '';
  AcListObj: TAcList = <TAcList>{};
  initialTextReadOnly: boolean = false;
  StateList:any[]=[];
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private preventNavigationService: PreventNavigationService,
    private router: Router,
    private loadingService: SpinnerService,
    protected MasterService: MasterRepo,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _bankService: BankMasterService
  ) {
    this.userProfile = this._authService.getUserProfile();
    this.buildForm();
    this.MasterService.getState().subscribe(res => {
      if (res.status == 'ok') {
        this.StateList = res.result;
      }
    })
  }

  ngOnInit() {
    try {
      if (!!this._activatedRoute.snapshot.params['returnUrl']) {
        this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
      }
      if (!!this._activatedRoute.snapshot.params['ACID']) {
        let BID: string = "";
        BID = this._activatedRoute.snapshot.params['ACID'];

        this._bankService.getBankList(BID)
          .subscribe(data => {
            if (data.status == 'ok') {
              //console.log(data);
              let bankObj = data.result;
              ////console.log("bank Obj value" + bankObj);
              this.form.patchValue({
                ACID: bankObj.ACID,
                ADDRESS: bankObj.ADDRESS,
                TYPE: bankObj.TYPE,
                ACNAME: bankObj.ACNAME,
                CRLIMIT: bankObj.CRLIMIT,
                BANKACCOUNTNUMBER: bankObj.BANKACCOUNTNUMBER,
                           
                CITY: bankObj.CITY,
                PHONE: bankObj.PHONE,
                GSTNO: bankObj.GSTNO,
                PSTYPE: bankObj.PSTYPE,
                           
                ISACTIVE: bankObj.ISACTIVE,
                PARENT: bankObj.PARENT,
                MAPID: bankObj.MAPID,
                HASSUBLEDGER: bankObj.HASSUBLEDGER,
                            ACCODE:bankObj.ACCODE,
                            IFCS_CODE:bankObj.IFCS_CODE,
                            CTYPE:bankObj.CTYPE

              })
              if (this._activatedRoute.snapshot.params['mode'] == null) {
                this.modeTitle = "Edit Bank";
              } else if (this._activatedRoute.snapshot.params['mode'] == "view") {
                this.modeTitle = "View Bank";
              }
              this.mode = 'edit';
              this.initialTextReadOnly = true;
            }
            else {
              this.mode = '';
              this.modeTitle = "Edit -Error in Bank Hierarchy";
              this.initialTextReadOnly = true;
            }
          }, error => {
            this.mode = '';
            this.modeTitle = "Edit2 -Error in Bank";
            //this.masterService.resolveError(error, "Company Hierarchy - getBranch");
          }
          )
      }
      else {
        this.mode = "add";
        this.modeTitle = "Add Bank";
        this.initialTextReadOnly = false;

      }

    } catch (ex) {
    }
  }

  buildForm() {
    this.form = this.fb.group({
      ACID: [""],
      ADDRESS: ["", [Validators.required]],
      TYPE: ["A"],
      ACNAME: ["", [Validators.required]],
      CRLIMIT: [0],
      BANKACCOUNTNUMBER: [""],
      CITY: [""],
      PHONE: [""],
      GSTNO: [""],
      PSTYPE: [""],
      PType: ["V"],
      ISACTIVE: [1],
      PARENT: ["AT1069"],
      MAPID: ["B"],
      HASSUBLEDGER: [0],
      LEVELS: [4],
      ACTYPE: ["AT"],
      CTYPE:[""],
      ACCODE : [""],
      IFCS_CODE:[""],
      STATE:[""],
      BANKBUILDING:[""]//bankbuilding use for Country
    });
    this.form.valueChanges.subscribe(data => {
      this.MasterService.BankObj = data;
    })
    this.onFormChanges();
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });
  }

  onSave() {

   if(this.form.controls['CTYPE'].value==null 
   || this.form.controls['ACNAME'].value==null
   ||this.form.controls['CTYPE'].value=="" 
   || this.form.controls['ACNAME'].value==""
   ||this.form.controls['CTYPE'].value==undefined 
   || this.form.controls['ACNAME'].value==undefined
   ){
    this.alertService.error("Please Filll the mandatory fields")
   }else{
    try {
      this.onSubmit();
    } catch (ex) {
      this.alertService.error(ex);
    }
   }

  }
  onSubmit() {
    try {

      let saveModel = Object.assign(<TAcList>{}, this.form.value);
      saveModel.DIV = this.userProfile.userDivision;
      if (this.mode == "edit") {

      } else {
      }
      // ////console.log("ALedger Data"+JSON.stringify(saveModel));
      this.loadingService.show("Saving Data please wait...");
      let sub = this.MasterService.saveAccount(
        this.mode,
        saveModel,
        null
      ).subscribe(
        data => {
          this.loadingService.hide();
          if (data.status == "ok") {
            ////console.log("PARTYDATA@@@@", data);
            this.alertService.success("Data Saved Successfully");
            this.preventNavigationService.preventNavigation(false);
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 1000);
          } else {

            this.alertService.error(
              "Error in Saving Data:" + data.result._body
            );
          }
        },
        error => {
          this.loadingService.hide();
          this.alertService.error(error);
        }
      );
      this.subcriptions.push(sub);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  cancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }



  disabled() {
    try {
      if (this.viewMode == true) {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

  editDisabled() {
    try {
      if (this.mode == "edit") {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

}
