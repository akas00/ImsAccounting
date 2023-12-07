import { Component, ViewChild, ElementRef, PLATFORM_ID, Inject } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import * as moment from 'moment';
import { BankReconciliationService } from "./bank-reconciliation.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { BankReconciliation, Reconcile } from "../../../../common/interfaces/bank-reconciliation.interface";
import { isPlatformBrowser, DatePipe } from "@angular/common";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { stringify } from "querystring";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { AuthService } from "../../../../common/services/permission/authService.service";
import { Router } from "@angular/router";
import { Division } from "../../../../common/interfaces";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
    selector: 'bank-reconciliation',
    templateUrl: './bank-reconciliation.component.html',
    providers: [BankReconciliationService],
    styleUrls: ["../../../Style.css"]

})

export class BankReconciliationComponent {

    @ViewChild("bankReconciliationGeneric") bankReconciliationGeneric: GenericPopUpComponent;
    gridbankReconciliationPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("check") check: ElementRef;


    bankReconciliationObj: BankReconciliation = new BankReconciliation();
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
    userProfile = this.authservice.getUserProfile();
    fbdate= this.userProfile.CompanyInfo.FBDATE.split('T')[0];
    xyz=this.fbdate.split('-');
    fb_day=this.xyz[2];
    fb_month=this.xyz[1]-1;
    fb_year=this.xyz[0];
    fedate= this.userProfile.CompanyInfo.FEDATE.split('T')[0];
    pqr=this.fedate.split('-');
    fe_day=this.pqr[2];
    fe_month=this.pqr[1]-1;
    fe_year=this.pqr[0];
    returnUrl: string;
    division: any[] = [];



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
        'Financial Year': [moment().set('date', this.fb_day).set('month', this.fb_month).set('year', this.fb_year),
         moment().endOf('month').set('date', this.fe_day).set('month', this.fe_month).set('year', this.fe_year)],

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
     private bankReconciliationService: BankReconciliationService, 
     private spinnerService: SpinnerService,
     private alertSerivces: AlertService,
     private _transactionService: TransactionService,
     public authservice: AuthService,
     private router: Router
      ) {
        this.division=[];
        this.masterService.ShowMore = true;
        this.showBankDate = false;
        this.selectedDate = {
            startDate: moment(),
            endDate: moment()
        }

        // this.gridbankReconciliationPopupSettings = {
        //     title: "Bank Account Name ",
        //     apiEndpoints: `/getBankListPagedList`,
        //     defaultFilterIndex: 0,
        //     columns: [
        //         {
        //             key: "ACID",
        //             title: "Account No.",
        //             hidden: false,
        //             noSearch: false
        //         },
        //         {
        //             key: "ACNAME",
        //             title: "Account Name",
        //             hidden: false,
        //             noSearch: false
        //         }

        //     ]
        // };

        this.showCompanybook = false;
        this.reflectedBank = false;

            this.bankReconciliationObj.DATE1 = new Date().toJSON().split('T')[0];
            this.bankReconciliationObj.DATE2 = new Date().toJSON().split('T')[0];
            this.changeEntryDate(this.bankReconciliationObj.DATE1, "AD");
            this.changeEndDate(this.bankReconciliationObj.DATE2, "AD");

        if(this.masterService.userSetting.userwisedivision == 1){
            this.masterService.getDivisionFromRightPrivelege().subscribe(res=>{
                if(res.status == 'ok'){
                    this.division = res.result;
                }
            })
          }
          else{
           this.masterService.getAllDivisions()
           .subscribe(res => {
             this.division.push(<Division>res);
           }, error => {
             this.masterService.resolveError(error, "divisions - getDivisions");
           });
          }
    }


    onItemDoubleClick(event) {
        this.selectedValue = event;
        this.bankReconciliationObj.ACNAME = this.selectedValue.ACNAME;
        this.bankReconciliationObj.ACID = this.selectedValue.ACID;
        this.onLoadClick();
    }


    onSaveExcelClick() {

    }

    
    onLoadClick() {
        if(this.bankReconciliationObj.ACNAME == '' || this.bankReconciliationObj.ACNAME == null || this.bankReconciliationObj.ACNAME == undefined){
            this.alertSerivces.warning("Please select Bank first!");
            return;
        }
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

        this.bankReconciliationService.getBankReconcileList(this.bankReconciliationObj)
            .subscribe((res) => {
                var reconcileResult = res.result;
                if (res.status == 'ok') {
                    this.reconcileList = res.result.result
////console.log("ReconsilaltionList",this.reconcileList)
                    if (!this.reconcileList || !this.reconcileList.length) {
                        this.alertSerivces.info('Could not found data');
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
            this.alertSerivces.error("Please Select Bank Date of at least one voucher");
            return;
        } else {
            this.spinnerService.show("Saving Data. Please Wait!")
            this.bankReconciliationService.saveBank(this.reconcileList.filter(x => x.isChecked == true))
                .subscribe((res) => {
                    if (res.status == "ok") {
                        this.spinnerService.hide()
                        this.alertSerivces.success("Reconciled  Successfully");
                        this.reconcileList = null;
                        if (this.reconcileList === undefined) {
                        }
                        this.bankReconciliationObj = new BankReconciliation();
                        this.bankReconciliationObj.DATE1 = new Date().toJSON().split('T')[0];
                        this.bankReconciliationObj.DATE2 = new Date().toJSON().split('T')[0];
                        this.changeEntryDate(this.bankReconciliationObj.DATE1, "AD");
                        this.changeEndDate(this.bankReconciliationObj.DATE2, "AD");

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
        this.bankReconciliationObj.DATE1 = moment(this.selectedDate.startDate).format('YYYY-MM-DD HH:mm:ss')
        this.bankReconciliationObj.DATE2 = moment(this.selectedDate.endDate).format('YYYY-MM-DD HH:mm:ss')
    }

    onBankReconciliationPopUPTab() {
        this.onDivisionChanged();
        this.bankReconciliationGeneric.show();
    }

    itemChecked(event, i: any) {
        //console.log("BANKDATE",this.reconcileList[i].BANKDATE)
        if (this.reconcileList[i].BANKDATE) {
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
                this.itemChecked('',index);
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

    onBackClicked(){
        this.returnUrl = "/pages/dashboard/dashboard";
        this.router.navigate([this.returnUrl]);
      }

      DivisionEnterClicked() {
        this.bankReconciliationGeneric.show();
    }

    onDivisionChanged(){
        // //console.log("DIV",this.bankReconsciliationObj.DIV)
        this.bankReconciliationObj.ACNAME = "";
        let division = this.bankReconciliationObj.DIV?this.bankReconciliationObj.DIV:'ALL';
        if(this.bankReconciliationObj.DIV == '%'){
            division = 'ALL';
        }
        //console.log("this.userProfile.userDivision",this.userProfile.userDivision)
        division=this.userProfile.userDivision?this.userProfile.userDivision:'ALL';
        this.gridbankReconciliationPopupSettings = {
            title: "Bank Account Name ",
            apiEndpoints: `/getBankListPagedList/${division}`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACID",
                    title: "Account No.",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ACNAME",
                    title: "Account Name",
                    hidden: false,
                    noSearch: false
                }

            ]
        };
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.bankReconciliationObj.BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this.bankReconciliationObj.DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this.bankReconciliationObj.BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this.bankReconciliationObj.DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                // this.alertService.error("Cannot Change the date");
              return;
            }

          }
    }

    onExportClick(){
        this.exportAsExcelFile(this.reconcileList,this.balanceAsPerCompanyBook,this.notReflectedonBankDebit,this.notReflectedonBankCredit,this.balanceAsPerBankDebit,this.balanceAsperBankCredit,this.differenceDebit,this.differenceCredit,this.amountNotReflectedOnBank,"Bank Reconciliation")
    
    }


 
    public exportAsExcelFile(json: any[],json1:any,value1:any,value2:any,value3:any,value4:any,value5:any,value6:any,json2:any[], excelFileName: string){
       var newArray:any[]=[];
         newArray=Object.assign([], json)
         console.log("1",this.reconcileList);
        Object.keys(newArray).forEach((key: any)=>{
            newArray[key].VoucherType = json[key].VCHRTYPE;
            newArray[key].VoucherNumber = json[key].VNO;
            newArray[key].DIVISION = json[key].DIV;
            newArray[key].ACID = json[key].B_ACID;
            delete newArray[key].VCHRTYPE;
            delete newArray[key].VNO;
            delete newArray[key].DIV;
            delete newArray[key].B_ACID;
              console.log(newArray);
    
        })
        var obj1 = {} as any;
        newArray.push(obj1)

         json1[0].PARTICULARS="Balance As per Company Book"
         newArray.push(json1[0])
         if(json2 && json2.length>0){
            json2[0].PARTICULARS="Amount Not Reflected on Bank(opening)	"
            newArray.push(json2[0])
         }else{
             json2=[]
            var obj5 = {} as any;
            obj5.DRAMNT=0;
            obj5.CRAMNT=0;
            obj5.PARTICULARS="Amount Not Reflected on Bank(opening)	"
            json2.push(obj5)
            newArray.push(json2[0])
         }
    
           var obj2 = {} as any;
           obj2.DRAMNT=value1;
           obj2.CRAMNT=value2;
           obj2.PARTICULARS="Not Reflected on Bank (Periodic)";
           newArray.push(obj2)
           var obj3 = {} as any;
           obj3.DRAMNT=value3;
           obj3.CRAMNT=value4;
           obj3.PARTICULARS="Balance As Per Bank Book";
           newArray.push(obj3)
           var obj4 = {} as any;
           obj4.DRAMNT=value5;
           obj4.CRAMNT=value6;
           obj4.PARTICULARS="Difference";
           newArray.push(obj4)

        const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(newArray);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ABC");
    
        excelFileName += '.xlsx';
        /* save to file */
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
      }
    
    
        // public exportAsExcelFile(json: any[], excelFileName: string): void {
        //     const ws = XLSX.utils.book_new();
        //     // XLSX.utils.sheet_to_json(ws, this.Heading );
        
        //     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        //     const workbook: XLSX.WorkBook = { Sheets: { 'Ledger Report': worksheet }, SheetNames: ['Ledger Report'] };
        //     // let headerRow =XLSX.utils.json_to_sheet(json);
    
        //     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        //     this.saveAsExcelFile(excelBuffer, excelFileName);
        // }
        private saveAsExcelFile(buffer: any, fileName: string): void {
            const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
            FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
        }
}
