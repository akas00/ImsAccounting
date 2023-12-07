import {Component, Output, EventEmitter} from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";



@Component({
    selector: "popup-addnewcust",
    templateUrl: "./AddCustomerPopup.html",
    styleUrls: ["../../../../pages/Style.css", "../../../../common/popupLists/pStyle.css"],
})
export class AddNewCustomerPopUpComponent {
    @Output('okClicked') okClicked = new EventEmitter();
    isActive:boolean=false;
    CustObj:any=<any>{};
    StateList:any[]=[];
    constructor(public masterService: MasterRepo, public _trnMainService: TransactionService) {
        this.CustObj=<any>{};
        this.CustObj.GEO="WALK-IN";
        this.CustObj.CTYPE="RETAIL INVOICE";
        masterService.getState().subscribe(res => {
            if (res.status == 'ok') {
              this.StateList = res.result;
              this.CustObj.STATE=_trnMainService.userProfile.CompanyInfo.STATE;
             
            }
          })
    }

    show() {
        this.isActive = true;
      
    }

    hide() {

        this.isActive = false;
    }

    OK() {
       this.okClicked.emit(this.CustObj);
     

    }
    
}


