import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter, Input } from "@angular/core";
import * as moment from 'moment'
import { MasterRepo } from "../../repositories";
import { Observable, Subscriber } from "rxjs";
import { AlertService } from "../../services/alert/alert.service";
import { ReportFilterService } from "./report-filter.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../generic-grid/generic-popup-grid.component";
import { AuthService } from "../../services/permission";

@Component({
  selector: "report-filter",
  templateUrl: "./report-filter.component.html",
  // styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class ReportFilterComponent implements OnInit {
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  private isActive: boolean = false
  @ViewChild('division') division: ElementRef
  @ViewChild('voucherType') voucherType: ElementRef
  @ViewChild('showNarration') showNarration: ElementRef
  @Output() filterEmiiter = new EventEmitter()
  @Input() reportType: string
  ReportFilterObj: ReportFilterOption = <ReportFilterOption>{}
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
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
  private divisionList = []
  private vouchertypeList = [];
  userProfile:any;
  CostcenterList : any[] = [];
  userSetting:any;

  constructor(private _masterRepo: MasterRepo, private alertService: AlertService,
    private _authService: AuthService, 
     private _alertService: AlertService, public _reportFilterService: ReportFilterService) {
      var PID = this._masterRepo.PhiscalObj.PhiscalID;
      var division = this._masterRepo.PhiscalObj.Div;
      PID = PID.replace("/","ZZ")
    this.gridPopupSettings = {
      title: "Group Ledger",
      apiEndpoints: `/getMasterPagedListOfAny/${PID}/vtype/${division}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACCODE",
          title: "CODE",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.userProfile = this._authService.getUserProfile();
    this.userSetting = _authService.getSetting();

    
    if (this._masterRepo.userSetting.userwisedivision == 1) {
      this._masterRepo.getDivisionFromRightPrivelege().subscribe(res => {
          if (res.status == 'ok') {
            this.divisionList = res.result;
          }
      })
  }
  else {
    this._masterRepo.getAllDivisions().subscribe((res) => {
      this.divisionList.push(res)
    })
  }
    this._masterRepo.getAllVoucherType().subscribe((res) => {
      this.vouchertypeList.push(res)

    })
    this.selectedDate = {
      startDate: moment(new Date()),
      endDate: moment(new Date())
    }

    this._masterRepo.getCostcenter().subscribe(res => {
      this.CostcenterList = res;
  })
  this._masterRepo.getAccDivList();

  }
  ngOnInit() {
    this.loadParams(this.reportType)
   this._reportFilterService.ReportFilterObj.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    //this._reportFilterService.ReportFilterObj.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
 
    
    this._reportFilterService.ReportFilterObj.DATE1=this._masterRepo.PhiscalObj.BeginDate.split('T')[0];
    this.changeEntryDate(this._reportFilterService.ReportFilterObj.DATE1, "AD");
    this._reportFilterService.ReportFilterObj.DATE2 = this._masterRepo.PhiscalObj.EndDate.split('T')[0];
    this.changeEndDate(this._reportFilterService.ReportFilterObj.DATE2, "AD");
    
  }
ngAfterViewInit(){
  this.calcStock()
}
  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        this._reportFilterService.ReportFilterObj.BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
       // this.startDateResponse.emit(value);
    } 
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
        // var bsDate = (value.replace("-", "/")).replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this._masterRepo.ValidateNepaliDate(Engdate)
            if(Validatedata == true){
              const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
              var adDate1 = adbs.bs2ad(bsDate1);
              this._reportFilterService.ReportFilterObj.DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            } 
        // this._reportFilterService.ReportFilterObj.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
}

changeEndDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        this._reportFilterService.ReportFilterObj.BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
       // this.endDateResponse.emit(value);
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
        // var bsDate = (value.replace("-", "/")).replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        const Validatedata = this._masterRepo.ValidateNepaliDate(Engdate)
        if(Validatedata == true){
          const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
          var adDate1 = adbs.bs2ad(bsDate1);
          this._reportFilterService.ReportFilterObj.DATE2  = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
        }else{
            this.alertService.error("Cannot Change the date");
          return;
        } 
        // this._reportFilterService.ReportFilterObj.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
}



  dateChanged(date) {
    this._reportFilterService.ReportFilterObj.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this._reportFilterService.ReportFilterObj.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')

  }
  divisionChanged() {
    this._reportFilterService.ReportFilterObj.DIV = this.division.nativeElement.value

  }

  showNarrationChanged() {
    this._reportFilterService.ReportFilterObj.SHOWNARRATION = this.showNarration.nativeElement.value
  }


  voucherTypeChanged() {
    this._reportFilterService.ReportFilterObj.VTYPE = this.voucherType.nativeElement.value
  }


  setVoucherName(id: string) {
    this._reportFilterService.ReportFilterObj.VOUCHERNAME = "All"
    this.vouchertypeList.forEach(x => {
      if (x.VOUCHER_ID == id) {
        this._reportFilterService.ReportFilterObj.VOUCHERNAME = x.VOUCHER_TYPE
      }
    })
  }



  show() {
    this.isActive = true
  }

  popupClose() {
    this.isActive = false;
  }

  accodeChanged(value: string) {
    let item = this._masterRepo.accountList.find(x => x.ACCODE == value);
    this._reportFilterService.ReportFilterObj.ACCNAME = '';
    if (item) {
      value = item.ACNAME;
      this._reportFilterService.ReportFilterObj.ACCNAME = value;
    }
  }


  itemChanged(value: any) {
    if (typeof (value) === "object") {
      this._reportFilterService.ReportFilterObj.ACCNAME = value.ACNAME;
      this._reportFilterService.ReportFilterObj.ACCODE = value.ACCODE;
      this._reportFilterService.ReportFilterObj.ACID = value.ACID;
    }
  }


  dropListItem = (keyword: any): Observable<Array<any>> => {

    return new Observable((observer: Subscriber<Array<any>>) => {
      this._masterRepo.getAccount("report").map(res => {
        if (this.reportType == "Cash Book") { return res.filter(x => x.TYPE == 'A' && x.MAPID == 'C'); }
        else if (this.reportType == "Bank Book") { return res.filter(x => x.TYPE == 'A' && x.MAPID == 'B'); }
        else { return res.filter(x => x.TYPE == 'A'); }

      }).map(data => {
        return data.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1 && ac.TYPE == 'A');
      }
      ).subscribe(res => { observer.next(res); })
    }).share();
  }

  onLedgerTypeChange() {
    this._reportFilterService.ReportFilterObj.ACCNAME = "";
    this._reportFilterService.ReportFilterObj.ACCODE = "";
    this._reportFilterService.ReportFilterObj.ACID = "";
  }


  onGroupEntered() {
    this.genericGrid.show("", false, "groupLedger");
  }

  onItemSelected(event) {
    this._reportFilterService.ReportFilterObj.ACID = event.ACID;
    this._reportFilterService.ReportFilterObj.ACCODE = event.ACCODE;
    this._reportFilterService.ReportFilterObj.ACCNAME = event.ACNAME;
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }



  applyClicked() {
    this.popupClose();
    
    if (this.reportType != "OpeningBalance" && this.reportType != "Cash Book" && this.reportType != "Bank Book") {
      if (this.division != null) {
        this._reportFilterService.ReportFilterObj.DIV = this.division.nativeElement.value;
      }
    }
    if (this.reportType == "Ledger Voucher") {
      if ('ACID' in this._reportFilterService.ReportFilterObj) {
        this.filterEmiiter.emit(this._reportFilterService.ReportFilterObj)
      } else {
        this._alertService.error("No Account Selected")
      }
    } else if (this.reportType == 'Voucher Register' || this.reportType == 'Day Book') {
      this.setVoucherName(this.voucherType.nativeElement.value)
      this._reportFilterService.ReportFilterObj.VTYPE = this.voucherType.nativeElement.value;
      this._reportFilterService.ReportFilterObj.SHOWNARRATION = this.showNarration.nativeElement.value;
      this.filterEmiiter.emit(this._reportFilterService.ReportFilterObj)
    } else {
      if (this.reportType == "PL"){
        if(this._reportFilterService.ReportFilterObj.DIV){
          if (this._reportFilterService.ReportFilterObj.DIV == '%') {
            this._reportFilterService.ReportFilterObj.PL_DIVISIONNAME = 'All';
          }else if(this._reportFilterService.ReportFilterObj.DIV!= '%'){
            let abc = this.divisionList.filter(x=>x.INITIAL == this._reportFilterService.ReportFilterObj.DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.ReportFilterObj.PL_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.ReportFilterObj.PL_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.ReportFilterObj.PL_DIVISIONNAME = '';
          }
        }
      }else if (this.reportType == "BS"){
        if(this._reportFilterService.ReportFilterObj.DIV){
          if (this._reportFilterService.ReportFilterObj.DIV == '%') {
            this._reportFilterService.ReportFilterObj.BS_DIVISIONNAME = 'All';
          }else if(this._reportFilterService.ReportFilterObj.DIV!= '%'){
            let abc = this.divisionList.filter(x=>x.INITIAL == this._reportFilterService.ReportFilterObj.DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.ReportFilterObj.BS_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.ReportFilterObj.BS_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.ReportFilterObj.BS_DIVISIONNAME = '';
          }
        }
      }

      this.filterEmiiter.emit(this._reportFilterService.ReportFilterObj)
    }
  }


  queryAndLoadData(dataStore) {
    if (this._reportFilterService.ReportFilterObj.isTBLDataLoaded) {
      if (this._reportFilterService.ReportFilterObj.isSummary && !this._reportFilterService.ReportFilterObj.isLedgerWise) {

        this._reportFilterService.ReportFilterObj.tblData = dataStore.summaryTrialBalance
        this._reportFilterService.selectedRowIndex = 0
      } else if (!this._reportFilterService.ReportFilterObj.isSummary && !this._reportFilterService.ReportFilterObj.isLedgerWise && !this._reportFilterService.ReportFilterObj.showAllLevel) {

        this._reportFilterService.ReportFilterObj.tblData = dataStore.detailTrialBalance
        this._reportFilterService.selectedRowIndex = 0

      } else if (this._reportFilterService.ReportFilterObj.showAllLevel && !this._reportFilterService.ReportFilterObj.isLedgerWise) {

        this._reportFilterService.ReportFilterObj.tblData = dataStore.allLevelTrialBalance
        this._reportFilterService.selectedRowIndex = 0
      } else if (this._reportFilterService.ReportFilterObj.isLedgerWise) {

        this._reportFilterService.ReportFilterObj.tblData = dataStore.ledgerTrialBalance
        this._reportFilterService.selectedRowIndex = 0
      }
    } else {
      this._reportFilterService.ReportFilterObj.isTBLDataLoaded = false
      this._reportFilterService.selectedRowIndex = 0
    }
  }


  loadParams(reportType: string) {
    this._reportFilterService.ReportFilterObj.DIV = "%";
    if(this.userSetting.IS_NESTLE==1){
      this._reportFilterService.ReportFilterObj.COMPANYTYPE = 'DMS';
    }else{
      this._reportFilterService.ReportFilterObj.COMPANYTYPE = 'NONDMS';
    }
    switch (reportType) {
      case "TBL":
        this.checkOpeningBalance();
        // this._reportFilterService.ReportFilterObj.showOpeningBalance = true,
          // this._reportFilterService.ReportFilterObj.showTransaction = true,
          this._reportFilterService.ReportFilterObj.isSummary = true,
          this._reportFilterService.ReportFilterObj.isLedgerWise = false,
          this._reportFilterService.ReportFilterObj.isZeroBalance = false,
          this._reportFilterService.ReportFilterObj.showAllLevel = false,
          // this._reportFilterService.ReportFilterObj.showClosingBalance = true,
          this._reportFilterService.ReportFilterObj.showAll = true,
          this._reportFilterService.ReportFilterObj.nodeACID = "AL"
        this._reportFilterService.ReportFilterObj.nodeACNAME = "ACCOUNT"
        break;
      case "BS":
        this._reportFilterService.ReportFilterObj.stockCalcAuto = false
        this._reportFilterService.ReportFilterObj.doStockEvaluation = false
        break;
      case "PL":
        this._reportFilterService.ReportFilterObj.stockCalcAuto = false
        this._reportFilterService.ReportFilterObj.doStockEvaluation = false
        break;
      default:
        break;
    }

  }




  calcStock() {
    this._reportFilterService.stockCalculation(this._reportFilterService.ReportFilterObj).subscribe((res) => {
      this._reportFilterService.ReportFilterObj.openingStock = res.result
      this._reportFilterService.ReportFilterObj.closingStock = res.result2
    })
  }

  checkOpeningBalance(){
    if(this._reportFilterService.ReportFilterObj.SHOWOPENINGTRIALONLY == true && 
      this._reportFilterService.ReportFilterObj.showPartylistInTrialBalance!=true &&
        this._reportFilterService.ReportFilterObj.showSubLedgerInTrialBalance!=true &&
        this._reportFilterService.ReportFilterObj.showClosingStockValueInTrialBalance!=true &&
        this._reportFilterService.ReportFilterObj.isZeroBalance!==true){
      this._reportFilterService.ReportFilterObj.showOpeningBalance = true;
      this._reportFilterService.ReportFilterObj.showClosingBalance = false;
      this._reportFilterService.ReportFilterObj.showTransaction = false;
    }else{
      this._reportFilterService.ReportFilterObj.showOpeningBalance = true;
      this._reportFilterService.ReportFilterObj.showClosingBalance = true;
      this._reportFilterService.ReportFilterObj.showTransaction = true;
    }
  }
}





export interface ReportFilterOption {
  DATE1: string;
  DATE2: string;
  BSDATE1:string;
  BSDATE2:string;
  ACID: string;
  DIV: string;
  ACCNAME: string;
  ACCODE: string;
  SHOWNARRATION: boolean;
  VTYPE: string;
  VOUCHERNAME: string;
  showClosingBalance: boolean;
  showOpeningBalance: boolean;
  showTransaction: boolean;
  showPartylistInTrialBalance:boolean;
  showSubLedgerInTrialBalance:boolean;
  showClosingStockValueInTrialBalance:boolean;
  isSummary: boolean;
  isLedgerWise: boolean;
  isZeroBalance: boolean;
  showAllLevel: boolean;
  nodeACID: string;
  nodeACNAME: string;
  isTBLDataLoaded: boolean;
  tblDataStore: any;
  tblData: [];
  showAll: boolean;
  stockCalcAuto: boolean;
  openingStock: number;
  closingStock: number;
  doStockEvaluation: boolean;
  trialBalanceTotalRow: any;
  directIncome: any;
  directExpense: any;
  directIncomeTotal: any;
  directExpenseTotal: any;
  directIncomeExpenseTotal: any;
  grossProfitCD: any;
  grossLossCD: any;
  indirectIncome: any;
  indirectExpense: any;
  netLoss: any;
  netProfit: any;
  indirectIncomeExpenseTotal: any;
  isPlLoaded: boolean
  lengthOfIncomeExpense: any
  lengthOfIndirectIncomeExpense: any
  assets: any;
  liabilities: any;
  differenceInClosingBalance: any;
  differenceInOpeningBalance: any;
  asstesTotal: any;
  liabilitiesTotal: any;
  isBSLoaded: boolean;
  lengthOfATLB: any;
  summaryreport: number;
  ledgerType: string;
  ShowSubLedgerBS: any;
  SHOWDEBTORSCREDITORSBS: any;
  ShowSubLedgerPL: any;
  TBL_CostCenter : any;
  SHOWOPENINGTRIALONLY:any;
  IsSubLedger:string;
  ACIDwithPA:boolean;
  COMPANYTYPE:string;
  PL_DIVISIONNAME:string;
  BS_DIVISIONNAME:string;
}