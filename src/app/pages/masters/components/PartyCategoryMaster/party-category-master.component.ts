import { Component } from '@angular/core';
import { AuthService } from '../../../../common/services/permission/authService.service';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component({
  selector: 'partycateogry-master-selector',
  templateUrl: './party-category-master.component.html',
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css", "./party-category-master.component.css"]
})
export class PartyCategoryMasterComponent {
  detailsObj: DetailsObj = <DetailsObj>{};
  userSetting: any;

  constructor(private masterService: MasterRepo,
    private router: Router,
    private alertService: AlertService,
    private loader: SpinnerService,
    private _authService: AuthService
    ) {
      this.userSetting = this._authService.getSetting();
  }

  cancel() {
    this.router.navigate(["pages/dashboard/dashboard"]);
  }

  save() {

    if(this.detailsObj.ORGTYPECODE === null || this.detailsObj.ORGTYPECODE === undefined || this.detailsObj.ORGTYPECODE === ''){
      this.alertService.error("Party Code cannot be empty");
    }
    if(this.detailsObj.ORGTYPECODE.trim() === ""){
      this.alertService.error("Party Code cannot be empty");
    }

    if(this.detailsObj.ORGTYPENAME === null || this.detailsObj.ORGTYPENAME === undefined || this.detailsObj.ORGTYPENAME === ''){
      this.alertService.error("Party Code cannot be empty");
    }
    if(this.detailsObj.ORGTYPENAME.trim() ===""){
      this.alertService.error("Party Code cannot be empty");
    }
    if(this.detailsObj.PARTYTYPE === null || this.detailsObj.PARTYTYPE === undefined || this.detailsObj.PARTYTYPE === ''){
      this.detailsObj.PARTYTYPE = 'C';
    }
    this.loader.show("Saving data. Please wait...");
    this.masterService.savePartyCategory(this.detailsObj).subscribe(
      (res: any) => {
        if (res.status == "ok") {
          this.loader.hide();
          this.alertService.success("Data Saved Successfully !");
          this.reset();
        } else {
          this.loader.hide();
          this.alertService.error(res.result._body);
        }
      }, err => {
        this.loader.hide();
        this.alertService.error(err);
      }
    );
  }

  reset(){
    this.detailsObj=<DetailsObj>{};
  }
}

export interface DetailsObj {
  ORGTYPECODE: string,
  ORGTYPENAME: string,
  PARTYTYPE: string
}

