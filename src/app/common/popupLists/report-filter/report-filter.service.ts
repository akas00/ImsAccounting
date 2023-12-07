import { Injectable, ElementRef, ViewChild } from '@angular/core';
import { ReportFilterOption } from './report-filter.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/permission';
import { GlobalState } from '../../../global.state';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MasterRepo } from '../../repositories';
import { ReportMainService } from '../../../pages/Reports/components/ReportMain/ReportMain.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
declare let jsPDF

@Injectable()

export class ReportFilterService {

    @ViewChild('dataTable') dataTable: ElementRef
    public selectedRowIndex = 0
    ReportFilterObj: ReportFilterOption = <ReportFilterOption>{}
    drillParam: DrillDownParam = <DrillDownParam>{}
    constructor(private masterService: MasterRepo, private router: Router, private http: Http, private authService: AuthService, private state: GlobalState,    public reportMainService: ReportMainService,
        ) {
        this.drillParam.reportparam = <drillDownReportParam>{};
    }
    drillDown(from: string, returnUrl: string = "") {
        this.drillParam = <DrillDownParam>{};
        this.drillParam.reportparam = <drillDownReportParam>{};

        this.drillParam.reportparam.mode = 'DRILL';
        this.drillParam.returnUrl = returnUrl
        this.drillParam.reportparam.ACCODE = this.ReportFilterObj.ACCODE;
        this.drillParam.reportparam.ACID = this.ReportFilterObj.ACID;
        this.drillParam.reportparam.ACCNAME = this.ReportFilterObj.ACCNAME;
        this.drillParam.reportparam.DATE1 = this.ReportFilterObj.DATE1;
        this.drillParam.reportparam.DATE2 = this.ReportFilterObj.DATE2;
        this.drillParam.reportparam.DIV = this.ReportFilterObj.DIV;
        this.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.drillParam.reportparam.PHISCALID = this.masterService.PhiscalObj.PhiscalID;
        this.drillParam.reportparam.CUSTOMERNAME=this.ReportFilterObj.ACCNAME;
        this.drillParam.reportparam.COSTCENTER=this.ReportFilterObj.TBL_CostCenter;
// ////console.log("@@this.ReportFilterObj",this.ReportFilterObj)
// ////console.log("@@this._reportFilterService.ReportFilterObj.IsSubLedger",this.ReportFilterObj.IsSubLedger)
// ////console.log("@@this.drillParam.reportparam.ACID",this.drillParam.reportparam.ACID)



let drillFrom = from.toUpperCase();
        switch (drillFrom) {
            case "TBL":
                this.router.navigate([this.resolveRouteUrlToDrillDown(drillFrom, this.ReportFilterObj.ledgerType,this.ReportFilterObj.ACIDwithPA,this.ReportFilterObj.IsSubLedger)]
                    , {
                        queryParams: {
                            mode: 'DRILL'
                        }
                    });
                break;
            case "BS":

                this.router.navigate([this.resolveRouteUrlToDrillDown(drillFrom, this.ReportFilterObj.ledgerType,this.ReportFilterObj.ACIDwithPA,this.ReportFilterObj.IsSubLedger)]
                    , {
                        queryParams: {
                            mode: 'DRILL'
                        }
                    });
                break;
            case "PL":
                this.router.navigate([this.resolveRouteUrlToDrillDown(drillFrom, this.ReportFilterObj.ledgerType,this.ReportFilterObj.ACIDwithPA,this.ReportFilterObj.IsSubLedger)]
                    , {
                        queryParams: {
                            mode: 'DRILL'
                        }
                    });
                break;

            default:
                break;
        }
    }

