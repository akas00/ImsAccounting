import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthService } from "../../../../common/services/permission";
import { Http, Response, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { GlobalState } from "../../../../global.state";
import { ReportFilterOptions, AccoutLedgerObj, PartyLedgerObj, SummaryLedgerObj, SummaryPartyLedgerObj, DebtorsReportObj, CreditorsReportObj, DebtorsAgeingObj, CreditorsAgeingObj, VoucherRegisterObj, CashAndBankBookObj, DayBookObj, SubLedgerObj, DebtorsOutstandingObj, CreditorsOutstandingObj, SubLedgerAcbaseObj, TrialBalanceObj, AdditionalCostDetailObj, AdditionalCostSummaryObj, SalesReturnSummaryObj, SalesReturnSummaryRetailerObj, SalesReturnReportDetailObj, StockSummaryAccountObj, CurrentStockWarehousewiseAccObj, StockAbcAnalysisAccountObj, StockValuationObj,StockLedgerAccountObj, ConsolidatedTrialBalanceObj, TDSObj, ProfitLossObj, BalanceSheetObj, ConsolidatedBalanceSheetObj, ConsolidatedProfitLossObj, BillTrackingObj, CreditorsBillTrackingObj, PostDatedChequeObj,MonthlySalesPaymentObj, LocalPurchaseCostAllocationObj, StockAgeingObj, ActualVsBudgetObj } from "./ReportMain";

@Injectable()
export class ReportMainService {
  reportLoadSubject:Subject<any> = new Subject<any>();
  assignPrevioiusDate:Boolean = false;
  ReportFilterObject: ReportFilterOptions = <ReportFilterOptions>{}
  AccoutLedgerObj:AccoutLedgerObj = <AccoutLedgerObj>{};
  PartyLedgerObj:PartyLedgerObj = <PartyLedgerObj>{};
  SummaryLedgerObj:SummaryLedgerObj = <SummaryLedgerObj>{};
  SummaryPartyLedgerObj:SummaryPartyLedgerObj = <SummaryPartyLedgerObj>{};
  DebtorsReportObj:DebtorsReportObj=<DebtorsReportObj>{};
  CreditorsReportObj:CreditorsReportObj=<CreditorsReportObj>{};
  DebtorsAgeingObj:DebtorsAgeingObj=<DebtorsAgeingObj>{};
  CreditorsAgeingObj:CreditorsAgeingObj=<CreditorsAgeingObj>{};
  ActualVsBudgetObj:ActualVsBudgetObj=<ActualVsBudgetObj>{};
  VoucherRegisterObj:VoucherRegisterObj=<VoucherRegisterObj>{};
  CashAndBankBookObj:CashAndBankBookObj=<CashAndBankBookObj>{};
  DayBookObj:DayBookObj=<DayBookObj>{};
  SubLedgerObj:SubLedgerObj=<SubLedgerObj>{};
  DebtorsOutstandingObj:DebtorsOutstandingObj=<DebtorsOutstandingObj>{};
  CreditorsOutstandingObj:CreditorsOutstandingObj=<CreditorsOutstandingObj>{};
  SubLedgerAcbaseObj:SubLedgerAcbaseObj=<SubLedgerAcbaseObj>{};
  TrialBalanceObj:TrialBalanceObj=<TrialBalanceObj>{};
  AdditionalCostDetailObj:AdditionalCostDetailObj=<AdditionalCostDetailObj>{};
  AdditionalCostSummaryObj:AdditionalCostSummaryObj=<AdditionalCostSummaryObj>{};
  SalesReturnSummaryObj:SalesReturnSummaryObj=<SalesReturnSummaryObj>{};
  SalesReturnSummaryRetailerObj:SalesReturnSummaryRetailerObj=<SalesReturnSummaryRetailerObj>{};
  SalesReturnReportDetailObj:SalesReturnReportDetailObj=<SalesReturnReportDetailObj>{};
  StockValuationAccountObj: StockValuationObj = <StockValuationObj>{};
  StockLedgerAccountObj:StockLedgerAccountObj=<StockLedgerAccountObj>{};
  StockSummaryAccountObj:StockSummaryAccountObj=<StockSummaryAccountObj>{};
  CurrentStockWarehousewiseAccObj:CurrentStockWarehousewiseAccObj=<CurrentStockWarehousewiseAccObj>{};
  StockAbcAnalysisAccountObj:StockAbcAnalysisAccountObj=<StockAbcAnalysisAccountObj>{};
  ConsolidatedTrialBalanceObj:ConsolidatedTrialBalanceObj=<ConsolidatedTrialBalanceObj>{};
  ProfitLossObj:ProfitLossObj=<ProfitLossObj>{};
  BalanceSheetObj:BalanceSheetObj=<BalanceSheetObj>{};
  TDSObj:TDSObj=<TDSObj>{};
  ConsolidatedBalanceSheetObj:ConsolidatedBalanceSheetObj=<ConsolidatedBalanceSheetObj>{};
  ConsolidatedProfitLossObj:ConsolidatedProfitLossObj=<ConsolidatedProfitLossObj>{};
  BillTrackingObj:BillTrackingObj=<BillTrackingObj>{};
  CreditorsBillTrackingObj:CreditorsBillTrackingObj=<CreditorsBillTrackingObj>{};
  PostDatedChequeObj:PostDatedChequeObj=<PostDatedChequeObj>{};
  MonthlySalesPaymentObj:MonthlySalesPaymentObj=<MonthlySalesPaymentObj>{};
  LocalPurchaseCostAllocationObj:LocalPurchaseCostAllocationObj=<LocalPurchaseCostAllocationObj>{};
  StockAgeingObj: StockAgeingObj = <StockAgeingObj>{};

  showAllcontactsInCC:boolean;
  result: boolean;
  SelectedAccount:string='';
  selectedAccountParty:String='';
  result2: boolean;
  reportUrlPath:any;
  reportDataStore:any[]=[];
  public selectedNode: any;
  previouslyLoadedReportList:any[]=[];
  reportWiseParamterandData:reportWiseParamandData[]=[];
  loadedTimes:number=0;
  loadedTimesD:number=0;
  instanceWiseRepName:string;
  Creditors_loadedTimes:number=0;
  AccLedger_loadedTimes:number=0;
  SummaryParty_loadedTimes:number=0;
  PartyLedger_loadedTimes:number=0;
  SubLedgerAcbase_loadedTimes:number=0;
  SubLedger_loadedTimes:number=0;
  DebtorsAgeing_loadedTimes:number=0;
  CreditorsAgeing_loadedTimes:number=0;
  DebtorsOuts_loadedTimes:number=0;
  CreditorsOuts_loadedTimes:number=0;
  VoucherReg_loadedTimes:number=0;
  CashBank_loadedTimes:number=0;
  DayBook_loadedTimes:number=0;
  TrialBalance_loadedTimes:number=0;
  ActualVsBUdget_loadedTimes:number=0;
  AdditionalCostDetail_loadedTimes:number=0;
  AdditionalCostSummary_loadedTimes:number=0;
  SalesReturnSummary_loadedTimes:number=0;
  SalesReturnSummaryRetailer_loadedTimes:number=0;
  SalesReturnReportDetail_loadedTimes:number=0;
  StockLedgerReportAcc_loadedTimes:number=0;
  StockSummaryAccount_loadedTimes:number=0;
  StockValuationAccount_loadedTimes:number = 0;
  CurrentStockWarehouseWiseAccount_loadedTimes:number=0;
  StockAbcAnalysisAccount_loadedTimes:number=0;
  consolidated_TrialBalance_loadedTimes:number=0;
  ProfitLoss_loadedTimes:number=0;
  BalanceSheet_loadedTimes:number=0;
  TDS_loadedTimes:number=0;
  Consolidated_BalanceSheet_loadedTimes:number=0;
  Consolidated_ProfitLoss_loadedTimes:number=0;
  BillTracking_loadedTimes:number=0;
  CreditorsBillTracking_loadedTimes:number=0;
  Monthlysales_Payment_loadedTimes:number=0;
  LocalPurchaseCostAlloc_loadedTimes:number=0;
  SelectedGroupAccount:string='';
  selectedGroupAccountParty:String='';
  SelectedVouchers:string='';

  showMultipleSalesman: boolean = false;
  showMultipleRetailer:boolean= false;
    constructor(
        private authService: AuthService,
        private http: Http,
        private state: GlobalState,
    ){
      this.reportDataStore =[];
    }

    saveExcelColumnFormate(dataToSave, postUrl) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let opt = this.getRequestOption();
        let hd: Headers = new Headers({ "Content-Type": "application/json" });
        let op: RequestOptions = new RequestOptions();
    
        this.http
          .post(this.apiUrl + postUrl, dataToSave, this.getRequestOption())
          .subscribe(
            data => {
              let retData = data.json();
              if (retData.status == "ok") {
                res.status = "ok";
                res.result = retData.result;
                returnSubject.next(res);
                returnSubject.unsubscribe();
              } else {
                res.status = "error1";
                res.result = retData.result;
                //console.log(res);
                returnSubject.next(res);
                returnSubject.unsubscribe();
              }
            },
            error => {
              (res.status = "error2"), (res.result = error);
              //console.log(res);
              returnSubject.next(res);
              returnSubject.unsubscribe();
            }
          );
        return returnSubject;
      }

      public getExcelColumnFormate(reportName){
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(`${this.apiUrl}/getExcelColumnFormate/${reportName}`, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();
      
                }
                else {
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;
      }


      public getRequestOption() {
        let headers: Headers = new Headers({
          "Content-type": "application/json",
          Authorization: this.authService.getAuth().token
        });
        return new RequestOptions({ headers: headers });
      }

      public get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";
    
        if (!!url && url.length > 0) {
          apiUrl = url[0];
        }
        return apiUrl;
      }

      saveReportColumnFormat(dataToSave, postUrl) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let opt = this.getRequestOption();
        let hd: Headers = new Headers({ "Content-Type": "application/json" });
        let op: RequestOptions = new RequestOptions();

        ////console.log("data",dataToSave);
    
        this.http
          .post(this.apiUrl + postUrl, dataToSave, this.getRequestOption())
          .subscribe(
            data => {
              let retData = data.json();
              if (retData.status == "ok") {
                res.status = "ok";
                res.result = retData.result;
                returnSubject.next(res);
                returnSubject.unsubscribe();
              } else {
                res.status = "error1";
                res.result = retData.result;
                //console.log(res);
                returnSubject.next(res);
                returnSubject.unsubscribe();
              }
            },
            error => {
              (res.status = "error2"), (res.result = error);
              //console.log(res);
              returnSubject.next(res);
              returnSubject.unsubscribe();
            }
          );
        return returnSubject;
      }

      public getReportColumnFormate(reportName){
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(`${this.apiUrl}/getReportColumnFormate/${reportName}`, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();
      
                }
                else {
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;
      }

  public stockCalculation(reportparam) {
    //console.log("COMPANYTYPE", reportparam.COMPANYTYPE)
    reportparam.COMPANYTYPE = reportparam.COMPANYTYPE ? reportparam.COMPANYTYPE : 'NONDMS';

    let res = { status: "error", result: "", result2: "" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .post(`${this.apiUrl}/stockCalculation`, reportparam, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            res.result2 = retData.result2;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            res.result2 = retData.result2;
            //console.log(res);
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public refreshReportColumnFormate(reportname,reportparam){
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    const bodyData={reportname:reportname,reportparam:reportparam}
    this.http.post(`${this.apiUrl}/refreshReportColumnFormate`,bodyData,this.getRequestOption())
        .subscribe(
          (data:any)=>{
            const retData = data;
            if (data.status == 'ok') {
                returnSubject.next(data);
                returnSubject.unsubscribe();
  
            }
            else {
                returnSubject.next(data)
                returnSubject.unsubscribe();
            }
        }, error => {
            res.status = 'error'; res.result = error;
            returnSubject.next(res);
            returnSubject.unsubscribe();
        }
        );
    return returnSubject;
  }


public exportReportFormat(reportName){
  let res = { status: "error", result: "" };
  let returnSubject: Subject<any> = new Subject();
  this.http.get(this.apiUrl + `/downloadReportFormat?reportName=${reportName}`, this.getRequestOption())
      .subscribe(response => {
          let data = response.json();
          if (data.status == 'ok') {
              returnSubject.next(data);
              returnSubject.unsubscribe();

          }
          else {
              returnSubject.next(data)
              returnSubject.unsubscribe();
          }
      }, error => {
          res.status = 'error'; res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
      }
      );
  return returnSubject;
}

}

export interface reportWiseParamandData{
   reportName:string;
   reportParam:string;
   reportData:any[];
}

export interface ReportColumnFormat{
  ReportName: string;
  ColumnName: string;
  MappingName: string;
  Show: number;
  ColWidth: number;
  Format: string;
  Align: string;
  ColumnPosition: number;
  GroupSummary: number;
  GSFunction: string;
  TableSummary: number;
  TSFunction: string;
  ReportTitle:string;
  rowsperpage:number;
  ColGroup:string;
}

export interface IExcelColumnFormat{
  SNO:Number;
  ReportName: string;
  ColumnName: string;
  MappingName: string;
  MergeHeader: string;
}
