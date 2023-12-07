import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../../../common/services/permission/authService.service';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';

@Component({
  selector: 'add-merchant-details',
  templateUrl: './merchant-details-form.component.html',
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css", "./merchant-details-form.component.css"]
})
export class MerchantDetailsFormComponent {
  detailsObj: DetailsObj = <DetailsObj>{}

  @ViewChild("genericGridAccount") genericGridAccount: GenericPopUpComponent;
  gridPopupSettingsForAccountList: GenericPopUpSettings = new GenericPopUpSettings();

  constructor(private masterService: MasterRepo,
    private router: Router,
    private alertService: AlertService,
    private loader: SpinnerService) {
  }

  cancel() {
    this.router.navigate(["pages/dashboard/dashboard"]);
  }

  AccountEnterClicked() {
    this.gridPopupSettingsForAccountList = this.masterService.getGenericGridPopUpSettings('BankBookList');
    this.genericGridAccount.show();
  }

  dblClickAccountSelect(bank) {
    this.detailsObj.ACID = bank.ACID;
    this.detailsObj.BANKNAME = bank.ACNAME;
  }

  save() {
    this.loader.show("Saving data. Please wait...");
    this.masterService.saveMerchantDetails(this.detailsObj).subscribe(
      (res: any) => {
        if (res.status == "ok") {
          this.loader.hide();
          this.alertService.success("Data Saved Successfully !");
          this.reset();
        } else {
          this.loader.hide();
          this.alertService.error("Data cannot be saved.")
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
  ACID: string,
  BANKNAME: string,
  BANKACCOUNTNUMBER: string
}