    resolveRouteUrlToDrillDown(reporttype: string, extraparam: string = null,ACIDWithPA:boolean=false,isSubLedger:string=null) {
        switch (reporttype) {
            case 'TBL':

                if (extraparam === "GROUP" && ACIDWithPA == false) {
                    this.drillParam.reportname = 'Summary Ledger Report';
                    this.drillParam.reportparam.AREA = "%";
                    this.drillParam.reportparam.CCENTER = this.ReportFilterObj.TBL_CostCenter;
                    this.drillParam.reportparam.ISPARTYGROUPLEDGER = "0";
                    this.drillParam.reportparam.PARENT = this.ReportFilterObj.ACID;
                    let summary = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Account Group Ledger Report');
                    if (summary >= 0) {
                        this.reportMainService.previouslyLoadedReportList.splice(summary, 1)
                        }
                    this.reportMainService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Account Group Ledger Report',
                        activeurlpath: '/pages/financialreports/account-ledger-reports/summaryledgerreport',
                        activerurlpath2: 'summaryledgerreport'
                    });
                    return "/pages/financialreports/account-ledger-reports/summaryledgerreport";
                  } else if (extraparam === "GROUP" && ACIDWithPA == true) {
                    this.drillParam.reportname = 'Summary Party Ledger Report';
                    this.drillParam.reportparam.AREA = "%";
                    this.drillParam.reportparam.CCENTER = this.ReportFilterObj.TBL_CostCenter;
                    this.drillParam.reportparam.ISPARTYGROUPLEDGER = "0";
                    this.drillParam.reportparam.PARENT = this.ReportFilterObj.ACID;
                    let party = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Summary Party Ledger Report');
                        if (party >= 0) {
                            this.reportMainService.previouslyLoadedReportList.splice(party, 1)
                        }
                    this.reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Summary Party Ledger Report',
                    activeurlpath: '/pages/financialreports/account-ledger-reports/summarypartyledger',
                    activerurlpath2: 'summarypartyledger'
                });
                    return "/pages/financialreports/account-ledger-reports/summarypartyledger";
                  } else if(isSubLedger == '0' && ACIDWithPA == false){
                    this.drillParam.reportname = 'Account Ledger Report';
                    this.drillParam.reportparam.IGNOREOPPOSITAC = 0;
                    this.drillParam.reportparam.MERGEREPORT = 0;
                    this.drillParam.reportparam.REPORTTYPE = 0;
                    this.drillParam.reportparam.SHOWNARATION = 0;
                    this.drillParam.reportparam.SHOWNDATE = 0;
                    this.drillParam.reportparam.COSTCENTER = this.ReportFilterObj.TBL_CostCenter;
                    let accountledger1 = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Account Ledger Report');
                    if (accountledger1 >= 0) {
                        this.reportMainService.previouslyLoadedReportList.splice(accountledger1, 1)
                    }
                    this.reportMainService.previouslyLoadedReportList.push(
              {
                  reportname: 'Account Ledger Report',
                  activeurlpath: '/pages/financialreports/account-ledger-reports/accountledgerreport',
                  activerurlpath2: 'accountledgerreport'
              });
                    return "/pages/financialreports/account-ledger-reports/accountledgerreport";
                  }else if(isSubLedger == '0' && ACIDWithPA == true){
                    this.drillParam.reportname = 'Party Ledger Report';
                    this.drillParam.reportparam.IGNOREOPPOSITAC = 0;
                    this.drillParam.reportparam.MERGEREPORT = 0;
                    this.drillParam.reportparam.REPORTTYPE = 0;
                    this.drillParam.reportparam.SHOWNARATION = 0;
                    this.drillParam.reportparam.SHOWNDATE = 0;
                    this.drillParam.reportparam.COSTCENTER = this.ReportFilterObj.TBL_CostCenter;
                    let acc = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Party Ledger Report');
                    if (acc >= 0) {
                        this.reportMainService.previouslyLoadedReportList.splice(acc, 1)
                    }
                    this.reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Party Ledger Report',
                    activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                    activerurlpath2: 'partyledgerreport'
                });
                    return "/pages/financialreports/account-ledger-reports/partyledgerreport";
                  }else if(isSubLedger == '1'){
                    this.drillParam.reportname = 'Sub Ledger Report';
                    this.drillParam.reportparam.IGNOREOPPOSITAC = 0;
                    this.drillParam.reportparam.MERGEREPORT = 0;
                    this.drillParam.reportparam.REPORTTYPE = 0;
                    this.drillParam.reportparam.SHOWNARATION = 0;
                    this.drillParam.reportparam.SHOWNDATE = 0;
                    this.drillParam.reportparam.COSTCENTER = this.ReportFilterObj.TBL_CostCenter;
                    let sub = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Sub Ledger Report');
                    if (sub >= 0) {
                        this.reportMainService.previouslyLoadedReportList.splice(sub, 1)
                    }
                    this.reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Sub Ledger Report',
                    activeurlpath: '/pages/financialreports/account-ledger-reports/sub-ledger-report',
                    activerurlpath2: 'sub-ledger-report'
                });
                    return "/pages/financialreports/account-ledger-reports/sub-ledger-report";
                  }    
                  break;
            case 'PL':
            case 'BS':

                if (extraparam === "GROUP" && ACIDWithPA == false) {
                    this.drillParam.reportname = 'Summary Ledger Report';
                    this.drillParam.reportparam.AREA = "%";
                    this.drillParam.reportparam.CCENTER = "%";
                    this.drillParam.reportparam.ISPARTYGROUPLEDGER = "0";
                    this.drillParam.reportparam.PARENT = this.ReportFilterObj.ACID;
                    let summary = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Account Group Ledger Report');
                    if (summary >= 0) {
                        this.reportMainService.previouslyLoadedReportList.splice(summary, 1)
                        }
                    this.reportMainService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Account Group Ledger Report',
                        activeurlpath: '/pages/financialreports/account-ledger-reports/summaryledgerreport',
                        activerurlpath2: 'summaryledgerreport'
                    });
                    return "/pages/financialreports/account-ledger-reports/summaryledgerreport";
                  } else if (extraparam === "GROUP" && ACIDWithPA == true) {
                    this.drillParam.reportname = 'Summary Party Ledger Report';
                    this.drillParam.reportparam.AREA = "%";
                    this.drillParam.reportparam.CCENTER = "%";
                    this.drillParam.reportparam.ISPARTYGROUPLEDGER = "0";
                    this.drillParam.reportparam.PARENT = this.ReportFilterObj.ACID;
                    let party = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Summary Party Ledger Report');
            if (party >= 0) {
                this.reportMainService.previouslyLoadedReportList.splice(party, 1)
            }
            this.reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Summary Party Ledger Report',
                    activeurlpath: '/pages/financialreports/account-ledger-reports/summarypartyledger',
                    activerurlpath2: 'summarypartyledger'
                });
                    return "/pages/financialreports/account-ledger-reports/summarypartyledger";
                  } else if(isSubLedger == '0' && ACIDWithPA == false){
                    this.drillParam.reportname = 'Account Ledger Report';
                    this.drillParam.reportparam.IGNOREOPPOSITAC = 0;
                    this.drillParam.reportparam.MERGEREPORT = 0;
                    this.drillParam.reportparam.REPORTTYPE = 0;
                    this.drillParam.reportparam.SHOWNARATION = 0;
                    this.drillParam.reportparam.SHOWNDATE = 0;
                    this.drillParam.reportparam.COSTCENTER = "%";
                    let accountledger1 = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Account Ledger Report');
                    if (accountledger1 >= 0) {
                        this.reportMainService.previouslyLoadedReportList.splice(accountledger1, 1)
                    }
                    this.reportMainService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Account Ledger Report',
                        activeurlpath: '/pages/financialreports/account-ledger-reports/accountledgerreport',
                        activerurlpath2: 'accountledgerreport'
                    });
                    return "/pages/financialreports/account-ledger-reports/accountledgerreport";
                  }else if(isSubLedger == '0' && ACIDWithPA == true){
                    this.drillParam.reportname = 'Party Ledger Report';
                    this.drillParam.reportparam.IGNOREOPPOSITAC = 0;
                    this.drillParam.reportparam.MERGEREPORT = 0;
                    this.drillParam.reportparam.REPORTTYPE = 0;
                    this.drillParam.reportparam.SHOWNARATION = 0;
                    this.drillParam.reportparam.SHOWNDATE = 0;
                    this.drillParam.reportparam.COSTCENTER = "%";
                    let acc = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Party Ledger Report');
                        if (acc >= 0) {
                            this.reportMainService.previouslyLoadedReportList.splice(acc, 1)
                    }
                    this.reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Party Ledger Report',
                    activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                    activerurlpath2: 'partyledgerreport'
                });
                    return "/pages/financialreports/account-ledger-reports/partyledgerreport";
                  }else if(isSubLedger == '1'){
                    this.drillParam.reportname = 'Sub Ledger Report';
                    this.drillParam.reportparam.IGNOREOPPOSITAC = 0;
                    this.drillParam.reportparam.MERGEREPORT = 0;
                    this.drillParam.reportparam.REPORTTYPE = 0;
                    this.drillParam.reportparam.SHOWNARATION = 0;
                    this.drillParam.reportparam.SHOWNDATE = 0;
                    this.drillParam.reportparam.COSTCENTER = "%";
                    let sub = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Sub Ledger Report');
                    if (sub >= 0) {
                        this.reportMainService.previouslyLoadedReportList.splice(sub, 1)
                    }
            this.reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Sub Ledger Report',
                    activeurlpath: '/pages/financialreports/account-ledger-reports/sub-ledger-report',
                    activerurlpath2: 'sub-ledger-report'
                });
                    return "/pages/financialreports/account-ledger-reports/sub-ledger-report";
                  }    
                  break;
                  
        }
    }







    


























    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    public stockCalculation(filterOption) {
        //console.log("filterOption.COMPANYTYPE",filterOption.COMPANYTYPE)
        filterOption.doStockEvaluation = filterOption.doStockEvaluation ? 1 : 0;
        filterOption.COMPANYTYPE = filterOption.COMPANYTYPE ? filterOption.COMPANYTYPE : 'NONDMS';

        return this.http.post(`${this.apiUrl}/stockCalculation`, filterOption, this.getRequestOption())
            .map(this.extractData)
            .catch(this.handleError)
    }


    public extractData(res: Response) {
        let response = res.json();
        return response || {};
    }

    public handleError(error: Response | any) {
        return Observable.throw(error);
    }
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }



































    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'Ledger Report': worksheet }, SheetNames: ['Ledger Report'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + new Date() + EXCEL_EXTENSION);
    }

    public exportTableToExcel(tableID, filename = '') {


        try {
            let vatno = this.masterService.userProfile.CompanyInfo.VAT?this.masterService.userProfile.CompanyInfo.VAT:this.masterService.userProfile.CompanyInfo.GSTNO;
            let companytitle = '<center><label style="font-weight:bold;font-size:14px;">' + this.masterService.userProfile.CompanyInfo.NAME + '</label></center><center><label style="font-weight:bold;font-size:13px">' + this.masterService.userProfile.CompanyInfo.ADDRESS + '</label></center><center><label style="font-weight:bold"> PAN No : <label style="letter-spacing:5px">' + vatno + '</label></label></center><br>';

            var Ht = document.getElementById(tableID).innerHTML;
            var data = companytitle +  Ht;
            var blob = new Blob([data], { type: "application/vnd.ms-excel" });
            var blobUrl = URL.createObjectURL(blob);

            var downloadLink = document.createElement("a");
            downloadLink.href = blobUrl;
            downloadLink.download = filename + ".xls";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (ex) {
            alert(ex)
        }

    }

    public print(id: string = "") {

        try {

            var header = document.getElementById('report-header').innerHTML;
            var body = document.getElementById('report-body').innerHTML;
            var footer = document.getElementById('report-footer').innerHTML;

            let popupWin;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.write(`
                    <html> <head>
                    <style>
                    .text-left{
                        text-align:left;
                    }
                    .text-right{
                        text-align:right;
                    }
                    .text-center{
                        text-align:center;
                    }
                    .table tr th {
                        text-align: center !important;
                        vertical-align: middle;
                    
                      }
                    
                      tr {
                        font-size: 12px;
                      }
                    
                      .page-header-space {
                        height: 100px;
                      }
                    
                      .text-justify {
                        text-align: justify;
                      }
                    
                      table {
                        width: 100%;
                        border-collapse: collapse;

                      }
                      th{
                          border:1px solid black
                      }
                      td{
                          border-left:1px solid black;
                          border-right:1px solid black;
                      }
                      tfoot{
                          border:1px solid black;
                      }                   
                    
                      th {
                        font-size: 12px;
                        font-weight: bold;
                      }
                    
                      .custom-td {
                        border: 1px solid #e6e6e6;
                        width: 20px;
                        text-align: center !important;
                      }
                    
                      .thead-padding {
                        padding: 10px;
                      }
                    
                      td {
                        padding: 5px !important;
                      }
                    
                      .border {
                        border-top: 1px solid #e6e6e6 !important;
                      }
                    
                      .header{
                        min-height: 62px !important
                      }
                    </style>
                    </head>
                    <body onload="window.print();window.close()">
                    <table>
                    
                    ${header}
                    ${body}
                    ${footer}
                    </table>
                    </body>
                    </html>`
            );
            popupWin.document.close();
        } catch (ex) {
            alert(ex)
        }


    }



}


export interface DrillDownParam {
    reportname: string;
    returnUrl: string;
    reportparam: drillDownReportParam;
}

export interface drillDownReportParam {
    DETAILREPORT: string;
    PHISCALID: string;
    USR: string;
    VTYPE: string;
    CCENTER: any;
    ISPARTYGROUPLEDGER: string;
    PARENT: string;
    ACCODE: string;
    ACCNAME: string;

    mode: string;
    DATE1: string,
    DATE2: string,
    DIV: string,
    COSTCENTER: string,
    AREA: string,
    COMID: string,
    REPORTTYPE: number,
    IGNOREOPPOSITAC: number,
    SHOWNDATE: number,
    ACID: string,
    MERGEREPORT: number,
    SHOWNARATION: number,
    ACNAME: string,
    SL_ACID:string,
    SL_ACNAME:string,
    CUSTOMERNAME:string;
    SHOWDPARTYDETAIL:number;
    BSDATE1: string;
    BSDATE2: string;
    DRAMNT:any;
    SUMMARYLEDGER:any;
    COMPANYID:any;
    DETAIL:any;
}