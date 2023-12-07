import { Component, ViewChild, ElementRef, PLATFORM_ID, Inject } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import * as moment from 'moment';
import { PartyReconciliationService } from "./party-reconciliation.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { BankReconciliation, Reconcile } from "../../../../common/interfaces/bank-reconciliation.interface";
import { isPlatformBrowser, DatePipe } from "@angular/common";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { stringify } from "querystring";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";

@Component({
    selector: 'party-reconciliation',
    templateUrl: './party-reconciliation.component.html',
    providers: [PartyReconciliationService],
    styleUrls: ["../../../Style.css"]

})

export class PartyReconciliationComponent {

    @ViewChild("bankReconciliationGeneric") bankReconciliationGeneric: GenericPopUpComponent;
    gridbankReconciliationPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("check") check: ElementRef;


    PartyReconciliationObj: BankReconciliation = new BankReconciliation();
    reconcileListObj: Reconcile = new Reconcile();
    public selectedValue: any;
    public reconcileList: Reconcile[] = [];
    public balanceAsPerCompanyBook: any[] = [];
    public amountNotReflectedOnBank: any[] = [];
    public notReflectedonBankDebit: number = 0;
    public notReflectedonBankCredit: number = 0;
    public balanceAsPerBankDebit: number = 0;
    public balanceAsperBankCredit: number = 0;
    public differenceDebit: number = 0;
    public differenceCredit: number = 0;
    public companybook: number = 0;
    public resBalance: number = 0;
    public resDifference: number = 0;
    public showCompanybook: boolean;
    public reflectedBank: boolean;
    public inValue: any;
    public showBankDate: boolean;

    public bDate: boolean;


