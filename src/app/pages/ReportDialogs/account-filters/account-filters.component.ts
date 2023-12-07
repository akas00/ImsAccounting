import { Component, Output, EventEmitter } from "@angular/core";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
import { ReportMainService } from "../../Reports/components/ReportMain/ReportMain.service";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { PLedgerservice } from "../../masters/components/PLedger/PLedger.service";

@Component({
    selector: "account-filters",
    templateUrl: "./account-filters.component.html",
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    providers:[PLedgerservice]
})
export class AccountFilters {
    result: any;
    account:any[]=[];

    constructor(public masterService: MasterRepo, private _reportFilterService: ReportMainService,        private PledgerService: PLedgerservice) {
        ////console.log("this._reportFilterService.ReportFilterObject.Reportname", this._reportFilterService.ReportFilterObject.Reportnameis)
        _reportFilterService.ReportFilterObject.multipleAccounts = [];

        if(this._reportFilterService.AccoutLedgerObj.assignPrevioiusDate == true && this._reportFilterService.reportUrlPath == 'accountledgerreport' && (_reportFilterService.AccoutLedgerObj.multipleAccounts && _reportFilterService.AccoutLedgerObj.multipleAccounts.length!=0)){
            _reportFilterService.ReportFilterObject.multipleAccounts = _reportFilterService.AccoutLedgerObj.multipleAccounts;
    }
        if(this._reportFilterService.PartyLedgerObj.assignPrevioiusDate == true && this._reportFilterService.reportUrlPath == 'partyledgerreport' && (_reportFilterService.PartyLedgerObj.multipleAccounts && _reportFilterService.PartyLedgerObj.multipleAccounts.length!=0)){
            _reportFilterService.ReportFilterObject.multipleAccounts = _reportFilterService.PartyLedgerObj.multipleAccounts;
    }
      

        this.masterService.getAccountListACIDNotLikePA().subscribe(res => {
            this.account=res;
            if(this.account.length!=0){
                this._reportFilterService.result=true;
            }else{
                this._reportFilterService.result=false;
            }    
        })
        
        this.masterService.getAccountListACIDLikePA().subscribe(res => {
            this.account=res;
            if(this.account.length!=0){
                this._reportFilterService.result=true;
            }else{
                this._reportFilterService.result=false;
            }    
        })
    }

    dropListItem = (keyword: any): Observable<Array<any>> => {
        return new Observable((observer: Subscriber<Array<any>>) => {
            if (this._reportFilterService.ReportFilterObject.Reportnameis == 'accountledger') {
                this.masterService.getAccountListACIDNotLikePA().map(data => {
                    this.result = data.result;
                    return this.result.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                }
                ).subscribe(res => { observer.next(res); })
            } else if (this._reportFilterService.ReportFilterObject.Reportnameis == 'partyledger') {
                this.masterService.getAccountListACIDLikePA().map(data => {
                    this.result = data.result;
                    return this.result.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                }
                ).subscribe(res => { observer.next(res); })
            }else if(this._reportFilterService.ReportFilterObject.Reportnameis=='debitorsoutstanding'){
                let ptype = 'C'
                this.PledgerService.getPartyItemByPtype(ptype).map(data => {
                    if (data.status == "ok") {
                        let result = data.result;
                        return result.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                    }
                }
                ).subscribe(res => { observer.next(res); })
            }else if(this._reportFilterService.ReportFilterObject.Reportnameis=='creditorsoutstanding'){
                let ptype = 'V'
                this.PledgerService.getPartyItemByPtype(ptype).map(data => {
                    if (data.status == "ok") {
                        let result = data.result;
                        return result.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                    }
                }
                ).subscribe(res => { observer.next(res); })
            }
        }).share();
    }

    accodeMultipleChanged(value: string) {
        var item = this.masterService.accountList.find(x => x.ACCODE == value);
        this._reportFilterService.ReportFilterObject.multipleACNAME = '';
        if (item) {
            value = item.ACNAME;
            //console.log(value + "****");
            this._reportFilterService.ReportFilterObject.multipleACNAME = value;
        }
    }

    onEnterMulAcnameChange(value) {
        this.accodeMultipleChanged(value);
    }

    itemMultipleChanged(value: any) {
        if (typeof (value) === "object") {
            this._reportFilterService.ReportFilterObject.multipleACNAME = value.ACNAME;
            this._reportFilterService.ReportFilterObject.multipleACCODE = value.ACCODE;
            this._reportFilterService.ReportFilterObject.multipleACID = value.ACID;
    }
}

    addAccountToList() {
        let selectACList = this._reportFilterService.ReportFilterObject.multipleAccounts.filter(acList => acList.ACNAME == this._reportFilterService.ReportFilterObject.multipleACNAME)
        if (
            this._reportFilterService.ReportFilterObject.multipleACNAME === "" ||
            this._reportFilterService.ReportFilterObject.multipleACNAME === null ||
            this._reportFilterService.ReportFilterObject.multipleACNAME === undefined
        ) {
            return;
        }

        if (selectACList.length === 0) {
            this._reportFilterService.ReportFilterObject.multipleAccounts.push({ ACID: this._reportFilterService.ReportFilterObject.multipleACID, ACNAME: this._reportFilterService.ReportFilterObject.multipleACNAME })
                this._reportFilterService.ReportFilterObject.multipleACNAME='';
                this._reportFilterService.ReportFilterObject.multipleACCODE='';
        }
    }

    deleteAccount(index) {
        this._reportFilterService.ReportFilterObject.multipleAccounts.splice(index, 1)
    }
}