import { Component } from '@angular/core';
import { AuthService } from '../../../../common/services/permission/authService.service';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { CostCenterCategory } from '../../../../common/interfaces';


@Component({
  selector: 'budget-master-selector',
  templateUrl: './budget-master.component.html',
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css", "./budget-master.component.css"]
})
export class BudgetMasterComponent {
  BudgetList: any[] = [];
  userSetting: any;
  disableButton: boolean = false;
  filter: any;
  userProfile: any = <any>{};

  constructor(private masterService: MasterRepo,
    private router: Router,
    private alertService: AlertService,
    private loader: SpinnerService,
    private _authService: AuthService
  ) {
    this.userSetting = this._authService.getSetting();
    this.userProfile = _authService.getUserProfile();
    this.getAllBudgetList();
  }


  addBudget() {
    this.router.navigate(['./pages/account/AccountLedger/budget-master/addbudget'])
  }
  uploadBudget() {
    // this.router.navigate(['./pages/account/AccountLedger/budget-master/uploadbudget'])
    this.router.navigate(['./pages/account/AccountLedger/budget-master/addbudget'])
  }


  getAllBudgetList() {
    try {
      this.BudgetList = [];
      let fiscalid = this.userProfile.PhiscalYearInfo.PhiscalID;
      let division = this.userProfile.division;
      this.masterService.getAllBudgetList(fiscalid,division)
        .subscribe((res: any) => {
          console.log("cost getAllBudgetList", res)
          this.BudgetList = res;
        }, error => {
          this.alertService.info(error.result._body);
        }
        );
    } catch (ex) {
      alert(ex);
    }

  }

  onDeleteClick(event) {
    if (confirm("Are you sure you want to delete?")) {
      try {
        this.masterService.deleteBudgetAllocated(event.VCHRNO).subscribe(
          (response) => {
            if (response.status == 'ok') {
              this.alertService.info(response.result);
              this.getAllBudgetList()
            } else {
              this.alertService.info(response.result);
            }
          }, error => {
            this.alertService.info(error._body);
          }
        )
      } catch (ex) {
        alert(ex);
      }
    }

  }


  onEditClick(event): void {
    if (confirm("Are you sure you want to edit?")) {
      try {
        if (this.masterService.validateMasterCreation("edit") == false) {
          return;
        }
        this.router.navigate(["./pages/account/AccountLedger/budget-master/addbudget", { VCHRNO: event.VCHRNO, mode: "edit", returnUrl: this.router.url }]);
      } catch (ex) {
        alert(ex);
      }
    }
  }

  onViewClick(event): void {
    try {
      if (this.masterService.validateMasterCreation("view") == false) {
        return;
      }
      this.router.navigate(["./pages/account/AccountLedger/budget-master/addbudget", { VCHRNO: event.VCHRNO, mode: "view", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }


}