    @ViewChild('bankInput') bankInput;

    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    alwaysShowCalendars: boolean = true;
    ranges: any = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Financial Year': [moment().set('date', 1).set('month', 3), moment().endOf('month').set('month', 2).add(1, 'year')],

    }
    locale = {
        format: 'DD/MM/YYYY',
        direction: 'ltr', // could be rtl
        weekLabel: 'W',
        separator: ' - ', // default is ' - '
        cancelLabel: 'Cancel', // detault is 'Cancel'
        applyLabel: 'Okay', // detault is 'Apply'
        clearLabel: 'Clear', // detault is 'Clear'
        customRangeLabel: 'Custom Range',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: 0 // first day is monday
    }

    constructor(@Inject(PLATFORM_ID) private platformId: Object,
     public masterService: MasterRepo, 
     private partyReconciliationService: PartyReconciliationService, 
     private spinnerService: SpinnerService,
     private alertSerivces: AlertService,
     private _transactionService: TransactionService,
      ) {
        this.masterService.ShowMore = true;
        this.showBankDate = false;
        this.selectedDate = {
            startDate: moment(),
            endDate: moment()
        }

        this.showCompanybook = false;
        this.reflectedBank = false;

        this.PartyReconciliationObj.DATE1 = new Date().toJSON().split('T')[0];
        this.PartyReconciliationObj.DATE2 = new Date().toJSON().split('T')[0];
        this.changeEntryDate(this.PartyReconciliationObj.DATE1, "AD");
        this.changeEndDate(this.PartyReconciliationObj.DATE2, "AD");
        this.PartyReconciliationObj.PARTYTYPE="C";

    }


    onItemDoubleClick(event) {
        this.selectedValue = event;
        this.PartyReconciliationObj.ACNAME = this.selectedValue.ACNAME;
        this.PartyReconciliationObj.ACID = this.selectedValue.ACID;
        this.onLoadClick();
    }


    onSaveExcelClick() {

    }

    onLoadClick() {
        this.spinnerService.show('Loading Data .. ');
        this.notReflectedonBankDebit = 0;
        this.notReflectedonBankCredit = 0;
        this.balanceAsPerBankDebit = 0;
        this.balanceAsperBankCredit = 0;
        this.differenceDebit = 0;
        this.differenceCredit = 0;
        this.companybook = 0;
        this.resBalance = 0;
        this.resDifference = 0;
        this.PartyReconciliationObj.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.PartyReconciliationObj.PHISCALID = this.masterService.PhiscalObj.PhiscalID;
       this.PartyReconciliationObj.DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
        this.partyReconciliationService.getPartyReconcileList(this.PartyReconciliationObj)
            .subscribe((res) => {
                var reconcileResult = res.result;
                if (res.status == 'ok') {
                    this.reconcileList = res.result.result

                    if (!this.reconcileList || !this.reconcileList.length) {
                        this.alertSerivces.error('Could not found data');
                    }
                    this.amountNotReflectedOnBank = res.result.amountNotReflectedOnBank
                    this.balanceAsPerCompanyBook = res.result.balanceAsPerCompanyBook
                    if (this.balanceAsPerCompanyBook == null) { this.showCompanybook = false; }
                    else {
                        if (this.balanceAsPerCompanyBook.length > 0) {
                            this.showCompanybook = true;
                        } else {
                            this.showCompanybook = false;
                        }
                    }
                    if (this.amountNotReflectedOnBank == null)
                     {
                          this.reflectedBank = false; 
                    }
                    else {
                        if (this.amountNotReflectedOnBank.length > 0) {
                            this.reflectedBank = true;
                        } else {
                            this.reflectedBank = false;
                        }
                    }
                    this.buildCheckBox()
                    this.DebitCreditCalculate()
                    this.spinnerService.hide()
                } else {
                    this.spinnerService.hide()
                    this.alertSerivces.error("Error" + res.result)
                }

            })
    }
    buildCheckBox() {
        for (let i in this.reconcileList) {
            this.reconcileList[i].isChecked = false
            if (this.reconcileList[i].BANKDATE == undefined || this.reconcileList[i].BANKDATE == null || String(this.reconcileList[i].BANKDATE) == '') {
                this.reconcileList[i].isReconciled = false
            } else {
                this.reconcileList[i].isReconciled = true

            }
        }
    }


    /**
     * Save Function to Save Bank Reconcilation
     */
    onSaveClick() {
        let x = this.reconcileList.filter(x => x.isChecked == true)
        if (x.length == 0) {
            this.alertSerivces.error("Please Select at least one voucher");
            return;
        } else {
            this.spinnerService.show("Saving Data. Please Wait!")
            this.partyReconciliationService.savePartyReconciliation(this.reconcileList.filter(x => x.isChecked == true))
                .subscribe((res) => {
                    if (res.status == "ok") {
                        this.spinnerService.hide()
                        this.alertSerivces.success("Reconciled  Successfully");
                        this.reconcileList = null;
                        if (this.reconcileList === undefined) {
                        }
                        this.PartyReconciliationObj = new BankReconciliation();
                        this.PartyReconciliationObj.DATE1 = new Date().toJSON().split('T')[0];
                        this.PartyReconciliationObj.DATE2 = new Date().toJSON().split('T')[0];
                        this.changeEntryDate(this.PartyReconciliationObj.DATE1, "AD");
                        this.changeEndDate(this.PartyReconciliationObj.DATE2, "AD");
                    } else {
                        this.spinnerService.hide()
                        this.alertSerivces.error("Error" + res.error);
                    }
                }, error => {
                    this.spinnerService.hide()
                    this.alertSerivces.error(error)
                })
        }


    }


    dateChanged() {
        this.PartyReconciliationObj.DATE1 = moment(this.selectedDate.startDate).format('YYYY-MM-DD HH:mm:ss')
        this.PartyReconciliationObj.DATE2 = moment(this.selectedDate.endDate).format('YYYY-MM-DD HH:mm:ss')
    }

    onBankReconciliationPopUPTab() {
        var TRNMODE = "Party Payment";
        if(this.PartyReconciliationObj.PARTYTYPE=="C"){
            TRNMODE="PartyBalance_Customer";
          }else{
          TRNMODE = "Party Payment";
          }
        this.gridbankReconciliationPopupSettings = {
            title: "Party Name ",
            apiEndpoints: `/getAccountPagedListByMapId/Details/${TRNMODE}`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACID",
                    title: "Party No.",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ACNAME",
                    title: "Party Name",
                    hidden: false,
                    noSearch: false
                }

            ]
        };
        this.bankReconciliationGeneric.show();
    }

    itemChecked(event, i: any) {
        if (event.target.checked) {
            this.reconcileList[i].isChecked = true;
            this.showBankDate = true;
            this.notReflectedonBankDebit = 0;
            this.notReflectedonBankCredit = 0;
            this.balanceAsPerBankDebit = 0;
            this.balanceAsperBankCredit = 0;
            this.differenceDebit = 0;
            this.differenceCredit = 0;
            // document.getElementById("bankDate" + i).focus();


        } else {
            this.reconcileList[i].isChecked = false;
            this.showBankDate = false;
            this.notReflectedonBankDebit = 0;
            this.notReflectedonBankCredit = 0;
            this.balanceAsPerBankDebit = 0;
            this.balanceAsperBankCredit = 0;
            this.differenceDebit = 0;
            this.differenceCredit = 0;
            for (let i in this.reconcileList) {
                if (this.reconcileList[i].isReconciled == false) {
                    this.reconcileList[i].BANKDATE = null;
                }
            }
        }
        this.DebitCreditCalculate();
    }

    DebitCreditCalculate() {
        this.notReflectedonBankDebit = 0;
        this.notReflectedonBankCredit = 0;
        this.balanceAsPerBankDebit = 0;
        this.balanceAsperBankCredit = 0;
        if (this.reconcileList == null) return;
        this.reconcileList.filter(x => isNaN(Date.parse(String(x.BANKDATE)))).forEach(i => {
            this.notReflectedonBankCredit += this._transactionService.nullToReturnZero(i.CRAMNT);
            this.notReflectedonBankDebit += this._transactionService.nullToReturnZero(i.DRAMNT)
        });

        if (this.balanceAsPerCompanyBook[0] != null) {
            let r = this.balanceAsPerCompanyBook[0].DRAMNT - (this.notReflectedonBankDebit - this.notReflectedonBankCredit);
            if (r > 0) {
                this.balanceAsPerBankDebit = r;

            }
            else {
                this.balanceAsperBankCredit = r;

            }
            let s = this.balanceAsPerCompanyBook[0].DRAMNT - r;
            if (s > 0) {

                this.differenceDebit = s;
            }
            else {

                this.differenceCredit = s;
            }
        }
    }
    parseFloat(param: any) {
        return parseFloat(param).toFixed(2);
    }

    KeyUpMethod(o: any) {
        for (let i in this.reconcileList) {
            if (this.reconcileList[i].isReconciled == false) {
                this.reconcileList[i].isChecked = true
                break;
            }
        }
    }


    BankDateFocus() {
        this.bDate = false
        this.notReflectedonBankDebit = 0;
        this.notReflectedonBankCredit = 0;
        this.balanceAsPerBankDebit = 0;
        this.balanceAsperBankCredit = 0;
        this.differenceDebit = 0;
        this.differenceCredit = 0;
        for (let i in this.reconcileList) {
            var date = this.reconcileList[i].TRNDATE
            var bankDate = this.reconcileList[i].BANKDATE
            var time1 = moment(date).format('YYYY-MM-DD');
            var time2 = moment(bankDate).format('YYYY-MM-DD');
            if (this.reconcileList[i].isReconciled == false) {
                if (time1 > time2) {
                    this.alertSerivces.error("Bank Date is less than Trnscation Date");
                }
            }
        }
        this.DebitCreditCalculate()
    }



    setBankDate(value, index) {
        if (value != null && value != undefined && value != "") {
            if (this.masterService.ValidateDate(value)) {
                this.reconcileList[index].BANKDATE = this.masterService.changeIMsDateToDate(value);
            } else {
                this.alertSerivces.error(`Invalid Transaction Date`);
                return;
            }
        }
    }




    getBankDate(index) {
        if (this.reconcileList[index].BANKDATE) {
            return this.masterService.customDateFormate(this.reconcileList[index].BANKDATE.toString());
        }
    }

    
    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.PartyReconciliationObj.BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
          // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if(Validatedata == true){
              const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
              var adDate1 = adbs.bs2ad(bsDate1);
              this.PartyReconciliationObj.DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                // this.alertService.error("Cannot Change the date");
              return;
            } 


        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.PartyReconciliationObj.BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if(Validatedata == true){
              const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
              var adDate1 = adbs.bs2ad(bsDate1);
              this.PartyReconciliationObj.DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                // this.alertService.error("Cannot Change the date");
              return;
            }

          }
    }

    parttypeChange(){
        this.PartyReconciliationObj.ACNAME="";
        this.PartyReconciliationObj.ACID="";
      }
}
