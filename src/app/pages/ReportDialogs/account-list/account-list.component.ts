import { Component, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
import { ReportMainService } from "../../Reports/components/ReportMain/ReportMain.service";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../common/popupLists/generic-grid/generic-popup-grid.component";

@Component({
    selector: "account-list",
    templateUrl: "./account-list.component.html",
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class AccountList implements OnInit {
    result: any;
    account:any[]=[];
    account2:any[]=[];

    @ViewChild("genericGridCashBankBook") genericGridCashBankBook: GenericPopUpComponent;
    gridPopupSettingsForAccountList: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(public masterService: MasterRepo,
         private _reportFilterService: ReportMainService) {

        if (this._reportFilterService.CashAndBankBookObj.Reportnameis == 'cashbankbookreport') {
            this.masterService.getCashListForReport().subscribe(res => {
                this.account=res.data;
                ////console.log("@@res",res)
                if(this.account.length!=0){
                this._reportFilterService.result=true;
                }else{
                    this._reportFilterService.result=false;
                } 
            })

            this.masterService.getBankBookListForReport().subscribe(res => {
                this.account2=res.data;
                if(this.account2.length!=0){
                    this._reportFilterService.result2=true;
                }else{
                    this._reportFilterService.result2=false;
                }
            })
        }
    }

    ngOnInit(){
        
    }

    AccountEnterClicked() {
        if(this._reportFilterService.CashAndBankBookObj.REPORTMODE=='1'){
            this.gridPopupSettingsForAccountList = this.masterService.getGenericGridPopUpSettings('CashBookList');
        }else if(this._reportFilterService.CashAndBankBookObj.REPORTMODE=='2'){
            this.gridPopupSettingsForAccountList = this.masterService.getGenericGridPopUpSettings('BankBookList');
        }
        this.genericGridCashBankBook.show();
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.CashAndBankBookObj.ACID = account.ACID;
        this._reportFilterService.CashAndBankBookObj.ACCNAME = account.ACNAME;
        this._reportFilterService.CashAndBankBookObj.SingleAccount = account.ACID;
    }

}