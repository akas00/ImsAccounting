import { Component, ViewChild, Input, OnInit, Output, EventEmitter, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, ActivatedRoute } from "@angular/router";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { MdDialog } from "@angular/material";
import { MasterDialogReport } from '../../../ReportDialogs/MasterDialogReport/MasterDialogReport';
import { IReport, ReportService } from '../../../DialogReport/components/reports/report.service';
import { ReportDialog } from '../../../DialogReport/components/reports/reportdialog.component';
import { EventListenerService } from '../../../../common/services/event-listener.service';
import { AuthService } from '../../../../common/services/permission';


import { AccountPayableReport } from '../../../financial-report/account-payable/account-payable.component';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { IExcelColumnFormat, ReportColumnFormat, ReportMainService } from './ReportMain.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ReportFilterService, DrillDownParam, drillDownReportParam } from '../../../../common/popupLists/report-filter/report-filter.service';
import { ContextMenuView, MenuItem } from '../../context-menu/context-menu-data';
import { isNullOrUndefined } from 'util';
import { Subject } from 'rxjs';
import { Division, TAcList, TrnMain } from '../../../../common/interfaces';
import _ from 'lodash';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';


@Component({
  selector: 'reportmain',
  templateUrl: './ReportMain.html',
  styleUrls: ["../../../modal-style.css", "../../reportStyle.css"],
})
export class ReportMain implements OnInit, OnDestroy {
  DialogMessage: string;
  @ViewChild('childModal') childModal: ModalDirective;


  // @ViewChild('accountreceivablereport') accountreceivablereport : AccountReceivableReport

  @Input('reportname') reportname: string;
  @Input() reportMaster: IReport = <IReport>{};
  @ViewChild('body') body: ElementRef
  /**
      * Context menu
      */
  contextMenuView: ContextMenuView;

  public activeurlpath: string;
  public instanceWiseRepName: string;
  private mainUrl: string = "/pages/reports/";
  private reportHeaders: any[] = [];
  public reportData: any[] = [];
  public reportDetail: any[] = [];
  public reportContextMenu: any[] = [];
  reportmasterDetail: any;
  private reportparam: any;
  dialogReport: any;
  trialUrl: boolean = false;
  public gridTabel: any;
  public userProfile: any;
  reportTitle: any;

  public keyValue: string;
  public paramValue: any[] = [];
  public param: any;
  public showReportColumnFormatPopup: boolean;
  public reportNameIs: string;
  public ReportColumnName: ReportColumnFormat[] = [];
  public reportColumnFormate: any[] = [];
  reportDisplayName: any;
  ledgerDisplayName: any;
  FromdateInAD: any;
  TodateInAD: any;
  reportmodeisZero: any;
  hideShow: boolean = false;
  isVisible: boolean = false;
  userIs: any;
  userisnull: any;
  costcenterDisplayName: any;
  labelDisplayName: any;
  accountDisplayName: any;
  entryuserDisplayName: any;
  detailreportDisplayName: any;
  showReportListDialog: boolean;
  previouslyLoadedReportsList: any[] = [];
  reportLoadedSuccess: boolean;
  subledgerlabelDisplayName: any;
  subledgerDisplayName: any;
  TDSDisplayNameDisplayName:any;
  selectedRowIndex: number;
  @ViewChild("datatable") datatable: ElementRef;
  CNDN_MODE: number;
  rowsperpage: number;
  optionalreportHeaders: any[] = [];
  userSetting: any;
  reportFooter: any[] = [];
  HighlightRow: number;
  report_Result: any;
  supplierDisplayName: any;
  voucherDisplayName: any;
  divisionDisplayName: any;

  hasDynamicColumns: string = "0";
  dynamicColumnLevel: string;
  dynamicColumnWidth: string;
  allHeaders: any[] = [];
  showReportName:any;
  hasDynamicHeaders: number = 0;
  rightcolumnnumber: string;
  leftcolumnnumber: string;
  mergereportHeaders: any[] = [];
  MergeReportHeader:any;
  ShowLineInFinalReport:any;
  reportTypeDisplay: any;
  AreawiseDisplayName:any;
  PartyGroupDisplayName:any;
  PartyCategoryDisplayName:any;
  vouchercount:any=0;
  showCellPayPaymentPopup: boolean;
  @ViewChild("genericGridACListParty") genericGridACListParty: GenericPopUpComponent;
  gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();


  constructor(
    private masterService: MasterRepo,
    private authService: AuthService,
    private router: Router,
    private arouter: ActivatedRoute,
    public dialog: MdDialog,
    private alertService: AlertService,
    public reportMainService: ReportMainService,
    public reportService: ReportFilterService,
    public spinnerService: SpinnerService,
    private _hotkeysService: HotkeysService,
    public _trnMainService: TransactionService

  ) {
    // this.rowsperpage = 100;
    this.selectedRowIndex = 0;
    this.userSetting = this.authService.getSetting();
    /**
        * Context menu
        */
    this.contextMenuView = new ContextMenuView();


    this.reportLoadedSuccess = false;
    this.activeurlpath = arouter.snapshot.url[0].path;
    this.userProfile = this.authService.getUserProfile();
    this.reportMainService.reportUrlPath = this.activeurlpath;
    // ////console.log("activeUrlPath",this.activeurlpath);
    if (this.activeurlpath == 'debtorsreport') {
      this.instanceWiseRepName = 'Debtors Report0';
    } else if (this.activeurlpath == 'summaryledgerreport') {
      this.instanceWiseRepName = 'Summary Ledger Report0';
    } else if (this.activeurlpath == 'accountledgerreport') {
      this.instanceWiseRepName = 'Account Ledger Report0';
    } else if (this.activeurlpath == 'creditorsreport') {
      this.instanceWiseRepName = 'Creditors Report0';
    } else if (this.activeurlpath == 'summarypartyledger') {
      this.instanceWiseRepName = 'Summary Party Ledger Report0';
    } else if (this.activeurlpath == 'partyledgerreport') {
      this.instanceWiseRepName = 'Party Ledger Report0';
    } else if (this.activeurlpath == 'sub-ledger-report-acbase') {
      this.instanceWiseRepName = 'Sub Ledger Report ACBASE0';
    } else if (this.activeurlpath == 'sub-ledger-report') {
      this.instanceWiseRepName = 'Sub Ledger Report0';
    } else if (this.activeurlpath == 'debtorsagingreport') {
      this.instanceWiseRepName = 'Debtors Ageing Report0';
    } else if (this.activeurlpath == 'creditorsagingreport') {
      this.instanceWiseRepName = 'Creditors Ageing Report0';
    } else if (this.activeurlpath == 'debtorsoutstandingreport') {
      this.instanceWiseRepName = 'Debtors Outstanding Report0';
    } else if (this.activeurlpath == 'creditorsoutstandingreport') {
      this.instanceWiseRepName = 'Creditors Outstanding Report0';
    } else if (this.activeurlpath == 'voucher-regeister-report') {
      this.instanceWiseRepName = 'Voucher Register Report0';
    } else if (this.activeurlpath == 'cash-bank-book-report') {
      this.instanceWiseRepName = 'Cash/Bank Book Report0';
    } else if (this.activeurlpath == 'day-book-report') {
      this.instanceWiseRepName = 'Day Book Report0';
    } else if (this.activeurlpath == 'trial-balance-report') {
      this.instanceWiseRepName = 'Trial Balance Report0';
    } else if (this.activeurlpath == 'additionalcost-itemwise-report') {
      this.instanceWiseRepName = 'Additional Cost Itemwise Report0';
    } else if (this.activeurlpath == 'additionalcost-voucherwise-report') {
      this.instanceWiseRepName = 'Additional Cost Voucherwise Report0';
    }else if (this.activeurlpath == 'salesreturnsummary-report') {
      this.instanceWiseRepName = 'Sales Return Summary Report0';
    } else if (this.activeurlpath == 'salesreturnsummaryretailer-report') {
      this.instanceWiseRepName = 'Sales Return Summary Retailer Report0';
    }else if (this.activeurlpath == 'salesreturn-reportdetail') {
      this.instanceWiseRepName = 'Sales Return Report Detail0';
    } else if (this.activeurlpath == 'stocksummary-reportdms') {
      this.instanceWiseRepName = 'Sales Summary Retailer Report0';
    } else if (this.activeurlpath == 'currentstock-warehousewise-reportdms') {
      this.instanceWiseRepName = 'Stock Report - Warehouse Wise0';
    } else if (this.activeurlpath == 'stockabc-analysis-reportdms') {
      this.instanceWiseRepName = 'Stock Abc Analysis Report0)';
    }else if (this.activeurlpath == 'stocksummary-reportdms') {
      this.instanceWiseRepName = 'Stock Summary Report0)';
    }else if (this.activeurlpath == 'stockvaluation-reportdms') {
      this.instanceWiseRepName = 'Stock Valuation Report0)';
    }else if (this.activeurlpath == 'stockledger-reportdms') {
      this.instanceWiseRepName = 'Stock Ledger Report0)';
    }else if (this.activeurlpath == 'consolidated-trialbalance-report') {
      this.instanceWiseRepName = 'Consolidated Trial Balance Report0';
    }else if (this.activeurlpath == 'profit-loss-report') {
      this.instanceWiseRepName = 'Profit Loss Report0';
    }else if (this.activeurlpath == 'balance-sheet-report') {
      this.instanceWiseRepName = 'Balance Sheet Report0';
    }else if (this.activeurlpath == 'tds-report') {
      this.instanceWiseRepName = 'TDS Report0';
    }else if (this.activeurlpath == 'consolidated-balance-sheet-report') {
      this.instanceWiseRepName = 'Consolidated Balance Sheet Report0';
    }else if (this.activeurlpath == 'consolidated-profit-loss-report') {
      this.instanceWiseRepName = 'Consolidated Profit and Loss Report0';
    }

    let existingDataFromReportDataStore = this.reportMainService.reportDataStore[this.instanceWiseRepName];
    this.arouter.queryParams.subscribe(params => {
      const mode = params.mode;
      if (mode == "DRILL" && this.reportService.drillParam.returnUrl) {
        setTimeout(() => {
          this.loadReport(this.reportService.drillParam);
          this.reportparam = this.reportService.drillParam.reportparam;
          this.reportname = this.reportService.drillParam.reportname;
          if (!this.rowsperpage) {
            this.rowsperpage = 100;
          }
          this.ReportCriteriaDisplay(this.reportService.drillParam.reportparam, this.reportService.drillParam.reportname, this.reportService.drillParam.reportname);
        });
      } else {
        if (existingDataFromReportDataStore != null && existingDataFromReportDataStore != undefined) {
          this.reportHeaders = existingDataFromReportDataStore.data.result.headers;
          this.allHeaders = existingDataFromReportDataStore.data.result.allHeaders;
          this.prepareOptionalHeader(this.reportHeaders);

          for (var i of this.reportHeaders) {

            if (i.size == null || i.size == 0) { i.width = 'auto'; }
            else { i.width = i.size + 'px'; }
          }
          
          this.loadReportDataFromExistingStore();
          this.ReportCriteriaDisplay(this.reportparam, this.reportname,this.showReportName);

          if(this.hasDynamicHeaders == 1){

            this.prepareOptionalDynamicHeader(this.allHeaders);
          }

          if(this.hasDynamicHeaders !=1 && this.MergeReportHeader!=0){
            this.preparereportHeader(this.reportHeaders);
          }else if(this.hasDynamicHeaders !=1 && this.MergeReportHeader!=1){
            this.mergereportHeaders=this.reportHeaders;
          }else{
          let sortedArray = _.sortBy(this.reportHeaders, 'colPosition'); 
          this.mergereportHeaders=sortedArray;
          }
          this.reportMainService.getReportColumnFormate(this.reportname)
            .subscribe(
              (res) => {
                if (res.status == "ok") {
                  this.reportColumnFormate = res.result;
                  this.rowsperpage = res.result ? res.result[0].rowsperpage : '100';
                } else {
                  this.reportColumnFormate = [];
                }
              }
            )
          if (this.reportColumnFormate.length == 0) {
            this.ReportColumnName = this.reportHeaders.map(
              x => {
                return <ReportColumnFormat>{
                  ReportName: this.reportname,
                  ColumnName: x.colHeader,
                  MappingName: x.mappingName,
                  Show: x.Visible,
                  ColWidth: x.size,
                  Format: x.stringFormat,
                  Align: x.alignment,
                  ColumnPosition: x.colPosition,
                  ColGroup: x.ColGroup,
                  GroupSummary: x.groupSummaryFunction,
                  GSFunction: x.groupSummaryFunction,
                  TableSummary: x.showTables,
                  TSFunction: x.tableSummaryFunction,
                  ReportTitle: this.reportTitle,
                  rowsperpage: this.rowsperpage
                };
              }
            );

            this.ReportColumnName.forEach((x, z) => { x.Show = 1, x.TableSummary = 0, x.GroupSummary = 0, x.ColumnPosition = z + 1 });

          } else {
            this.ReportColumnName = this.reportColumnFormate.map(
              x => {
                return <ReportColumnFormat>{
                  ReportName: this.reportname,
                  ColumnName: x.ColumnName,
                  MappingName: x.MappingName,
                  Show: x.Show,
                  ColWidth: x.ColWidth,
                  Format: x.Format,
                  Align: x.Align,
                  ColumnPosition: x.ColumnPosition,
                  ColGroup: x.ColGroup,
                  GroupSummary: x.GroupSummary,
                  GSFunction: x.GSFunction,
                  TableSummary: x.TableSummary,
                  TSFunction: x.TSFunction,
                  ReportTitle: this.reportTitle,
                  rowsperpage: x.rowsperpage
                };
              }
            );
          }
        } else {
          // ////console.log("@@here?1",params.instancename)
          if (!params.instancename) {
            this.fiterClickEvent();
          }
        }

      }
    });

    this.previouslyLoadedReportsList = this.reportMainService.previouslyLoadedReportList;

    this._hotkeysService.add(new Hotkey('shift+tab', (event: KeyboardEvent): boolean => {
      this.showPreviouslyLoadedReports();
      return false;
    }));

    this._hotkeysService.add(new Hotkey('shift+p', (event: KeyboardEvent): boolean => {
      this.printExcelFormat();
      return false;
    }));
  }

  ngOnInit() {

    if (this.activeurlpath == 'trialbalance') {
      return this.trialUrl = true;
    }


    this._hotkeysService.add(
      new Hotkey(
        "f10",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          this.hideShow = !this.hideShow;
          this.isVisible = !this.isVisible;
          return false;
        }
      )
    );


  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }





  storeAndUpdateReportDataStore(reportParam: any, reportData: any) {
    // ////console.log("repData",this.instanceWiseRepName);
    this.reportMainService.reportDataStore[this.instanceWiseRepName] = {
      param: reportParam,
      data: reportData
    }
    // ////console.log("daa",this.reportMainService.reportDataStore);
  }




  loadReport(reportData) {
    this.DialogMessage = "Report Loading Please Wait...";
    this.childModal.show();
    let agingLimit =  this.masterService.userProfile.userRights.find(x => x.right =='StockAgeingLimit').value;    
    reportData.AgeLimit=agingLimit;
    this.masterService.getReportData(reportData, "/loadReports").subscribe(data => {
      let reportresult = <any>data;
      this.report_Result = reportresult;
      if (reportresult.status == "ok") {
        this.storeAndUpdateReportDataStore(reportData, reportresult);

        this.reportHeaders = reportresult.result.headers;

        this.reportMainService.reportLoadSubject.next();
        this.reportMainService.assignPrevioiusDate = true;

        for (var i of this.reportHeaders) {

          if (i.size == null || i.size == 0) { i.width = 'auto'; }
          else { i.width = i.size + 'px'; }
        }
        this.prepareOptionalHeader(this.reportHeaders);
       
        this.reportData = reportresult.result.data;
        this.reportDetail = reportresult.result.repDetails;
        this.reportmasterDetail = reportresult.result.reportmasterDetail;
        this.reportContextMenu = reportresult.result.reportContextMenu;
        this.reportFooter = reportresult.result.totalRowData;

        this.allHeaders = reportresult.result.allHeaders;
        this.hasDynamicColumns = this.reportmasterDetail.HASDYNAMICCOLUMNS;
        this.dynamicColumnLevel = this.reportmasterDetail.DYNAMICCOLUMNSLEVEL;
        this.dynamicColumnWidth = this.reportmasterDetail.DYNAMICCOLUMNWIDTH;
        this.hasDynamicHeaders = this.reportmasterDetail.DYNAMICHEADER;
        this.leftcolumnnumber = this.reportmasterDetail.LEFTCOLUMNNUMBER;
        this.rightcolumnnumber = this.reportmasterDetail.RIGHTCOLUMNNUMBER;
        this.MergeReportHeader = this.reportmasterDetail.MERGEREPORTHEADER;
        this.ShowLineInFinalReport = this.reportmasterDetail.SHOWLINEINFINALREPORT;

        if(this.hasDynamicHeaders !=1 && this.MergeReportHeader!=0){
          this.preparereportHeader(this.reportHeaders);
        }else if(this.hasDynamicHeaders !=1 && this.MergeReportHeader!=1){
          this.mergereportHeaders=this.reportHeaders;
        }


        if (this.reportColumnFormate.length == 0) {
          this.ReportColumnName = this.reportHeaders.map(
            x => {
              return <ReportColumnFormat>{
                ReportName: this.reportname,
                ColumnName: x.colHeader,
                MappingName: x.mappingName,
                Show: x.Visible,
                ColWidth: x.size,
                Format: x.stringFormat,
                Align: x.alignment,
                ColumnPosition: x.colPosition,
                ColGroup: x.ColGroup,
                GroupSummary: x.groupSummaryFunction,
                GSFunction: x.groupSummaryFunction,
                TableSummary: x.showTables,
                TSFunction: x.tableSummaryFunction,
                ReportTitle: this.reportTitle,
                rowsperpage: this.rowsperpage
              };
            }
          );

          this.ReportColumnName.forEach((x, z) => { x.Show = 1, x.TableSummary = 0, x.GroupSummary = 0, x.ColumnPosition = z + 1 });

        } else {
          // ////console.log("reportformat", this.reportColumnFormate)
          this.ReportColumnName = this.reportColumnFormate.map(
            x => {
              return <ReportColumnFormat>{
                ReportName: this.reportname,
                ColumnName: x.ColumnName,
                MappingName: x.MappingName,
                Show: x.Show,
                ColWidth: x.ColWidth,
                Format: x.Format,
                Align: x.Align,
                ColumnPosition: x.ColumnPosition,
                ColGroup: x.ColGroup,
                GroupSummary: x.GroupSummary,
                GSFunction: x.GSFunction,
                TableSummary: x.TableSummary,
                TSFunction: x.TSFunction,
                ReportTitle: this.reportTitle,
                rowsperpage: x.rowsperpage
              };
            }
          );
          // ////console.log("reportformat", this.ReportColumnName)

        }


        if (this.reportmasterDetail.HASDYNAMICCOLUMNS) {
          let dynamicOptionalHeader='Default';
          this.allHeaders.forEach((x, index) => {
            if(this.reportmasterDetail.DYNAMICHEADER == 1 && x.mappingName.includes("~")){
              let abc = x.mappingName.split('~');
              dynamicOptionalHeader = abc[1];
              }else{
              dynamicOptionalHeader='Default';
              }
            if (index + 1 >= this.reportmasterDetail.DYNAMICCOLUMNSLEVEL) {
              this.reportHeaders.push(<any>{
                alignment: 1,
                allowMerge: false,
                colHeader:  dynamicOptionalHeader == 'Default' ? x.colHeader : dynamicOptionalHeader,
                colNo: 0,
                colPosition: dynamicOptionalHeader == 'Default' ? index+5000 : index+1,
                mappingName: x.mappingName,
                showGroupSummary: false,
                showTableSummary: false,
                size: Number(this.reportmasterDetail.DYNAMICCOLUMNWIDTH),
                width: Number(this.reportmasterDetail.DYNAMICCOLUMNWIDTH) + "px",
                visible: 1,
              })
            }
          })
          let sortedArray = _.sortBy(this.reportHeaders, 'colPosition'); 
          // this.reportHeaders=sortedArray;
          this.mergereportHeaders=sortedArray;
          if(this.reportmasterDetail.DYNAMICHEADER == 1){
            this.prepareOptionalDynamicHeader(this.allHeaders);
          }

        }



        this.DialogMessage = "Report Loaded successfully.";
        this.reportLoadedSuccess = true;
        setTimeout(() => {
          this.childModal.hide();
        }, 2000)
      }
      else {
        this.DialogMessage = reportresult.result;
        this.childModal.show();
        setTimeout(() => {
          this.childModal.hide();
        }, 3000)
      }
    }, Error => {
      // ////console.log("error", Error);
      this.DialogMessage = Error;
      setTimeout(() => {
        this.childModal.hide();
      }, 3000)
    });
  }


  // reportDialogChooser(url)
  // {

  //   switch (url) {
  //     case this.mainUrl+"dailysalessummary":
  //         this.dialogReport=MasterDialogReport;
  //         break;
  //     default:
  //     this.dialogReport="nofound";
  //     break;
  // }
  // }


  fiterClickEvent() {
    let dialogRef = this.dialog.open(MasterDialogReport, { hasBackdrop: true, data: { activeurlpath: this.activeurlpath, instanceWiseRepName: this.instanceWiseRepName, reportparam: this.reportparam, reportname: this.reportname } });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status == 'ok') {

          this.reportname = result.data.reportname
          this.reportparam = result.data.reportparam;
          this.showReportName = result.data.REPORTDISPLAYNAME?result.data.REPORTDISPLAYNAME:result.data.reportname;

          this.instanceWiseRepName = result.data.instanceWiseRepName;
          this.loadReport(result.data);

          // ////console.log("reportData",result.data);

          this.reportMainService.SelectedAccount = '';
          //For Displaying Name according to the Reports
          this.ReportCriteriaDisplay(this.reportparam, this.reportname, this.showReportName);


          this.reportMainService.getReportColumnFormate(this.reportname)
            .subscribe(
              (res) => {
                if (res.status == "ok") {
                  this.reportColumnFormate = res.result;
                  // ////console.log("reportcolumnformat", this.reportColumnFormate);
                  this.rowsperpage = res.result ? res.result[0].rowsperpage : '100';
                } else {
                  this.reportColumnFormate = [];
                }
              }
            )

          this.previouslyLoadedReportsList = this.reportMainService.previouslyLoadedReportList;
          // ////console.log("@@previouslyLoadedReportsList3",this.previouslyLoadedReportsList)
        }
      }
      dialogRef = null;
    });

  }
  getFormattedValue(value) {
    if (value != null) {
      if (typeof value === 'number') { return value.toLocaleString('en-us', { minimumFractionDigits: 2 }) }

      else if (new Date(value).toString() != 'Invalid Date') {
        return new Date(value).toJSON().split('T')[0];
      }
    }
    return value;

  }


  SettingClickEvent() {

  }


  ExportReportInExcel(extension) {
    // this.excelDownloadFromHtml_manualTable();
    this.downloadReportPrepareFromAPI(extension);

  }


  excelDownloadFromHtml_manualTable() {
    try {
      let header = '<p style=" text-align:center;font-weight:bold;font-size:16px;">' + this.activeurlpath.toUpperCase() + '</p><p style=" text-align:center;font-weight:bold;font-size:14px;">' + this.userProfile.CompanyInfo.NAME + '</p><p style=" text-align:center;font-weight:bold;font-size:13px">' + this.userProfile.CompanyInfo.ADDRESS + '</p><p style=" text-align:center;font-weight:bold"> PAN No : <label style="letter-spacing:5px">' + this.userProfile.CompanyInfo.VAT + '</label></p>';
      if(this.reportname == 'Party Ledger Report' || this.reportname == 'Party Ledger Report_1'|| this.reportname == 'Party Ledger Report_2'){
        this.param = '<p style="text-align:right;font-size:14px;">' + 'From Date :'+ this.reportparam.DATE1 + '</p><p style=" text-align:right;font-size:14px;">' + 'To Date :'+ this.reportparam.DATE2 + '</p><p style=" text-align:left;font-size:16px;">' + 'CUSTOMER :'+ this.reportparam.ACNAME + '</p><p style=" text-align:left;font-size:14px;">' + 'PAN No :'+ this.reportparam.VATNO + '</p><p style=" text-align:left;font-size:14px;">' + 'Address :'+ this.reportparam.ADDRESS + '</p><p style=" text-align:left;font-size:14px;">' + 'Contact Number :'+ this.reportparam.PHONE + '</p><p style=" text-align:left;font-size:14px;">' + 'Email :'+ this.reportparam.EMAIL + '</p>';
      }else{
      this.param = '<label style=" text-align:center;font-weight:bold;font-size:12px;">' + this.getReportParamForPreviewKey(this.reportparam, this.reportDetail) + '</label>'+'<label></label>';
      }


      let table = '<table style="border:thin solid black;">  <thead>   <tr>';

      for (let column1 of this.reportHeaders) {
        table += '<th style="border:thin solid black;">' + column1.colHeader + '</th>';
      };
      table += '</tr> </thead>';
      table += '<tbody>';

      for (let row of this.reportData) {
        table += '<tr>';
        for (let column1 of this.reportHeaders) {
          var v = row[column1.mappingName];
          if (v == null) v = "";
          table += '<td style="border:thin solid black;">' + v + '</td>';
        };

        '</tr>';
      };
      for (let row of this.reportFooter) {
        table += '<tr>';
        for (let column1 of this.reportHeaders) {
          var v = row[column1.mappingName];
          if (v == null) v = "";
          table += '<td style="border:thin solid black;">' + v + '</td>';
        };

        '</tr>';
      };
      table += '</tbody></table>';
      // var Ht = header + param + table;
      var Ht = header + this.param + table;

      var blob = new Blob([Ht], { type: "application/vnd.ms-excel" });
      var blobUrl = URL.createObjectURL(blob);

      var downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = this.excelReportNameProvide() + ".xls";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (ex) { alert(ex) };
  }

  repName() {
    var reName
  }


  excelReportNameProvide(): string {
    var excelReportName = this.activeurlpath;
    return excelReportName;
  }

  excelNameChooser() {
    try {
      // if(this.reportname=="CUSTOMERVSITEMWISESALES"){
      //     return "CUSTOMER_VS_ITEM_WISE_SALES_REPORT ("+ this.masterService.customerList.find(x=>x.ACID== this.reportMaster.reportQuery.find(x=>x.param=="CUSTOMER").value).ACNAME+")";}
      if (this.reportname == "DEBITORSREPORT") {
        return "DEBTORS REPORT ( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "DEBITORSREPORTEXD") {
        return "DEBTORS REPORT EXTENDED( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "SALESBOOKREPORT") {
        return "SALES REPORT ( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "STOCKREPORT") {
        return "STOCK REPORT ( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "STOCKREPORTEXD") {
        return "STOCK REPORT EXTENDED( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "DEBITORSREPORT_AGING") {
        return "DEBTORS AGEING REPORT ( As On Dated: " + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "DEBITORSREPORT_AGINGEXD") {
        return "DEBTORS AGEING REPORT EXTENDED( As On Dated: " + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "DEBITORSREPORT_AGINGEXD") {
        return "DEBTORS AGEING REPORT EXTENDED( As On Dated: " + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }

      if (this.reportname == "STOCKLEDGERREPORT") {
        let CC = this.masterService._itemList.find(x => x.MCODE == this.reportMaster.reportQuery.find(x => x.param == "MCODE").value);
        if (CC != null) {
          return "STOCK LEDGER REPRT ( " + CC.MENUCODE + "  " + CC.DESCA + " )";
        }
      }
      return this.reportMaster.title;
    } catch (ex) { return this.reportMaster.title; }
  }



  getReportParamForPreviewKey(param: any, reportdetails: any[]) {
    let key = Object.keys(param);
    var allValue = "";
    for (let i in key) {

      var label = key[i];
      let paramDetails = reportdetails.filter(x => x.PROPNAME == key[i])[0];
      if (paramDetails != null) {
        if (paramDetails.PRINTLABEL != null && paramDetails.PRINTLABEL != "") {
          label = paramDetails.PRINTLABEL;
        }
      }

      var value = param[key[i]];
      // //console.log("@@label",label)
      if(label == 'DATE1' || label == 'DATE2'){
        allValue += label + ":" + value + " , ";
      }

    }
    return allValue;

  }


  getReportParamForPreview(reportparam,reportdetails){
    let key = Object.keys(reportparam);
    let pp="(";
    for (let i in key) {
      var label = key[i];
      let paramDetails = reportdetails.filter(x => x.PROPNAME == key[i])[0];
      if (paramDetails != null) {
        if (paramDetails.PRINTLABEL != null && paramDetails.PRINTLABEL != "") {
          label = paramDetails.PRINTLABEL;
        }
      }

      var value = reportparam[key[i]];
      if (label.toUpperCase() == "LEDGERDISPLAYNAME") {
        if (value != '') {
          pp += " @Ledger : " + value + " ";
        }
      } else if (label.toUpperCase() == "ACCOUNTGROUPDISPLAYNAME") {
        if (value != '') {
          pp += " @Account Group : " + value + " ";
        }
      } else if (label.toUpperCase() == "PARTYGROUPDISPLAYNAME") {
        if (value != '') {
          pp += " @Party Group : " + value + " ";
        }
      } else if (label.toUpperCase() == "REPORTOPTIONDISPLAYNAME") {
        if (value != '') {
          pp +=" "+value+ " ";
        }
      }
      else if (label.toUpperCase() == "MAINLEDGERDISPLAYNAME") {
        if (value != '') {
          pp += "@Main Ledger : " + value + " ";
        }
      } else if (label.toUpperCase() == "SUBLEDGERDISPLAYNAME") {
        if (value != '') {
          pp += "@Sub Ledger : " + value + " ";
        }
      } else if (label.toUpperCase() == "VTYPEDISPLAYNAME") {
        if (value != '') {
          pp += "@Voucher Name : " + value + " ";
        }
      } else if (label.toUpperCase() == "DATE1") {
        pp += " @As On Dated : " + value + " ";
      } else if (label.toUpperCase() == "DATE2") {
        pp += " To : " + value + " ";
      } else if (label.toUpperCase() == "BSDATE1") {
        pp += " ( " + value + " ";
      } else if (label.toUpperCase() == "BSDATE2") {
        pp += " - " + value + " ) ";
      } else if (label.toUpperCase() == "DATE") {
        pp += " @As On Dated  : " + value + " ";
      } else if (label.toUpperCase() == "BSDATE") {
        pp += " Miti : " + value + " )";
      } else if (label.toUpperCase() == "DIVISIONNAME") {
        if (value != '') {
          pp += " @Division : " + value + "";
        }
      } else if (label.toUpperCase() == "COSTCENTERDISPLAYNAME") {
        if (value != '') {
          pp += " @Costcenter : " + value + " ";
        }
      } else if (label.toUpperCase() == "FROM_VNO") {
        if (value != '') {
          pp += " @Voucher Range From : " + value + " ";
        }
      } else if (label.toUpperCase() == "To_VNO") {
        if (value != '') {
          pp += " To : " + value + " ";
        }
      } else if (label.toUpperCase() == "SUMMARYREPORTDISPLAYNAME") {
        if (value != '') {
          pp += " " + value + " ";
        }
      }
      else if (label.toUpperCase() == "SUPPLIERDISPLAYNAME") {
        if (value != '') {
          pp += " " + value + " ";
        }
      }
    }
  pp=pp.substring(0, pp.length - 1);
  pp+=")";
return pp;
}

  SaveInReportColumnFormat() {
    this.showReportColumnFormatPopup = true;
  }

  CancelCommand() {
    this.showReportColumnFormatPopup = false;
  }

  OkCommand() {
    this.showReportColumnFormatPopup = false;

    this.ReportColumnName.forEach(x => { x.ReportTitle = this.reportTitle, x.rowsperpage = this.rowsperpage });
    this.masterService.masterPostmethod("/updateReportMaster", { REPORTNAME: this.reportname, hasDynamicColumns: this.hasDynamicColumns,
       dynamicColumnLevel: this.dynamicColumnLevel, dynamicColumnWidth: this.dynamicColumnWidth, hasDynamicHeaders: this.hasDynamicHeaders,
        leftcolumnnumber: this.leftcolumnnumber, rightcolumnnumber: this.rightcolumnnumber, MergeReportHeader: this.MergeReportHeader,
         ShowLineInFinalReport: this.ShowLineInFinalReport }).subscribe((res) => {

    })
    this.spinnerService.show("Data is saving ....");
    this.reportMainService.saveReportColumnFormat(this.ReportColumnName, '/saveReportColumnFormat')
      .subscribe(
        (res) => {
          if (res.status == "ok") {
            // this.loadingService.hide();
            this.spinnerService.hide();
            this.alertService.info('Report format is successfully saved');
            this.reportColumnFormate = [];
          } else {
            this.spinnerService.hide();
          }
        },
        error => {
          this.spinnerService.hide();
        }
      )
  }

  changeDate(DATE1, DATE2, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate1 = (DATE1.replace("-", "/")).replace("-", "/");
      var bsDate1 = adbs.ad2bs(adDate1);
      var adDate2 = (DATE2.replace("-", "/")).replace("-", "/");
      var bsDate2 = adbs.ad2bs(adDate2);
      this.FromdateInAD = bsDate1.en.year + '-' + bsDate1.en.month + '-' + (bsDate1.en.day == '1' || bsDate1.en.day == '2' || bsDate1.en.day == '3' || bsDate1.en.day == '4' || bsDate1.en.day == '5' || bsDate1.en.day == '6' || bsDate1.en.day == '7' || bsDate1.en.day == '8' || bsDate1.en.day == '9' ? '0' + bsDate1.en.day : bsDate1.en.day);
      this.TodateInAD = bsDate2.en.year + '-' + bsDate2.en.month + '-' + (bsDate2.en.day == '1' || bsDate2.en.day == '2' || bsDate2.en.day == '3' || bsDate2.en.day == '4' || bsDate2.en.day == '5' || bsDate2.en.day == '6' || bsDate2.en.day == '7' || bsDate2.en.day == '8' || bsDate2.en.day == '9' ? '0' + bsDate2.en.day : bsDate2.en.day);
    }
  }
  @ViewChild('reportnameinlist') reportnameinlist: ElementRef;

  showPreviouslyLoadedReports() {
    this.showReportListDialog = true;
    // setTimeout(() => {
    //   this.reportnameinlist.nativeElement.focus();
    // }, 10);
  }

  CancelReportList() {
    this.showReportListDialog = false;
  }

  closeReport() {
    // ////console.log("@@activeurlpath",this.activeurlpath)
    // this.reportHeaders = [];
    // this.reportData = [];
    // this.reportparam = [];
    if (this.activeurlpath == 'summaryledgerreport') {
      if (this.reportMainService.loadedTimes > 0) {
        this.reportMainService.loadedTimes = this.reportMainService.loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'accountledgerreport') {
      if (this.reportMainService.AccLedger_loadedTimes > 0) {
        this.reportMainService.AccLedger_loadedTimes = this.reportMainService.AccLedger_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'summarypartyledger') {
      if (this.reportMainService.SummaryParty_loadedTimes > 0) {
        this.reportMainService.SummaryParty_loadedTimes = this.reportMainService.SummaryParty_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'partyledgerreport') {
      if (this.reportMainService.PartyLedger_loadedTimes > 0) {
        this.reportMainService.PartyLedger_loadedTimes = this.reportMainService.PartyLedger_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'sub-ledger-report') {
      if (this.reportMainService.SubLedger_loadedTimes > 0) {
        this.reportMainService.SubLedger_loadedTimes = this.reportMainService.SubLedger_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'debtorsreport') {
      if (this.reportMainService.loadedTimesD > 0) {
        this.reportMainService.loadedTimesD = this.reportMainService.loadedTimesD - 1;
      }
    } else if (this.activeurlpath == 'creditorsreport') {
      if (this.reportMainService.Creditors_loadedTimes > 0) {
        this.reportMainService.Creditors_loadedTimes = this.reportMainService.Creditors_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'debtorsagingreport') {
      if (this.reportMainService.DebtorsAgeing_loadedTimes > 0) {
        this.reportMainService.DebtorsAgeing_loadedTimes = this.reportMainService.DebtorsAgeing_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'creditorsagingreport') {
      if (this.reportMainService.CreditorsAgeing_loadedTimes > 0) {
        this.reportMainService.CreditorsAgeing_loadedTimes = this.reportMainService.CreditorsAgeing_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'voucher-regeister-report') {
      if (this.reportMainService.VoucherReg_loadedTimes > 0) {
        this.reportMainService.VoucherReg_loadedTimes = this.reportMainService.VoucherReg_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'cash-bank-book-report') {
      if (this.reportMainService.CashBank_loadedTimes > 0) {
        this.reportMainService.CashBank_loadedTimes = this.reportMainService.CashBank_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'day-book-report') {
      if (this.reportMainService.DayBook_loadedTimes > 0) {
        this.reportMainService.DayBook_loadedTimes = this.reportMainService.DayBook_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'debtorsoutstandingreport') {
      if (this.reportMainService.DebtorsOuts_loadedTimes > 0) {
        this.reportMainService.DebtorsOuts_loadedTimes = this.reportMainService.DebtorsOuts_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'creditorsoutstandingreport') {
      if (this.reportMainService.CreditorsOuts_loadedTimes > 0) {
        this.reportMainService.CreditorsOuts_loadedTimes = this.reportMainService.CreditorsOuts_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'sub-ledger-report-acbase') {
      if (this.reportMainService.SubLedgerAcbase_loadedTimes > 0) {
        this.reportMainService.SubLedgerAcbase_loadedTimes = this.reportMainService.SubLedgerAcbase_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'trial-balance-report') {
      if (this.reportMainService.TrialBalance_loadedTimes > 0) {
        this.reportMainService.TrialBalance_loadedTimes = this.reportMainService.TrialBalance_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'additionalcost-itemwise-report') {
      if (this.reportMainService.AdditionalCostDetail_loadedTimes > 0) {
        this.reportMainService.AdditionalCostDetail_loadedTimes = this.reportMainService.AdditionalCostDetail_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'additionalcost-voucherwise-report') {
      if (this.reportMainService.AdditionalCostSummary_loadedTimes > 0) {
        this.reportMainService.AdditionalCostSummary_loadedTimes = this.reportMainService.AdditionalCostSummary_loadedTimes - 1;
    }
   } else if (this.activeurlpath == 'salesreturnsummary-report') {
      if (this.reportMainService.SalesReturnSummary_loadedTimes > 0) {
          this.reportMainService.SalesReturnSummary_loadedTimes = this.reportMainService.SalesReturnSummary_loadedTimes - 1;
    }
   } else if (this.activeurlpath == 'salesreturnsummaryretailer-report') {
      if (this.reportMainService.SalesReturnSummaryRetailer_loadedTimes > 0) {
            this.reportMainService.SalesReturnSummaryRetailer_loadedTimes = this.reportMainService.SalesReturnSummaryRetailer_loadedTimes - 1;
    }
    }else if (this.activeurlpath == 'salesreturn-reportdetail') {
      if (this.reportMainService.SalesReturnReportDetail_loadedTimes > 0) {
            this.reportMainService.SalesReturnReportDetail_loadedTimes = this.reportMainService.SalesReturnReportDetail_loadedTimes - 1;
    }
    }else if (this.activeurlpath == 'stocksummary-reportdms') {
      if (this.reportMainService.StockSummaryAccount_loadedTimes > 0) {
        this.reportMainService.StockSummaryAccount_loadedTimes = this.reportMainService.StockSummaryAccount_loadedTimes - 1;
    }
    }else if (this.activeurlpath == 'currentstock-warehousewise-reportdms') {
        if (this.reportMainService.CurrentStockWarehouseWiseAccount_loadedTimes > 0) {
          this.reportMainService.CurrentStockWarehouseWiseAccount_loadedTimes = this.reportMainService.CurrentStockWarehouseWiseAccount_loadedTimes - 1;
    }
    }else if (this.activeurlpath == 'stockabc-analysis-reportdms') {
      if (this.reportMainService.StockAbcAnalysisAccount_loadedTimes > 0) {
        this.reportMainService.StockAbcAnalysisAccount_loadedTimes = this.reportMainService.StockAbcAnalysisAccount_loadedTimes - 1;
    }
    }else if (this.activeurlpath == 'consolidated-trialbalance-report') {
      if (this.reportMainService.consolidated_TrialBalance_loadedTimes > 0) {
        this.reportMainService.consolidated_TrialBalance_loadedTimes = this.reportMainService.consolidated_TrialBalance_loadedTimes - 1;
    }
    } else if (this.activeurlpath == 'profit-loss-report') {
      if (this.reportMainService.ProfitLoss_loadedTimes > 0) {
        this.reportMainService.ProfitLoss_loadedTimes = this.reportMainService.ProfitLoss_loadedTimes - 1;
      }
    } else if (this.activeurlpath == 'balance-sheet-report') {
      if (this.reportMainService.BalanceSheet_loadedTimes > 0) {
        this.reportMainService.BalanceSheet_loadedTimes = this.reportMainService.BalanceSheet_loadedTimes - 1;
    }
  }else if (this.activeurlpath == 'tds-report') {
      if (this.reportMainService.TDS_loadedTimes > 0) {
        this.reportMainService.TDS_loadedTimes = this.reportMainService.TDS_loadedTimes - 1;
      }
    }else if (this.activeurlpath == 'consolidated-balance-sheet-report') {
      if (this.reportMainService.Consolidated_BalanceSheet_loadedTimes > 0) {
        this.reportMainService.Consolidated_BalanceSheet_loadedTimes = this.reportMainService.Consolidated_BalanceSheet_loadedTimes - 1;
    }
  }else if (this.activeurlpath == 'consolidated-profit-loss-report') {
    if (this.reportMainService.Consolidated_ProfitLoss_loadedTimes > 0) {
      this.reportMainService.Consolidated_ProfitLoss_loadedTimes = this.reportMainService.Consolidated_ProfitLoss_loadedTimes - 1;
  }
}else if (this.activeurlpath == 'bill-tracking-report') {
  if (this.reportMainService.BillTracking_loadedTimes > 0) {
    this.reportMainService.BillTracking_loadedTimes = this.reportMainService.BillTracking_loadedTimes - 1;
}
}else if (this.activeurlpath == 'creditorsbill-tracking-report') {
  if (this.reportMainService.CreditorsBillTracking_loadedTimes > 0) {
    this.reportMainService.CreditorsBillTracking_loadedTimes = this.reportMainService.CreditorsBillTracking_loadedTimes - 1;
}
}
    
    // this.reportDisplayName = '';
    // this.labelDisplayName = '';
    // this.ledgerDisplayName = '';
    // this.detailreportDisplayName = '';
    // this.accountDisplayName = '';
    // this.entryuserDisplayName = '';
    // this.costcenterDisplayName = '';
    this.reportMainService.reportDataStore[this.activeurlpath] = undefined;
    this.reportMainService.reportDataStore[this.instanceWiseRepName] = undefined;
    let xyz = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.instanceWiseRepName == this.instanceWiseRepName);
    // ////console.log("@@xyz",xyz)
    this.reportMainService.previouslyLoadedReportList.splice(xyz, 1)
    // ////console.log("@@previouslyLoadedReportList ma k xa?",this.reportMainService.previouslyLoadedReportList)
    if (this.reportMainService.previouslyLoadedReportList.length == 0) {
      this.router.navigate(["/pages/dashboard/dashboard"]);
    } else {
      this.instanceWiseRepName = this.reportMainService.previouslyLoadedReportList[this.reportMainService.previouslyLoadedReportList.length - 1].instanceWiseRepName;
      this.loadReportDataFromExistingStore();
      this.ReportCriteriaDisplay(this.reportparam, this.reportname,this.showReportName);

      this.router.navigate(
        [this.reportMainService.previouslyLoadedReportList[this.reportMainService.previouslyLoadedReportList.length - 1].activeurlpath,
        {
          queryParams: {
            instancename: this.reportMainService.previouslyLoadedReportList[this.reportMainService.previouslyLoadedReportList.length - 1].instanceWiseRepName
          }
        }]);

    }

  }

  popReportandClose(report) {
    // ////console.log("@@report", report)
    this.reportMainService.previouslyLoadedReportList.splice(report, 1)
    let routepaths = report.split('/');
    let activeurlpath2;
    if (routepaths && routepaths.length) {
      activeurlpath2 = routepaths[routepaths.length - 1]
      // ////console.log("@@activeurlpath2", activeurlpath2)

    }
    this.closeReportShorcut(activeurlpath2);
  }

  closeReportShorcut(activeurlpath) {
    // ////console.log("@@activeurlpath", activeurlpath)
    this.reportHeaders = [];
    this.allHeaders =[];
    this.reportData = [];
    this.reportparam = [];
    if (activeurlpath == 'summaryledgerreport') {
      this.reportMainService.SummaryLedgerObj = <any>{};
    } else if (activeurlpath == 'accountledgerreport') {
      this.reportMainService.AccoutLedgerObj = <any>{};
    } else if (activeurlpath == 'summarypartyledger') {
      this.reportMainService.SummaryPartyLedgerObj = <any>{};
    } else if (activeurlpath == 'partyledgerreport') {
      this.reportMainService.PartyLedgerObj = <any>{};
    } else if (activeurlpath == 'sub-ledger-report') {
      this.reportMainService.SubLedgerObj = <any>{};
    } else if (activeurlpath == 'debtorsreport') {
      this.reportMainService.DebtorsReportObj = <any>{};
    } else if (activeurlpath == 'creditorsreport') {
      this.reportMainService.CreditorsReportObj = <any>{};
    } else if (activeurlpath == 'debtorsagingreport') {
      this.reportMainService.DebtorsAgeingObj = <any>{};
    } else if (activeurlpath == 'creditorsagingreport') {
      this.reportMainService.CreditorsAgeingObj = <any>{};
    } else if (activeurlpath == 'actual-vs-budget-report') {
      this.reportMainService.ActualVsBudgetObj = <any>{};
    } else if (activeurlpath == 'voucher-regeister-report') {
      this.reportMainService.VoucherRegisterObj = <any>{};
    } else if (activeurlpath == 'cash-bank-book-report') {
      this.reportMainService.CashAndBankBookObj = <any>{};
    } else if (activeurlpath == 'day-book-report') {
      this.reportMainService.DayBookObj = <any>{};
    } else if (activeurlpath == 'debtorsoutstandingreport') {
      this.reportMainService.DebtorsOutstandingObj = <any>{};
    } else if (activeurlpath == 'creditorsoutstandingreport') {
      this.reportMainService.CreditorsOutstandingObj = <any>{};
    }

    this.reportDisplayName = '';
    this.labelDisplayName = '';
    this.ledgerDisplayName = '';
    this.detailreportDisplayName = '';
    this.accountDisplayName = '';
    this.entryuserDisplayName = '';
    this.costcenterDisplayName = '';
    this.supplierDisplayName = '';
    this.voucherDisplayName = '';
    this.reportMainService.reportDataStore[activeurlpath] = undefined;

  }

  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) {
    if ($event.code == "F2") {
      $event.preventDefault();
      this.fiterClickEvent();
    }
    if ($event.code == "F9") {
      $event.preventDefault();
      this.ExportReportInExcel('xlsx');
    }
    // if ($event.code == "F4") {
    //   $event.preventDefault();
    //   this.showPreviouslyLoadedReports();
    // }
    if ($event.code == "Escape") {
      if (this.showReportListDialog == true) {
        this.CancelReportList();
      } else {
        if (this.reportLoadedSuccess == true) {
          $event.preventDefault();
          this.closeReport();
        }
      }

    }

    if (this.selectedRowIndex == null) this.selectedRowIndex = 0;

    if ($event.code === "ArrowDown") {
      $event.preventDefault();
      if (this.showReportListDialog == true) {
        this.selectedRowIndex = this.selectedRowIndex + 1;
        if (this.selectedRowIndex > (this.previouslyLoadedReportsList.length - 1)) this.selectedRowIndex = this.previouslyLoadedReportsList.length - 1;
      } else {
        this.body.nativeElement.scrollTop = this.body.nativeElement.scrollTop + 15;
        this.HighlightRow = this.HighlightRow + 1;
        if (this.HighlightRow > (this.reportData.length - 1)) this.HighlightRow = this.reportData.length - 1;
      }
    }
    else if ($event.code === "ArrowUp") {
      $event.preventDefault();
      if (this.showReportListDialog == true) {
        this.selectedRowIndex = this.selectedRowIndex - 1;
        if (this.selectedRowIndex < 0) this.selectedRowIndex = 0;
      } else {
        if (this.body.nativeElement.scrollTop > 0) {
          this.body.nativeElement.scrollTop = this.body.nativeElement.scrollTop - 15;
        }
        this.HighlightRow = this.HighlightRow - 1;
        if (this.HighlightRow < 0) this.HighlightRow = 0;


      }
    }
    if ($event.code === "Enter" || $event.code === "NumpadEnter") {
      if (this.showReportListDialog == true) {
        $event.preventDefault();
        if (this.selectedRowIndex != null) {
          if (this.previouslyLoadedReportsList[this.selectedRowIndex] != null) {
            let abc = this.previouslyLoadedReportsList[this.selectedRowIndex].activeurlpath;
            // ////console.log("main1",this.previouslyLoadedReportsList[this.selectedRowIndex])
            this.instanceWiseRepName = this.previouslyLoadedReportsList[this.selectedRowIndex].instanceWiseRepName;
            this.loadReportDataFromExistingStore();
            this.ReportCriteriaDisplay(this.reportparam, this.reportname,this.showReportName);
            this.router.navigate(
              [this.previouslyLoadedReportsList[this.selectedRowIndex].activeurlpath,
              {
                queryParams: {
                  instancename: this.previouslyLoadedReportsList[this.selectedRowIndex].instanceWiseRepName
                }
              }]);
          }
        }
      }

    }
  }


  onClickLoadedReportList(i, value) {
    this.selectedRowIndex = i;
    if (value) {
      //  ////console.log("@@value",value);
      this.instanceWiseRepName = value.instanceWiseRepName;
      this.loadReportDataFromExistingStore();
      this.ReportCriteriaDisplay(this.reportparam, this.reportname,this.showReportName);
      this.router.navigate(
        [this.previouslyLoadedReportsList[i].activeurlpath],
        {
          queryParams: {
            instancename: this.previouslyLoadedReportsList[i].instanceWiseRepName
          }
        });

    }
  }



  loadReportDataFromExistingStore() {
    // ////console.log("reportStoredata",this.reportMainService.reportDataStore);
    let existingDataFromReportDataStore = this.reportMainService.reportDataStore[this.instanceWiseRepName];
    if (existingDataFromReportDataStore != null && existingDataFromReportDataStore != undefined) {
      this.reportData = existingDataFromReportDataStore.data.result.data;
      this.reportDetail = existingDataFromReportDataStore.data.result.repDetails;
      this.reportname = existingDataFromReportDataStore.param.reportname;
      this.reportparam = existingDataFromReportDataStore.param.reportparam;
      this.reportContextMenu = existingDataFromReportDataStore.data.result.reportContextMenu;
      this.reportmasterDetail = existingDataFromReportDataStore.data.result.reportmasterDetail;
      this.reportFooter = existingDataFromReportDataStore.data.result.totalRowData;
      this.showReportName = existingDataFromReportDataStore.param.REPORTDISPLAYNAME?existingDataFromReportDataStore.param.REPORTDISPLAYNAME:existingDataFromReportDataStore.param.reportname;
      this.hasDynamicHeaders = this.reportmasterDetail.DYNAMICHEADER;
      this.leftcolumnnumber = this.reportmasterDetail.LEFTCOLUMNNUMBER;
      this.rightcolumnnumber = this.reportmasterDetail.RIGHTCOLUMNNUMBER;
      this.MergeReportHeader = this.reportmasterDetail.MERGEREPORTHEADER;
      this.ShowLineInFinalReport = this.reportmasterDetail.SHOWLINEINFINALREPORT;
    }
  }


  getCNDNMODE(data: any) {

  }

  drillDownReport(data: any) {
    this.loadReportDataFromExistingStore();
    // ////console.log("@@data", data);
    // ////console.log("@@this.reportmasterDetail", this.reportmasterDetail)
    if (this.reportmasterDetail.DRILLTO && this.reportmasterDetail.DRILLTO != "VOUCHER" && (this.reportmasterDetail.REPORTNAME != 'Sub Ledger Report ACBASE' && this.reportmasterDetail.REPORTNAME != 'Debtors Bill Tracking Report' && this.reportmasterDetail.REPORTNAME != 'Creditors Bill Tracking Report' )) {
      if(this.reportmasterDetail.DRILLKEY == 'ACID'){
        if ((data.ACID && (data.ACID != 'AG01001' && data.ACID != 'AG01002'))) {
          // ////console.log("@@dataACID", data);
  
          // if (data.ACID && data.ACID.startsWith("PA")) {
          //   if(this.masterService.userSetting.DISPLAY == 1){
          //     this.reportmasterDetail.DRILLTO = 'Party Ledger Report_1';
          //   }else{
          //     this.reportmasterDetail.DRILLTO = 'Party Ledger Report';
          //   }
          // } else {
          //   if(this.masterService.userSetting.DISPLAY == 1){
          //     this.reportmasterDetail.DRILLTO = 'Account Ledger Report_1';
          //   }else{
          //     this.reportmasterDetail.DRILLTO = 'Account Ledger Report';
          //   }
          // }
  
          if (data.ACCODE && data.ACCODE.startsWith("SL")) {
            this.reportmasterDetail.DRILLTO = 'Sub Ledger Report';
          }
        }
        if ((data.ACID && data.ACID == 'AG01001') && (data.TYPE && data.TYPE == 'G')) {
          // ////console.log("@@dataACID1", data.ACID);
          this.reportmasterDetail.DRILLTO = 'Debtors Report';
        }
        if ((data.ACID && data.ACID == 'AG01002') && (data.TYPE && data.TYPE == 'G')) {
          // ////console.log("@@dataACID2", data.ACID);
          this.reportmasterDetail.DRILLTO = 'Creditors Report';
        }
      }

      if(this.reportmasterDetail.DRILLKEY == 'ACID_A'){
        if ((data.ACID_A && (data.ACID_A != 'AG01001' && data.ACID_A != 'AG01002'))) {
          // //console.log("dataACID_A", data);
  
          // if (data.ACID_A && data.ACID_A.startsWith("PA")) {
          //   this.reportmasterDetail.DRILLTO = 'Party Ledger Report';
          // } else {
          //   this.reportmasterDetail.DRILLTO = 'Account Ledger Report';
          // }
  
          if (data.ACCODE && data.ACCODE.startsWith("SL")) {
            this.reportmasterDetail.DRILLTO = 'Sub Ledger Report';
          }
        }
        if ((data.ACID_A && data.ACID_A == 'AG01001') && (data.TYPE && data.TYPE == 'G')) {
          this.reportmasterDetail.DRILLTO = 'Debtors Report';
        }
        if ((data.ACID_A && data.ACID_A == 'AG01002') && (data.TYPE && data.TYPE == 'G')) {
          this.reportmasterDetail.DRILLTO = 'Creditors Report';
        }
      }  
    }

    if ((data.ACID && data.ACID.startsWith("PA")) || (data.ACID_A && data.ACID_A.startsWith("PA"))) {
      this.reportMainService.ReportFilterObject.ACIDwithPA = true;
    } else {
      this.reportMainService.ReportFilterObject.ACIDwithPA = false;
    }

    // ////console.log("@@data.ACCODE",data.ACCODE)
    if (data.ACCODE && data.ACCODE.startsWith("SL")) {
      this.reportMainService.ReportFilterObject.ACCODEwithSL = true;
    } else {
      this.reportMainService.ReportFilterObject.ACCODEwithSL = false;
    }

    // if( data.IsSLedger ){
    // var abc='SL1_AC2551';
    // var xyz=abc.split("_")
    // ////console.log("@xyz",xyz,xyz[0],xyz[1])
    // }else{
    // }

    // ////console.log("@@this.reportmasterDetail.DRILLTO",this.reportmasterDetail.DRILLTO)
    if (!this.reportmasterDetail.hasOwnProperty('DRILLKEY') ||
      !this.reportmasterDetail.hasOwnProperty('DRILLTO') ||
      !this.reportmasterDetail.hasOwnProperty('ISDRILLABLE') ||
      !this.reportmasterDetail.ISDRILLABLE) {
      return;
    }
    if (this.reportmasterDetail.DRILLTO == 'VOUCHER') {
      let voucher = data[this.reportmasterDetail.DRILLKEY].substring(0, 2).toUpperCase();
      if (voucher == 'TI' || voucher == 'CN' || voucher == 'PI' || voucher == 'DN') {
        this.masterService.getPclandCNDNmode(voucher, data[this.reportmasterDetail.DRILLKEY]).subscribe((res) => {
          if (res.result && res.result[0].CNDN_MODE == 1) {
            this.CNDN_MODE = 1;
          } else {
            this.CNDN_MODE = 0;
            if (res.result && res.result[0].PCL == 'pc001') {
              this.masterService.PCL_VALUE = 1;
            } else if (res.result && res.result[0].PCL == 'pc002') {
              this.masterService.PCL_VALUE = 2;
            }
            else{
              this.masterService.PCL_VALUE = 2;
            }
          }
        }, err => {

        }, () => {
          this.routerToVouchers(data);
        })
      } else {
        this.routerToVouchers(data);
      }
    } else {
      this.routerToVouchers(data);
    }


  }


  routerToVouchers(data: any) {
    ////console.log("CheckHere!", data)
    switch (this.reportmasterDetail.DRILLTO) {
      case 'Account Ledger Report':
        case 'Account Ledger Report_1':
          case 'Account Ledger Report_2':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE']);
        this.router.navigate(
          ["/pages/financialreports/account-ledger-reports/accountledgerreport"],
          {
            queryParams: {
              mode: 'DRILL',
              selectedDiv: this.reportparam.DIV
            }
          }
        );
        break;
      case 'Party Ledger Report':
        case 'Party Ledger Report_1':
          case 'Party Ledger Report_2':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE']);
        this.router.navigate(
          ["/pages/financialreports/account-ledger-reports/partyledgerreport"],
          {
            queryParams: {
              mode: 'DRILL',

            }
          }
        );
        break;
      case 'Day Book Report_1':
      case 'VTYPE':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data);
        this.router.navigate(
          ["/pages/financialreports/registerBookReports/day-book-report"],
          {
            queryParams: {
              mode: 'DRILL'
            }
          }
        );
        break;
      case 'Summary Ledger Report':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE'], this.reportMainService.ReportFilterObject.ACIDwithPA, this.reportMainService.ReportFilterObject.ACCODEwithSL);
        this.router.navigate(
          ["/pages/financialreports/account-ledger-reports/summaryledgerreport"],
          {
            queryParams: {
              mode: 'DRILL'
            }
          }
        );
        break;
      case 'Summary Party Ledger Report':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE'], this.reportMainService.ReportFilterObject.ACIDwithPA, this.reportMainService.ReportFilterObject.ACCODEwithSL);
        this.router.navigate(
          ["/pages/financialreports/account-ledger-reports/summarypartyledger"],
          {
            queryParams: {
              mode: 'DRILL'
            }
          }
        );
        break;
      case 'Sub Ledger Report':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE'], this.reportMainService.ReportFilterObject.ACIDwithPA, this.reportMainService.ReportFilterObject.ACCODEwithSL);
        this.router.navigate(
          ["/pages/financialreports/account-ledger-reports/sub-ledger-report"],
          {
            queryParams: {
              mode: 'DRILL'
            }
          }
        );
        break;


      case 'VOUCHER':
        if (isNullOrUndefined(data[this.reportmasterDetail.DRILLKEY])) return;
        this.router.navigate(
          [this.getDrillRouteVoucherWise(data[this.reportmasterDetail.DRILLKEY])],
          {
            queryParams: {
              mode: 'DRILL',
              voucher: data[this.reportmasterDetail.DRILLKEY],
              returnUrl: this.activeurlpath,
              pcl: this.masterService.PCL_VALUE,
              Div: this.reportparam.DIV
            }
          }
        );
        break;
      case 'Debtors Report':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE']);
        this.router.navigate(
          ["/pages/financialreports/additionalreport/debtorsreport"],
          {
            queryParams: {
              mode: 'DRILL'
            }
          }
        );
        break;
      case 'Creditors Report':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE']);
        this.router.navigate(
          ["/pages/financialreports/additionalreport/creditorsreport"],
          {
            queryParams: {
              mode: 'DRILL'
            }
          }
        );
        break;
      case 'Debtors Bill Tracking Report':
        case 'Debtors Bill Tracking Report_1':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE']);
        this.router.navigate(
          ["/pages/financialreports/additionalreport/bill-tracking-report"],
          {
            queryParams: {
              mode: 'DRILL'
            }
          }
        );
        break;
        case 'Creditors Bill Tracking Report':
          case 'Creditors Bill Tracking Report_1':
        this.resolveDrillDownParam(this.reportmasterDetail.DRILLTO, data, data['TYPE']);
        this.router.navigate(
          ["/pages/financialreports/additionalreport/creditorsbill-tracking-report"],
          {
            queryParams: {
              mode: 'DRILL'
            }
          }
        );
        break;
      default:
        break;
    }
  }

  getDrillRouteVoucherWise(voucherNo: string): string {

    let voucher = voucherNo && voucherNo.substring(0, 2).toUpperCase();
    switch (voucher) {
      case 'JV':
        return '/pages/account/acvouchers/journal-voucher';
      case 'PV':
        return '/pages/account/acvouchers/expense-voucher';
      case 'RV':
        return '/pages/account/acvouchers/income-voucher';
      case 'CN':
        // ////console.log("@@this.CNDN_MODE-CN", this.CNDN_MODE)
        // ////console.log("@@CN- this.masterService.PCL_VALUE", this.masterService.PCL_VALUE);
        if (this.CNDN_MODE == 1) {
          return '/pages/account/acvouchers/credit-note';
        } else {
          return '/pages/transaction/sales/add-creditnote-itembase';
        }
      case 'DN':
        // ////console.log("@@this.CNDN_MODEDN", this.CNDN_MODE)
        // ////console.log("@@DN- this.masterService.PCL_VALUE", this.masterService.PCL_VALUE)
        if (this.CNDN_MODE == 1) {
          return '/pages/account/acvouchers/debit-note';
        } else {
          return '/pages/transaction/purchases/add-debitnote-itembase';
        }
      case 'CP':
        return '/pages/account/acvouchers/capital-voucher';
      case 'CV':
      case 'CE':
        return '/pages/account/acvouchers/contra-voucher';
      case 'AD':
        return '/pages/account/acvouchers/additional-cost';
      case 'TI':
        // ////console.log("@@TAX- this.masterService.PCL_VALUE", this.masterService.PCL_VALUE)
        return '/pages/transaction/sales/addsientry';
      case 'PI':
        // ////console.log("@@PI- this.masterService.PCL_VALUE", this.masterService.PCL_VALUE)
        return '/pages/transaction/purchases/add-purchase-invoice';
      case 'CX':
        return '/pages/account/acvouchers/cellpay-voucher';
      default:
        break;
    }
  }

  onRightClick(event, data: any) {
    event.preventDefault();
    if (!this.reportContextMenu.length) return;
    let subject = new Subject<any>();

    /**
     * determines what to do on context menu option clicked
     */
    this.conTextMenuAction(subject, data);





    this.contextMenuView.mouseEvent = event;
    this.contextMenuView.menuItems = this.buildContextMenuItems(subject);
    this.contextMenuView.show = true;

  }
  private buildContextMenuItems(subject: Subject<any>) {
    let items: MenuItem[] = [];
    for (let ctx of this.reportContextMenu) {
      items.push(new MenuItem(ctx.menuname, ctx.commandname, subject));
    }
    return items;
  }

  private conTextMenuAction(subject: Subject<any>, drillToData: any) {
    let ovservable = subject.asObservable();
    ovservable.subscribe((item: MenuItem) => {
      this.reportmasterDetail.DRILLTO = item.value;
      if(item.label == "DRILL TO LEDGER" || item.label == "DRILL TO LEDGER (LEFT SIDE)" || item.label == "DRILL TO DETAIL"){
        this.reportmasterDetail.DRILLKEY = 'ACID';
      }
      if(item.label == "DRILL TO LEDGER (RIGHT SIDE)"){
        this.reportmasterDetail.DRILLKEY = 'ACID_A';
      }
      this.drillDownReport(drillToData);
      this.contextMenuView.show = true;
    });
  }





  resolveDrillDownParam(reporttype: string, dataToDrill: any, extraparam: string = null, ACIDWithPA: boolean = false, ACCODEWithSL: boolean = false) {
    this.reportService.drillParam = <DrillDownParam>{};
    this.reportService.drillParam.reportparam = <drillDownReportParam>{};
    this.reportService.drillParam.returnUrl = this.arouter.snapshot['_routerState'].url;
    this.reportService.drillParam.reportparam.mode = 'DRILL';
    //console.log("@@dataToDrill", dataToDrill)
    // ////console.log("@@extraparam", extraparam)
    //console.log("@@reporttype", reporttype)
    // ////console.log("@@ACIDWithPA",ACIDWithPA)
    // ////console.log("@@heretocheck",this.reportService.drillParam.reportparam)
    switch (reporttype) {
      case 'Summary Ledger Report':
        this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
        this.reportService.drillParam.reportparam.DATE1 = this.reportparam.DATE1;
        this.reportService.drillParam.reportparam.DATE2 = this.reportparam.DATE2;
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;
        this.reportService.drillParam.reportparam.CUSTOMERNAME = this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:dataToDrill['ACNAME'];

        if (extraparam == "G") {
          // ////console.log("@@dataToDrill['ACID']", dataToDrill['ACID'])

          this.reportService.drillParam.reportname = 'Summary Ledger Report';
          this.reportService.drillParam.reportparam.AREA = "%";
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.ISPARTYGROUPLEDGER = "0";
          this.reportService.drillParam.reportparam.PARENT = this.reportService.drillParam.reportparam.ACID;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;

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
        } else if (ACCODEWithSL == false && ACIDWithPA == false && (dataToDrill['ACID'] != 'AG001001' && dataToDrill['ACID'] != 'AG001002')) {
          this.reportService.drillParam.reportname = 'Account Ledger Report';
          this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
          this.reportService.drillParam.reportparam.MERGEREPORT = 0;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;
          this.reportService.drillParam.reportparam.SHOWNARATION = 0;
          this.reportService.drillParam.reportparam.SHOWNDATE = 0;
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.REPORTTYPE = 2;

          let acc = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Account Ledger Report');
          if (acc >= 0) {
            this.reportMainService.previouslyLoadedReportList.splice(acc, 1)
          }
          this.reportMainService.previouslyLoadedReportList.push(
            {
              reportname: 'Account Ledger Report',
              activeurlpath: '/pages/financialreports/account-ledger-reports/accountledgerreport',
              activerurlpath2: 'accountledgerreport'
            });
          return "/pages/financialreports/account-ledger-reports/accountledgerreport";
        } else if (ACCODEWithSL == false && ACIDWithPA == true && (dataToDrill['ACID'] != 'AG001001' && dataToDrill['ACID'] != 'AG001002')) {
          this.reportService.drillParam.reportname = 'Party Ledger Report';
          this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
          this.reportService.drillParam.reportparam.MERGEREPORT = 0;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;
          this.reportService.drillParam.reportparam.SHOWNARATION = 0;
          this.reportService.drillParam.reportparam.SHOWNDATE = 0;
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;

          if (this.reportMainService.PartyLedger_loadedTimes == 0) {
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Party Ledger Report',
                activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                activerurlpath2: 'partyledgerreport',
                instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
              });
          } else {
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Party Ledger Report' + '_' + this.reportMainService.PartyLedger_loadedTimes,
                activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                activerurlpath2: 'partyledgerreport',
                instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
              });
          }
          this.instanceWiseRepName = 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes;
          this.storeAndUpdateReportDataStore(this.reportService.drillParam, this.report_Result);
          this.reportMainService.PartyLedger_loadedTimes = this.reportMainService.PartyLedger_loadedTimes + 1;
          return "/pages/financialreports/account-ledger-reports/partyledgerreport";

        } else if (ACCODEWithSL == true) {
          this.reportService.drillParam.reportname = 'Sub Ledger Report';
          this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
          this.reportService.drillParam.reportparam.MERGEREPORT = 0;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;
          this.reportService.drillParam.reportparam.SHOWNARATION = 0;
          this.reportService.drillParam.reportparam.SHOWNDATE = 0;
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;

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

      case 'Day Book Report_1':
      case 'VTYPE':
        this.reportService.drillParam.reportname = 'Day Book Report_1';
        this.reportService.drillParam.reportparam.COMID = this.reportparam.COMID;
        this.reportService.drillParam.reportparam.DATE1 =  dataToDrill['DATE']?dataToDrill['DATE']:this.reportparam.DATE1;
        this.reportService.drillParam.reportparam.DATE2 =  dataToDrill['DATE']?dataToDrill['DATE']:this.reportparam.DATE2;
        this.reportService.drillParam.reportparam.BSDATE1 =  dataToDrill['BSDATE']?dataToDrill['BSDATE']:this.reportparam.BSDATE1;
        this.reportService.drillParam.reportparam.BSDATE2 =  dataToDrill['BSDATE']?dataToDrill['BSDATE']:this.reportparam.BSDATE2;
        this.reportService.drillParam.reportparam.DETAILREPORT = "1";
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;
        this.reportService.drillParam.reportparam.USR = this.reportparam.USR;
        // this.reportService.drillParam.reportparam.VTYPE = this.gerVoucherTypeFromName(this.reportmasterDetail.DRILLKEY);
        this.reportService.drillParam.reportparam.VTYPE = dataToDrill['VOUCHER_ID']?dataToDrill['VOUCHER_ID']:this.gerVoucherTypeFromName(dataToDrill['VOUCHERNAME']);
        break;
      case 'Account Ledger Report':
        //console.log("@@Account Ledger Report",this.reportparam)
        this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
        this.reportService.drillParam.reportparam.DATE1 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE1?this.reportparam.DATE1:this.reportparam.DATE);
        this.reportService.drillParam.reportparam.DATE2 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE2?this.reportparam.DATE2:this.reportparam.DATE);
        this.reportService.drillParam.reportparam.BSDATE1 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE1?this.reportparam.BSDATE1:this.reportparam.BSDATE);
        this.reportService.drillParam.reportparam.BSDATE2 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE2?this.reportparam.BSDATE2:this.reportparam.BSDATE);
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;

        this.reportService.drillParam.reportname = 'Account Ledger Report';
        this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
        this.reportService.drillParam.reportparam.MERGEREPORT = 0;
        this.reportService.drillParam.reportparam.REPORTTYPE = 0;
        this.reportService.drillParam.reportparam.SHOWNARATION = 0;
        this.reportService.drillParam.reportparam.SHOWNDATE = 0;
        this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.CUSTOMERNAME = this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['ACNAME']?dataToDrill['ACNAME']:this.reportparam.ACNAME);
        this.reportService.drillParam.reportparam.PARENT = this.reportService.drillParam.reportparam.ACID;
        this.reportService.drillParam.reportparam.ACNAME = this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:dataToDrill['ACNAME'];

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
        break;
        case 'Account Ledger Report_1':
          this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
          this.reportService.drillParam.reportparam.DATE1 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE1?this.reportparam.DATE1:this.reportparam.DATE);
        this.reportService.drillParam.reportparam.DATE2 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE2?this.reportparam.DATE2:this.reportparam.DATE);
        this.reportService.drillParam.reportparam.BSDATE1 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE1?this.reportparam.BSDATE1:this.reportparam.BSDATE);
        this.reportService.drillParam.reportparam.BSDATE2 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE2?this.reportparam.BSDATE2:this.reportparam.BSDATE);
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;

        this.reportService.drillParam.reportname = 'Account Ledger Report_1';
        this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 1;
        this.reportService.drillParam.reportparam.MERGEREPORT = 0;
        this.reportService.drillParam.reportparam.REPORTTYPE = 0;
        this.reportService.drillParam.reportparam.SHOWNARATION = 0;
        this.reportService.drillParam.reportparam.SHOWNDATE = 1;
        this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.CUSTOMERNAME = this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['ACNAME']?dataToDrill['ACNAME']:this.reportparam.ACNAME);
        this.reportService.drillParam.reportparam.PARENT = this.reportService.drillParam.reportparam.ACID;
        this.reportService.drillParam.reportparam.ACNAME = this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:dataToDrill['ACNAME'];
        this.reportService.drillParam.reportparam.SUMMARYLEDGER = 1;

        let accountledger_1 = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Account Ledger Report');
        if (accountledger_1 >= 0) {
          this.reportMainService.previouslyLoadedReportList.splice(accountledger_1, 1)
        }
        this.reportMainService.previouslyLoadedReportList.push(
          {
            reportname: 'Account Ledger Report',
            activeurlpath: '/pages/financialreports/account-ledger-reports/accountledgerreport',
            activerurlpath2: 'accountledgerreport'
          });
        break;
      case 'Account Ledger Report_2':
        this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
        this.reportService.drillParam.reportparam.DATE1 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE1?this.reportparam.DATE1:this.reportparam.DATE);
        this.reportService.drillParam.reportparam.DATE2 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE2?this.reportparam.DATE2:this.reportparam.DATE);
        this.reportService.drillParam.reportparam.BSDATE1 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE1?this.reportparam.BSDATE1:this.reportparam.BSDATE);
        this.reportService.drillParam.reportparam.BSDATE2 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE2?this.reportparam.BSDATE2:this.reportparam.BSDATE);
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;

        this.reportService.drillParam.reportname = 'Account Ledger Report_2';
        this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
        this.reportService.drillParam.reportparam.MERGEREPORT = 0;
        this.reportService.drillParam.reportparam.REPORTTYPE = 0;
        this.reportService.drillParam.reportparam.SHOWNARATION = 0;
        this.reportService.drillParam.reportparam.SHOWNDATE = 1;
        this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.CUSTOMERNAME = this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['ACNAME']?dataToDrill['ACNAME']:this.reportparam.ACNAME);
        this.reportService.drillParam.reportparam.PARENT = this.reportService.drillParam.reportparam.ACID;
        this.reportService.drillParam.reportparam.ACNAME = this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:dataToDrill['ACNAME'];
        this.reportService.drillParam.reportparam.SUMMARYLEDGER = 1;

        let accountledger2 = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Account Ledger Report');
        if (accountledger2 >= 0) {
          this.reportMainService.previouslyLoadedReportList.splice(accountledger2, 1)
        }
        this.reportMainService.previouslyLoadedReportList.push(
          {
            reportname: 'Account Ledger Report',
            activeurlpath: '/pages/financialreports/account-ledger-reports/accountledgerreport',
            activerurlpath2: 'accountledgerreport'
          });
        break;
      case 'Party Ledger Report':
        //console.log("@@Party Ledger Report",this.reportparam)
        this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
        this.reportService.drillParam.reportparam.DATE1 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE1?this.reportparam.DATE1:this.reportparam.DATE);
        this.reportService.drillParam.reportparam.DATE2 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE2?this.reportparam.DATE2:this.reportparam.DATE);
        this.reportService.drillParam.reportparam.BSDATE1 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE1?this.reportparam.BSDATE1:this.reportparam.BSDATE);
        this.reportService.drillParam.reportparam.BSDATE2 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE2?this.reportparam.BSDATE2:this.reportparam.BSDATE);
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;

        this.reportService.drillParam.reportname = 'Party Ledger Report';
        this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
        this.reportService.drillParam.reportparam.MERGEREPORT = 0;
        this.reportService.drillParam.reportparam.REPORTTYPE = 0;
        this.reportService.drillParam.reportparam.SHOWNARATION = 0;
        this.reportService.drillParam.reportparam.SHOWNDATE = 0;
        this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.COSTCENTER?this.reportparam.COSTCENTER:this.reportparam.CCENTER;
        this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportMainService.PartyLedgerObj.EnableCombineLedger = false;
        this.reportService.drillParam.reportparam.CUSTOMERNAME=this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['CUSTOMER NAME'] ? dataToDrill['CUSTOMER NAME'] : (dataToDrill['ACNAME'] ? dataToDrill['ACNAME'] : this.reportparam.ACNAME));
        this.reportService.drillParam.reportparam.ACNAME=this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['CUSTOMER NAME'] ? dataToDrill['CUSTOMER NAME'] : dataToDrill['ACNAME']);


        if (this.reportMainService.PartyLedger_loadedTimes == 0) {
          this.reportMainService.previouslyLoadedReportList.push(
            {
              reportname: 'Party Ledger Report',
              activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
              activerurlpath2: 'partyledgerreport',
              instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
            });
        } else {
          this.reportMainService.previouslyLoadedReportList.push(
            {
              reportname: 'Party Ledger Report' + '_' + this.reportMainService.PartyLedger_loadedTimes,
              activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
              activerurlpath2: 'partyledgerreport',
              instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
            });
        }
        this.instanceWiseRepName = 'Party Ledger Reportt' + this.reportMainService.PartyLedger_loadedTimes;
        this.storeAndUpdateReportDataStore(this.reportService.drillParam, this.report_Result);
        this.reportMainService.PartyLedger_loadedTimes = this.reportMainService.PartyLedger_loadedTimes + 1;


        break;

        case 'Party Ledger Report_1':
          // ////console.log("@@reportparam",this.reportparam)
          this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
          this.reportService.drillParam.reportparam.DATE1 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE1?this.reportparam.DATE1:this.reportparam.DATE);
          this.reportService.drillParam.reportparam.DATE2 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE2?this.reportparam.DATE2:this.reportparam.DATE);
          this.reportService.drillParam.reportparam.BSDATE1 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE1?this.reportparam.BSDATE1:this.reportparam.BSDATE);
          this.reportService.drillParam.reportparam.BSDATE2 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE2?this.reportparam.BSDATE2:this.reportparam.BSDATE);
          this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
          this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
          this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;
  
          this.reportService.drillParam.reportname = 'Party Ledger Report_1';
          this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 1;
          this.reportService.drillParam.reportparam.MERGEREPORT = 0;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;
          this.reportService.drillParam.reportparam.SHOWNARATION = 0;
          this.reportService.drillParam.reportparam.SHOWNDATE = 1;
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.COSTCENTER?this.reportparam.COSTCENTER:this.reportparam.CCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportMainService.PartyLedgerObj.EnableCombineLedger = false;
          this.reportService.drillParam.reportparam.CUSTOMERNAME=this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['CUSTOMER NAME'] ? dataToDrill['CUSTOMER NAME'] : (dataToDrill['ACNAME'] ? dataToDrill['ACNAME'] : this.reportparam.ACNAME));
          this.reportService.drillParam.reportparam.ACNAME=this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['CUSTOMER NAME'] ? dataToDrill['CUSTOMER NAME'] : dataToDrill['ACNAME']);
          this.reportService.drillParam.reportparam.SUMMARYLEDGER = 1;
  
          if (this.reportMainService.PartyLedger_loadedTimes == 0) {
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Party Ledger Report',
                activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                activerurlpath2: 'partyledgerreport',
                instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
              });
          } else {
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Party Ledger Report' + '_' + this.reportMainService.PartyLedger_loadedTimes,
                activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                activerurlpath2: 'partyledgerreport',
                instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
              });
          }
          this.instanceWiseRepName = 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes;
          this.storeAndUpdateReportDataStore(this.reportService.drillParam, this.report_Result);
          this.reportMainService.PartyLedger_loadedTimes = this.reportMainService.PartyLedger_loadedTimes + 1; 
          break;

        case 'Party Ledger Report_2':
          //console.log("@@Party Ledger Report_2",this.reportparam)
          this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
          this.reportService.drillParam.reportparam.DATE1 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE1?this.reportparam.DATE1:this.reportparam.DATE);
          this.reportService.drillParam.reportparam.DATE2 = dataToDrill['DATE']?dataToDrill['DATE']:(this.reportparam.DATE2?this.reportparam.DATE2:this.reportparam.DATE);
          this.reportService.drillParam.reportparam.BSDATE1 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE1?this.reportparam.BSDATE1:this.reportparam.BSDATE);
          this.reportService.drillParam.reportparam.BSDATE2 = dataToDrill['BSDATE']?dataToDrill['BSDATE']:(this.reportparam.BSDATE2?this.reportparam.BSDATE2:this.reportparam.BSDATE);
          this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
          this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
          this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;
  
          this.reportService.drillParam.reportname = 'Party Ledger Report_2';
          this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
          this.reportService.drillParam.reportparam.MERGEREPORT = 0;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;
          this.reportService.drillParam.reportparam.SHOWNARATION = 0;
          this.reportService.drillParam.reportparam.SHOWNDATE = 1;
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.COSTCENTER?this.reportparam.COSTCENTER:this.reportparam.CCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportMainService.PartyLedgerObj.EnableCombineLedger = false;
          this.reportService.drillParam.reportparam.CUSTOMERNAME=this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['CUSTOMER NAME'] ? dataToDrill['CUSTOMER NAME'] : (dataToDrill['ACNAME'] ? dataToDrill['ACNAME'] : this.reportparam.ACNAME));
          this.reportService.drillParam.reportparam.ACNAME=this.reportmasterDetail.DRILLKEY=='ACID_A'?dataToDrill['ACNAME_A']:(dataToDrill['CUSTOMER NAME'] ? dataToDrill['CUSTOMER NAME'] : dataToDrill['ACNAME']);
          this.reportService.drillParam.reportparam.SUMMARYLEDGER = 1;
  
          if (this.reportMainService.PartyLedger_loadedTimes == 0) {
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Party Ledger Report',
                activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                activerurlpath2: 'partyledgerreport',
                instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
              });
          } else {
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Party Ledger Report' + '_' + this.reportMainService.PartyLedger_loadedTimes,
                activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                activerurlpath2: 'partyledgerreport',
                instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
              });
          }
          this.instanceWiseRepName = 'Party Ledger Reportt' + this.reportMainService.PartyLedger_loadedTimes;
          this.storeAndUpdateReportDataStore(this.reportService.drillParam, this.report_Result);
          this.reportMainService.PartyLedger_loadedTimes = this.reportMainService.PartyLedger_loadedTimes + 1; 
          break;

      case 'Summary Party Ledger Report':
        this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
        this.reportService.drillParam.reportparam.DATE1 = this.reportparam.DATE1;
        this.reportService.drillParam.reportparam.DATE2 = this.reportparam.DATE2;
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;

        if (extraparam === "G") {
          this.reportService.drillParam.reportname = 'Summary Party Ledger Report';
          this.reportService.drillParam.reportparam.AREA = "%";
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.ISPARTYGROUPLEDGER = "0";
          this.reportService.drillParam.reportparam.PARENT = this.reportparam.ACID;

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

        } else if (ACCODEWithSL == false && ACIDWithPA == false) {
          this.reportService.drillParam.reportname = 'Account Ledger Report';
          this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
          this.reportService.drillParam.reportparam.MERGEREPORT = 0;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;
          this.reportService.drillParam.reportparam.SHOWNARATION = 0;
          this.reportService.drillParam.reportparam.SHOWNDATE = 0;
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;

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

        } else if (ACCODEWithSL == false && ACIDWithPA == true) {
          this.reportService.drillParam.reportname = 'Party Ledger Report';
          this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
          this.reportService.drillParam.reportparam.MERGEREPORT = 0;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;
          this.reportService.drillParam.reportparam.SHOWNARATION = 0;
          this.reportService.drillParam.reportparam.SHOWNDATE = 0;
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;

          if (this.reportMainService.PartyLedger_loadedTimes == 0) {
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Party Ledger Report',
                activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                activerurlpath2: 'partyledgerreport',
                instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
              });
          } else {
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Party Ledger Report' + '_' + this.reportMainService.PartyLedger_loadedTimes,
                activeurlpath: '/pages/financialreports/account-ledger-reports/partyledgerreport',
                activerurlpath2: 'partyledgerreport',
                instanceWiseRepName: 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes,
              });
          }
          this.instanceWiseRepName = 'Party Ledger Report' + this.reportMainService.PartyLedger_loadedTimes;
          this.storeAndUpdateReportDataStore(this.reportService.drillParam, this.report_Result);
          this.reportMainService.PartyLedger_loadedTimes = this.reportMainService.PartyLedger_loadedTimes + 1;

          return "/pages/financialreports/account-ledger-reports/partyledgerreport";

        } else if (ACCODEWithSL == true) {
          this.reportService.drillParam.reportname = 'Sub Ledger Report';
          this.reportService.drillParam.reportparam.IGNOREOPPOSITAC = 0;
          this.reportService.drillParam.reportparam.MERGEREPORT = 0;
          this.reportService.drillParam.reportparam.REPORTTYPE = 0;
          this.reportService.drillParam.reportparam.SHOWNARATION = 0;
          this.reportService.drillParam.reportparam.SHOWNDATE = 0;
          this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
          this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;

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
      case 'Sub Ledger Report':
        // ////console.log("@@subb",dataToDrill[this.reportmasterDetail.DRILLKEY])
        var abc = dataToDrill[this.reportmasterDetail.DRILLKEY];
        var xyz = abc.split("_")
        // ////console.log("@xyz",xyz,xyz[0],xyz[1])

        this.reportService.drillParam.reportparam.SL_ACID = xyz[0];
        this.reportService.drillParam.reportparam.DATE1 = this.reportparam.DATE1;
        this.reportService.drillParam.reportparam.DATE2 = this.reportparam.DATE2;
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;

        this.reportService.drillParam.reportname = 'Sub Ledger Report';
        this.reportService.drillParam.reportparam.SHOWNDATE = 0;
        this.reportService.drillParam.reportparam.ACID = xyz[1];
        this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.ACCNAME = this.reportparam.ACCNAME;
        // this.reportService.drillParam.reportparam.SL_ACNAME = this.reportparam.SL_ACNAME;
        this.reportService.drillParam.reportparam.REPORTTYPE = 1;
        this.reportService.drillParam.reportparam.SL_ACNAME = dataToDrill['ACCOUNT'] ? dataToDrill['ACCOUNT'] : dataToDrill['ACNAME'];

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

        break;

      case 'Debtors Report':
        this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
        this.reportService.drillParam.reportparam.DATE1 = this.reportparam.DATE1;
        this.reportService.drillParam.reportparam.DATE2 = this.reportparam.DATE2;
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;

        this.reportService.drillParam.reportname = 'Debtors Report';
        this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.COSTCENTER?this.reportparam.COSTCENTER:this.reportparam.CCENTER;
        this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.SHOWDPARTYDETAIL = 0;
        this.reportService.drillParam.reportparam.REPORTTYPE = 0;

        let debitors = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Debtors Report');
        if (debitors >= 0) {
          this.reportMainService.previouslyLoadedReportList.splice(debitors, 1)
        }
        this.reportMainService.previouslyLoadedReportList.push(
          {
            reportname: 'Debtors Report',
            activeurlpath: '/pages/financialreports/additionalreport/debtorsreport',
            activerurlpath2: 'debtorsreport'
          });
        break;
      case 'Creditors Report':
        this.reportService.drillParam.reportname = 'Creditors Report';
        this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
        this.reportService.drillParam.reportparam.DATE1 = this.reportparam.DATE1;
        this.reportService.drillParam.reportparam.DATE2 = this.reportparam.DATE2;
        this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
        this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
        this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;

        this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.COSTCENTER?this.reportparam.COSTCENTER:this.reportparam.CCENTER;
        this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
        this.reportService.drillParam.reportparam.SHOWDPARTYDETAIL = 0;
        this.reportService.drillParam.reportparam.REPORTTYPE = 0;

        let creditors = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Creditors Report');
        if (creditors >= 0) {
          this.reportMainService.previouslyLoadedReportList.splice(creditors, 1)
        }
        this.reportMainService.previouslyLoadedReportList.push(
          {
            reportname: 'Creditors Report',
            activeurlpath: '/pages/financialreports/additionalreport/creditorsreport',
            activerurlpath2: 'creditorsreport'
          });
          break;
        case 'Debtors Bill Tracking Report':
          case 'Debtors Bill Tracking Report_1':
            this.reportService.drillParam.reportname = reporttype;
            this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
            this.reportService.drillParam.reportparam.ACNAME = dataToDrill['CUSTOMER NAME'];
            this.reportService.drillParam.reportparam.DATE1 = this.reportparam.DATE1;
            this.reportService.drillParam.reportparam.DATE2 = this.reportparam.DATE2;
            this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
            this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
            this.reportService.drillParam.reportparam.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
            this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;
    
            this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.COSTCENTER?this.reportparam.COSTCENTER:this.reportparam.CCENTER;
            this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
            this.reportService.drillParam.reportparam.DETAIL = '1';
    
            let debtors_bill = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Debtors Bill Tracking Report');
            if (debtors_bill >= 0) {
              this.reportMainService.previouslyLoadedReportList.splice(creditors, 1)
            }
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Debtors Bill Tracking Report',
                activeurlpath: '/pages/financialreports/additionalreport/bill-tracking-report',
                activerurlpath2: 'bill-tracking-report'
              });
            break;
            case 'Creditors Bill Tracking Report':
              case 'Creditors Bill Tracking Report_1':
            this.reportService.drillParam.reportname = reporttype;
            this.reportService.drillParam.reportparam.ACID = dataToDrill[this.reportmasterDetail.DRILLKEY];
            this.reportService.drillParam.reportparam.DATE1 = this.reportparam.DATE1;
            this.reportService.drillParam.reportparam.DATE2 = this.reportparam.DATE2;
            this.reportService.drillParam.reportparam.DIV = this.reportparam.DIV;
            this.reportService.drillParam.reportparam.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
            this.reportService.drillParam.reportparam.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
            this.reportService.drillParam.reportparam.PHISCALID = this.reportparam.PHISCALID;
    
            this.reportService.drillParam.reportparam.COSTCENTER = this.reportparam.COSTCENTER?this.reportparam.COSTCENTER:this.reportparam.CCENTER;
            this.reportService.drillParam.reportparam.CCENTER = this.reportparam.CCENTER?this.reportparam.CCENTER:this.reportparam.COSTCENTER;
            this.reportService.drillParam.reportparam.DETAIL = '1';
    
            let creditors_bill = this.reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Creditors Bill Tracking Report');
            if (creditors_bill >= 0) {
              this.reportMainService.previouslyLoadedReportList.splice(creditors, 1)
            }
            this.reportMainService.previouslyLoadedReportList.push(
              {
                reportname: 'Creditors Bill Tracking Report',
                activeurlpath: '/pages/financialreports/additionalreport/creditorsbill-tracking-report',
                activerurlpath2: 'creditorsbill-tracking-report'
              });
            break;
    }
  }


  gerVoucherTypeFromName(voucherName: string): string {
    switch (voucherName.toUpperCase()) {
      case "JOURNAL":

        return 'JV';

      default:
        break;
    }
  }

  ReportCriteriaDisplay(reportparam, reportname, REPORTDISPLAYNAME) {
    // ////console.log("@@criteriapart",reportparam,reportname)

    if (reportparam.DIVISIONNAME) {
        this.divisionDisplayName = reportparam.DIVISIONNAME;
    }
    else{
        this.divisionDisplayName = '';
    }

    if (reportparam.COSTCENTERDISPLAYNAME) {
      this.costcenterDisplayName = reportparam.COSTCENTERDISPLAYNAME;
  }
  else{
      this.costcenterDisplayName = '';
  }
  
    if ((reportname == 'Account Ledger Report' || reportname == 'Account Ledger Report_1'|| reportname == 'Account Ledger Report_2')
      && this.reportMainService.AccoutLedgerObj.EnableCombineLedger != true) {
      this.reportDisplayName = 'Account Ledger';
      this.labelDisplayName = 'Ledger';
      this.ledgerDisplayName = reportparam.ACNAME;

      if(reportparam.SUMMARYLEDGER == 0){
        this.reportTypeDisplay = "@Detail Ledger Report";
      }else if(reportparam.SUMMARYLEDGER == 1){
        this.reportTypeDisplay = "@Summary Ledger Report"
      }else{
        this.reportTypeDisplay ='';
      }
      // if (reportparam.COSTCENTER != '%') {
      //   this.masterService.getCostCenterName(reportparam.COSTCENTER).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    } else if ((reportname == 'Party Ledger Report' || reportname == 'Party Ledger Report_1' || this.reportname == 'Party Ledger Report_2') && this.reportMainService.PartyLedgerObj.EnableCombineLedger != true) {
      this.reportDisplayName = 'Party Ledger';
      if(reportparam.ACNAME !='' && reportparam.ACNAME !=null && reportparam.ACNAME !=undefined){
        this.labelDisplayName = 'Ledger';
        this.ledgerDisplayName = reportparam.ACNAME;
      }

      if(reportparam.SUMMARYLEDGER == 0){
        this.reportTypeDisplay = "@Detail Ledger Report";
      }else if(reportparam.SUMMARYLEDGER == 1){
        this.reportTypeDisplay = "@Summary Ledger Report"
      }else{
        this.reportTypeDisplay ='';
      }
      // if (reportparam.COSTCENTER != '%') {
      //   this.masterService.getCostCenterName(reportparam.COSTCENTER).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    } else if ((reportname == 'Account Ledger Report' || reportname == 'Account Ledger Report_1' || reportname == 'Account Ledger Report_2')
      && this.reportMainService.AccoutLedgerObj.EnableCombineLedger == true) {
      this.reportDisplayName = 'Account Ledger';
      this.labelDisplayName = 'Ledger';
      this.ledgerDisplayName = 'Combine Ledger Selection';
    } else if ((reportname == 'Party Ledger Report' || reportname == 'Party Ledger Report_1' || this.reportname == 'Party Ledger Report_2') && this.reportMainService.PartyLedgerObj.EnableCombineLedger == true) {
      this.reportDisplayName = 'Party Ledger';
      this.labelDisplayName = 'Ledger';
      this.ledgerDisplayName = 'Combine Ledger Selection';
    } else if ((reportname == 'Summary Ledger Report' || reportname == 'Summary Ledger Report_1') && reportparam.REPORTTYPE == 0) {
      this.reportDisplayName = 'Account Group Ledger';
      if (reportname == 'Summary Ledger Report') {
        this.labelDisplayName = 'Account Group';
      } else {
        this.labelDisplayName = '';
      }


      this.masterService.getAllAccount(reportparam.PARENT).subscribe(
        data => {
          this.ledgerDisplayName = data.result ? data.result.ACNAME : '';
        })

      // if (reportparam.CCENTER != '%') {
      //   this.masterService.getCostCenterName(reportparam.CCENTER).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    } else if ((reportname == 'Summary Ledger Report' || reportname == 'Summary Ledger Report_1') && reportparam.REPORTTYPE == 2) {
      this.reportDisplayName = 'Account Group Ledger';
      if (reportname == 'Summary Ledger Report') {
        this.labelDisplayName = 'Account Group';
      } else {
        this.labelDisplayName = '';
      }

      this.ledgerDisplayName = 'Cost Center Wise Report';
    } else if ((reportname == 'Summary Party Ledger Report' || reportname == 'Summary Party Ledger Report_1' ||
      reportname == 'Summary Party Ledger Report_2') && reportparam.REPORTTYPE == 0) {
      this.reportDisplayName = 'Party Group Ledger';
      if (reportname == 'Summary Party Ledger Report') {
        this.labelDisplayName = 'Party Group';
      } else {
        this.labelDisplayName = '';
      }

      this.masterService.getAllAccount(reportparam.PARENT).subscribe(
        data => {
          this.ledgerDisplayName = data.result ? data.result.ACNAME : '';
        })

      // if (reportparam.CCENTER != '%') {
      //   this.masterService.getCostCenterName(reportparam.CCENTER).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    } else if ((reportname == 'Summary Party Ledger Report' || reportname == 'Summary Party Ledger Report_1' ||
      reportname == 'Summary Party Ledger Report_2') && reportparam.REPORTTYPE == 1) {
      this.reportDisplayName = 'Party Group Ledger';
      if (reportname == 'Summary Party Ledger Report') {
        this.labelDisplayName = 'Party Group';
      } else {
        this.labelDisplayName = '';
      }
      this.ledgerDisplayName = 'Area Wise Report';
      // if (reportparam.CCENTER != '%') {
      //   this.masterService.getCostCenterName(reportparam.CCENTER).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    } else if ((reportname == 'Summary Party Ledger Report' || reportname == 'Summary Party Ledger Report_1' ||
      reportname == 'Summary Party Ledger Report_2') && reportparam.REPORTTYPE == 2) {
      this.reportDisplayName = 'Party Group Ledger';
      if (reportname == 'Summary Party Ledger Report') {
        this.labelDisplayName = 'Party Group';
      } else {
        this.labelDisplayName = '';
      }
      this.ledgerDisplayName = 'Cost Center Wise Report';
    } else if (this.reportMainService.ReportFilterObject.EnableCombineLedger == true) {
      this.ledgerDisplayName = 'Combine Ledger Selection';
    } else if ((reportname == 'vat register report' || reportname == 'vat register report_1')
      && (reportparam.VTYPE == '%' || reportparam.VTYPE === undefined
        || reportparam.VTYPE == '')
    ) {
      this.reportDisplayName = 'Voucher Register';
      this.labelDisplayName = 'Voucher Name';
      this.ledgerDisplayName = reportparam.VTYPEDISPLAYNAME;
      this.accountDisplayName = reportparam.ACNAME;
      this.entryuserDisplayName = reportparam.USER;
      // if (reportparam.CostCenter != '%') {
      //   this.masterService.getCostCenterName(reportparam.CostCenter).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // }
    } else if (reportname == 'vat register report' || reportname == 'vat register report_1') {
      this.reportDisplayName = 'Voucher Register';
      this.labelDisplayName = 'Voucher Name';
      this.ledgerDisplayName = reportparam.VTYPEDISPLAYNAME;
      this.accountDisplayName = reportparam.ACNAME;
      this.entryuserDisplayName = reportparam.USER;
      // if (reportparam.CostCenter != '%') {
      //   this.masterService.getCostCenterName(reportparam.CostCenter).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    } else if (reportname == 'Sub Ledger Report' || reportname == 'Sub Ledger Report_1') {
      this.reportDisplayName = 'Sub Ledger - Ledger Report';
      if (reportparam.ACID != '%' && reportparam.ACID != '' && reportparam.ACCNAME) {
        this.labelDisplayName = 'Main Ledger';
        this.ledgerDisplayName = reportparam.ACCNAME;
      } else {
        this.labelDisplayName = '';
        this.ledgerDisplayName = '';
      }
      if (reportparam.SL_ACID != '%' && reportparam.SL_ACID != '') {
        this.subledgerlabelDisplayName = 'Sub Ledger';
        this.subledgerDisplayName = reportparam.SL_ACNAME;
      } else {
        this.subledgerlabelDisplayName = '';
        this.subledgerDisplayName = '';
      }

      // if (reportparam.CCENTER != '%') {
      //   this.masterService.getCostCenterName(reportparam.CCENTER).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
      // ////console.log("@@yeha",reportname,this.labelDisplayName)
    } else if (reportname == 'Debtors Report' || reportname == 'Debtors Report_1') {
      this.reportDisplayName = 'Debtors Report';
      this.labelDisplayName = '';
      if (reportparam.OPNINGBLONLY == 1) {
        this.ledgerDisplayName = '@Opening Debtors Only';
      } else {
        this.ledgerDisplayName = '';
      }

      if (reportparam.AREAWISEDISPLAYNAME) {
        this.AreawiseDisplayName = reportparam.AREAWISEDISPLAYNAME;
      }
      else {
        this.AreawiseDisplayName = '';
      }

      if (reportparam.PARTYGROUPDISPLAYNAME) {
        this.PartyGroupDisplayName = reportparam.PARTYGROUPDISPLAYNAME;
      }
      else {
        this.PartyGroupDisplayName = '';
      }

      if (reportparam.PARTYCATEGORYDISPLAYNAME) {
        this.PartyCategoryDisplayName = reportparam.PARTYCATEGORYDISPLAYNAME;
      }
      else {
        this.PartyCategoryDisplayName = '';
      }
     
      // if (reportparam.Debtors_CostCenter != '%') {
      //   this.masterService.getCostCenterName(reportparam.Debtors_CostCenter).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    }
    else if (reportname == 'Creditors Report' || reportname == 'Creditors Report_1') {
      this.reportDisplayName = 'Creditors Report';
      this.labelDisplayName = '';
      if (reportparam.OPNINGBLONLY == 1) {
        this.ledgerDisplayName = '@Opening Debtors Only';
      } else {
        this.ledgerDisplayName = '';
      }

      if (reportparam.AREAWISEDISPLAYNAME) {
        this.AreawiseDisplayName = reportparam.AREAWISEDISPLAYNAME;
      }
      else {
        this.AreawiseDisplayName = '';
      }

      if (reportparam.PARTYGROUPDISPLAYNAME) {
        this.PartyGroupDisplayName = reportparam.PARTYGROUPDISPLAYNAME;
      }
      else {
        this.PartyGroupDisplayName = '';
      }

      if (reportparam.PARTYCATEGORYDISPLAYNAME) {
        this.PartyCategoryDisplayName = reportparam.PARTYCATEGORYDISPLAYNAME;
      }
      else {
        this.PartyCategoryDisplayName = '';
      }
      // if (reportparam.Creditors_CostCenter != '%') {
      //   this.masterService.getCostCenterName(reportparam.Creditors_CostCenter).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    }
    else if (reportname == 'Debtors Aging Report' || reportname == 'Debtors Aging Report_1') {
      this.reportDisplayName = 'Debtors Ageing Report';
      this.labelDisplayName = '';
      this.ledgerDisplayName = '';
      // if (reportparam.DebtorsAgeing_CostCenter != '%') {
      //   this.masterService.getCostCenterName(reportparam.DebtorsAgeing_CostCenter).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    }
    else if (reportname == 'Creditors Aging Report' || reportname == 'Creditors Aging Report_1') {
      this.reportDisplayName = 'Creditors Ageing Report';
      this.labelDisplayName = '';
      this.ledgerDisplayName = '';
      // if (reportparam.CreditorsAgeing_CostCenter != '%') {
      //   this.masterService.getCostCenterName(reportparam.CreditorsAgeing_CostCenter).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    }
    else if (reportname == 'Cash/Bank Book Report' || reportname == 'Cash/Bank Book Report_1' || reportname == 'Cash/Bank Book Report_2') {
      this.reportDisplayName = 'Cash/Bank Book Report';
      this.labelDisplayName = '';
      this.accountDisplayName = reportparam.ACNAME;
      if (reportparam.DETAILREPORT == "0") {
        this.detailreportDisplayName = '@Summary Report';
      } else if (reportparam.DETAILREPORT == "1") {
        this.detailreportDisplayName = '@Detail Report';
      }
      if (reportparam.REPORTMODE == 1) {
        this.ledgerDisplayName = '@Cash Book Only';
      } else if (reportparam.REPORTMODE == 2) {
        this.ledgerDisplayName = '@Bank Book Only';
      } else {
        this.ledgerDisplayName = '';
      }
    } else if ((reportname == 'Day Book Report' || reportname == 'Day Book Report_1')
      && (reportparam.VTYPE == '%' || reportparam.VTYPE === undefined
        || reportparam.VTYPE == '')
    ) {
      this.reportDisplayName = 'Day Book Report';
      this.labelDisplayName = 'Voucher Name';
      this.ledgerDisplayName = 'All';
      if (reportparam.USR != '%') {
        this.entryuserDisplayName = reportparam.USR;
      } else {
        this.entryuserDisplayName = '';
      }
    }
    else if (reportname == 'Day Book Report' || reportname == 'Day Book Report_1') {
      this.reportDisplayName = 'Day Book Report';
      this.labelDisplayName = 'Voucher Name';
      this.ledgerDisplayName = reportparam.VTYPEDISPLAYNAME;
      if (reportparam.USR != '%') {
        this.entryuserDisplayName = reportparam.USR;
      } else {
        this.entryuserDisplayName = '';
      }
    }
    else if (reportname == 'Sub Ledger Report ACBASE' || reportname == 'Sub Ledger Report ACBASE_1') {
      this.reportDisplayName = 'Sub Ledger - Summary Report';
      if (reportparam.ACID != '%' && reportparam.ACID != '') {
        this.labelDisplayName = 'Main Ledger';
        this.ledgerDisplayName = reportparam.ACCNAME;
      }
      else {
        this.labelDisplayName = '';
        this.ledgerDisplayName = '';
      }
      if (reportparam.SL_ACID != '%' && reportparam.SL_ACID != '') {
        this.subledgerlabelDisplayName = 'Sub Ledger';
        this.subledgerDisplayName = reportparam.SL_ACNAME;
      }
      else {
        this.subledgerlabelDisplayName = '';
        this.subledgerDisplayName = '';
      }
      // if (reportparam.CCENTER != '%') {
      //   this.masterService.getCostCenterName(reportparam.CCENTER).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     })
      // } else {
      //   this.costcenterDisplayName = '';
      // }
    }
    else if (reportname == 'Trial Balance Report' || reportname == 'Trial Balance Report_1' || reportname == 'Trial Balance Report_2') {
      this.reportDisplayName = 'Trial Balance Report';
      // if (reportparam.COSTCENTER != '%') {
      //   this.masterService.getCostCenterName(reportparam.COSTCENTER).subscribe(
      //     data => {
      //       this.costcenterDisplayName = data.result[0] ? data.result[0].COSTCENTERNAME : '';
      //     });
      // } else {
      //   this.costcenterDisplayName = '';
      // }
      if (reportparam.LEDGERWISE == 0) {
        this.ledgerDisplayName = '@Group Wise Report';
      } else if (reportparam.LEDGERWISE == 1) {
        this.ledgerDisplayName = '@Ledger Wise Report';
      } else {
        this.ledgerDisplayName = '';
      }
      if (reportparam.SUMMARYREPORT == 0) {
        this.detailreportDisplayName = '@Detail Report';
      } else if (reportparam.SUMMARYREPORT == 1) {
        this.detailreportDisplayName = '@Summary Report';
      } else {
        this.detailreportDisplayName = '';
      }
    }

    else if (reportname == 'Additional Cost Voucherwise Summary Report' || reportname == 'Additional Cost Voucherwise Detail Report') {
      this.reportDisplayName = 'Additional Cost Voucherwise Report';

      if (reportparam.SUMMARYREPORT == 0) {
        this.detailreportDisplayName = '@Detail Report';
      } else if (reportparam.SUMMARYREPORT == 1) {
        this.detailreportDisplayName = '@Summary Report';
      } else {
        this.detailreportDisplayName = '';
      }

      if (reportparam.ACID != '%' && reportparam.ACID != '' && reportparam.ACCNAME) {
        this.supplierDisplayName = reportparam.ACCNAME;
      } else {
        this.supplierDisplayName = '';
      }
      if (reportparam.VOUCHER != '%' && reportparam.VOUCHER != '') {
        this.voucherDisplayName = reportparam.VOUCHER;
      } else {
        this.voucherDisplayName = '';
      }
    }

    else if (reportname == 'Additional Cost Itemwise Summary Report' || reportname == 'Additional Cost Itemwise Detail Report') {
      this.reportDisplayName = 'Additional Cost Itemwise Report';

      if (reportparam.SUMMARYREPORT == 0) {
        this.detailreportDisplayName = '@Detail Report';
      } else if (reportparam.SUMMARYREPORT == 1) {
        this.detailreportDisplayName = '@Summary Report';
      } else {
        this.detailreportDisplayName = '';
      }

      if (reportparam.ACID != '%' && reportparam.ACID != '' && reportparam.ACCNAME) {
        this.supplierDisplayName = reportparam.ACCNAME;
      } else {
        this.supplierDisplayName = '';
      }
      if (reportparam.VOUCHER != '%' && reportparam.VOUCHER != '') {
        this.voucherDisplayName = reportparam.VOUCHER;
      } else {
        this.voucherDisplayName = '';
      }
    }  else if (reportname.startsWith('Stock Summary') && reportname.includes('Account')) {
      this.reportDisplayName = 'Stock Summary Report';

      if (reportparam.DETAILFORMAT == 1) {
        this.detailreportDisplayName = '@Detail Report';
      } else if (reportparam.DETAILFORMAT == 0) {
        this.detailreportDisplayName = '@Summary Report';
      } else {
        this.detailreportDisplayName = '';
      }
    } else if (reportname.startsWith('Current Stock Warehousewise') && reportname.includes('Account')) {
      this.reportDisplayName = 'Stock Report - Warehouse Wise';
    } else if (reportname.startsWith('Stock Abc') && reportname.includes('Account')) {
      this.reportDisplayName = 'Stock Abc Analysis Report';  
    } else if (reportname.startsWith('Stock Valuation') && reportname.includes('Account')) {
      this.reportDisplayName = 'Stock Valuation Report';  
    } else if (reportname.startsWith('Stock Ledger') && reportname.includes('Account')) {
      this.reportDisplayName = 'Stock Ledger Report';  
    }else if (reportname == 'Post Dated Cheque Voucher Report' || reportname == 'Post Dated Cheque Voucher Report_1') {
      this.reportDisplayName = 'Post Dated Cheque Voucher Report';
      if (reportparam.DETAILSREPORT == "0") {
        this.detailreportDisplayName = '@Summary Report';
      } else if (reportparam.DETAILSREPORT == "1") {
        this.detailreportDisplayName = '@Detail Report';
      }
    }
    else {
      this.reportDisplayName = REPORTDISPLAYNAME ? REPORTDISPLAYNAME :reportname;
    }

    if ((reportname == 'vat register report' || reportname == 'vat register report_1') &&
      reportparam.REPORT_MODE == 0) {
      this.reportmodeisZero = 0;
    } else if ((reportname == 'vat register report' || reportname == 'vat register report_1') &&
      reportparam.REPORT_MODE == 1) {
      this.reportmodeisZero = 1;
    }

  

    // if (reportparam.VTYPE == 'OB') {
    //   this.ledgerDisplayName = 'A/C OPENING_BLCD';
    // } else if (reportparam.VTYPE == 'CE' || reportparam.VTYPE == 'CV') {
    //   this.ledgerDisplayName = 'CONTRA VOUCHER';
    // } else if (reportparam.VTYPE == 'CN') {
    //   this.ledgerDisplayName = 'CREDIT NOTE VOUCHER';
    // } else if (reportparam.VTYPE == 'DN') {
    //   this.ledgerDisplayName = 'DEBIT NOTE VOUCHER';
    // } else if (reportparam.VTYPE == 'PV') {
    //   this.ledgerDisplayName = 'EXPENSE VOUCHER';
    // } else if (reportparam.VTYPE == 'RV') {
    //   this.ledgerDisplayName = 'INCOME VOUCHER';
    // } else if (reportparam.VTYPE == 'JV') {
    //   this.ledgerDisplayName = 'JOURNAL VOUCHER';
    // } else if (reportparam.VTYPE == 'AO') {
    //   this.ledgerDisplayName = 'Party OPENING_BLCD';
    // } else if (reportparam.VTYPE == 'PI') {
    //   this.ledgerDisplayName = 'PURCHASE VOUCHER';
    // } else if (reportparam.VTYPE == 'TI') {
    //   this.ledgerDisplayName = 'SALES VOUCHER';
    // }

    //For BS Date in Reports Heading
    if (reportparam.DATE1 && reportparam.DATE2) {
      this.changeDate(reportparam.DATE1, reportparam.DATE2, "AD");
    } else if (reportparam.DATE) {
      this.changeDate(reportparam.DATE, reportparam.DATE, "AD");
    }
  }

  prepareOptionalHeader(headers: any[] = []) {
    let tmpoptionalreportHeaders = [];
    if (headers.length) {
      for (var head of headers) {
        if (head.hasOwnProperty('colGroup') && head.colGroup != '' && (!isNullOrUndefined(head.colGroup))) {
          let totColGroup = headers.filter(x => x.colGroup == head.colGroup);
          let existingOptHeader = tmpoptionalreportHeaders.filter(y => y.colGroup == head.colGroup);
          if (!existingOptHeader.length) {
            tmpoptionalreportHeaders.push({
              colGroup: head.colGroup,
              width: getMergedHeaderWidth(totColGroup) + 'px',
              colspan: Number(totColGroup.length),
              alignment: 'center',
              mappingName:head.mappingName
            })
          }
        } else {
          tmpoptionalreportHeaders.push({
            colGroup: '',
            colspan: 1,
            width: Number(head.size) + 'px',
            alignment: 'left',
            mappingName:head.mappingName
          })
        }
      }
      let filteredOptionalHeader = tmpoptionalreportHeaders.filter(z => z.colGroup != '');
      this.optionalreportHeaders = filteredOptionalHeader.length ? tmpoptionalreportHeaders : [];
    }


    function getMergedHeaderWidth(subHeader: any[] = []) {

      let totalWidthOfColMerged: number = 0;
      if (subHeader.length) {
        subHeader.forEach(x => {

          totalWidthOfColMerged = totalWidthOfColMerged + Number(x.size);
        });
        return totalWidthOfColMerged;
      } else {
        return 100
      }
    }
  }

  getReportHeadingStyles() {
    let myStyles = {
      'font-size.px': this.userSetting.REPHEADING_FONTSIZE ? this.userSetting.REPHEADING_FONTSIZE : '12',
      'font-family': this.userSetting.REPHEADING_FONTNAME ? this.userSetting.REPHEADING_FONTNAME : 'Roboto, Arial, sans-serif',
    }
    return myStyles;
  }

  getReportDetailStyles() {
    let myStyles = {
      'font-size.px': this.userSetting.REPDETAIL_FONTSIZE ? this.userSetting.REPDETAIL_FONTSIZE : '11',
      'font-family': this.userSetting.REPDETAIL_FONTNAME ? this.userSetting.REPDETAIL_FONTNAME : 'Tahoma',
    }
    return myStyles;
  }

  getReportFooterStyles() {
    let myStyles = {
      'font-size.px': this.userSetting.REPTOTAL_FONTSIZE ? this.userSetting.REPTOTAL_FONTSIZE : '12',
      'font-family': this.userSetting.REPTOTAL_FONTNAME ? this.userSetting.REPTOTAL_FONTNAME : 'Tahoma',
    }
    return myStyles;
  }
  clickNext() {
    this.body.nativeElement.scrollTop = 0;
  }

  clicked(index) {
    this.HighlightRow = index;
  }

  clickedPL(index,data) {
    //console.log("@@index",index,data)
    this.HighlightRow = index;
  }

  printExcelFormat() {
    let vatno = this.userProfile.CompanyInfo.VAT?this.userProfile.CompanyInfo.VAT:this.userProfile.CompanyInfo.GSTNO;
    let report_name = this.showReportName ? this.showReportName: this.reportname;
    this.param='';
    try {
      let popupWin;
      
      let header = '<center><label style="font-weight:bold;font-size:16px;">' + report_name.toUpperCase() + '</label></center><center><label style="font-weight:bold;font-size:18px;">' + this.userProfile.CompanyInfo.NAME + '</label></center><center><label style="font-weight:bold;font-size:13px">' + this.userProfile.CompanyInfo.ADDRESS + '</label></center><center><label style="font-weight:bold"> PAN No : <label style="letter-spacing:5px">' + vatno + '</label></label></center><br>';
      
      if((this.reportname == 'Party Ledger Report' || this.reportname == 'Party Ledger Report_1' || this.reportname == 'Party Ledger Report_2') && this.reportparam.ACNAME !=""){
        this.param = '<label style=" text-align:left;font-size:14px;font-weight:bold;">' + 'CUSTOMER : '+ this.reportparam.ACNAME + '</label><br><label style=" text-align:left;font-size:14px;">' + 'PAN No : '+ this.reportparam.VATNO + '</label>&nbsp;<label style=" text-align:left;font-size:14px;">' + 'Address : '+ this.reportparam.ADDRESS + '</label><br><label style=" text-align:left;font-size:14px;">' + 'Contact Number : '+ this.reportparam.PHONE + '</label>&nbsp;<label style=" text-align:left;font-size:14px;">' + 'Email : '+ this.reportparam.EMAIL + '</label><br><br>';
        // //console.log("Reached inside", this.param)
      }
      this.param += '<label style="font-weight:bold;font-size:12px;">' + this.getReportParamForPreview(this.reportparam, this.reportDetail) + '</label>'+'<label></label>';

      let table = '<table>  <thead>   <tr>';
      if(this.reportname == 'Trial Balance Report' || this.reportname == 'Trial Balance Report_1'){
        let table1 = '<th style="border-top:2px solid black;border-right:2px solid black;padding : 0px; font-size:14px;" colspan="1">' + " " + '</th>';
        table1 += '<th style="border-top:2px solid black;border-right:2px solid black;padding : 0px; font-size:14px;" colspan="2">' + " CLOSING BALANCE" + '</th>';
        table += table1;
      }else  if(this.reportname == 'Trial Balance Report_2'){
        let table1 = '<th style="border-top:2px solid black;border-right:2px solid black;padding : 0px; font-size:14px;" colspan="1">' + " " + '</th>';
        table1 += '<th style="border-top:2px solid black;border-right:2px solid black;padding : 0px; font-size:14px;" colspan="2">' + " OPENING BALANCE" + '</th>';
        table1 += '<th style="border-top:2px solid black;border-right:2px solid black;padding : 0px; font-size:14px;" colspan="2">' + " RUNNING BALANCE" + '</th>';
        table1 += '<th style="border-top:2px solid black;border-right:2px solid black;padding : 0px; font-size:14px;" colspan="2">' + " CLOSING BALANCE" + '</th>';
        table += table1;
      }
      table += '</tr> </thead> <thead> <tr>';
      for (let column1 of this.reportHeaders) {
        let table1 = '<th style="border-top:2px solid black;border-right:2px solid black;padding : 0px; font-size:14px;" >' + column1.colHeader + '</th>';
        table += table1;
      };
      table += '</tr> </thead>';
      table += '<tbody style="border-left: 2px solid black;">';

      for (let row of this.reportData) {
        if(row.FFLG == 'B'){
          table += '<tr style="font-weight:bold;">';
        }else{
          table += '<tr>';
        }
        for (let column1 of this.reportHeaders) {
          var v = row[column1.mappingName];
          if (v == null) v = "";
          let table1;
          if (column1.alignment && column1.alignment == 1) {
            table1 = '<td style="border-top:2px solid black;border-right:2px solid black;padding : 0px;height: 5px;text-align:right;font-size:14px;"><pre style="margin: 0 !important;overflow: hidden;">' + v + '</pre></td>';
          } else {
            table1 = '<td style="border-top:2px solid black;border-right:2px solid black;padding : 0px;height: 5px;font-size:14px;"><pre style="margin: 0 !important;overflow: hidden;">' + v + '</pre></td>';
          }
          table += table1;
          '</tr>';
        };
      }
      table += '</tbody><tfoot>';
      for (let row of this.reportFooter) {
        table += '<tr>';
        for (let column1 of this.reportHeaders) {
          var v = row[column1.mappingName];
          if (v == null) v = "";
          if (column1.alignment && column1.alignment == 0) {
            table += '<td style="border-top:2px solid black;border-right:2px solid black;border-bottom:2px solid black;padding : 0px;text-align:inherit;font-size:14px;font-weight:bold;">' + v + '</td>';
          } else {
            table += '<td style="border-top:2px solid black;border-right:2px solid black;border-bottom:2px solid black;padding : 0px;text-align:right;font-size:14px;font-weight:bold;">' + v + '</td>';
          }
        };

        '</tr>';
      };
      table += '</tfoot></table>';
      // //console.log("@@table",table)
      var Ht = header + this.param + table;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1500px');
      popupWin.document.write(table);
      popupWin.document.title = this.reportname;
      popupWin.document.body.innerHTML = Ht;
      popupWin.focus();
      popupWin.print();
    } catch (ex) { alert(ex) };
  }

  SaveReport() {
    ////console.log("@@this.reportparam", this.reportparam)
    this.masterService.SaveAdditionalCostReport(this.reportparam).subscribe(res => {
      if (res.status == "ok") {
        this.alertService.info('Additional Cost Report is successfully saved');
      } else {
      }
    })
  }

   downloadReportPrepareFromAPI(extension){
    var item = 1;
    let excelColumnName = this.reportHeaders.map(
      x => {
        return <IExcelColumnFormat>{
          SNO: item++,
          ReportName: this.reportname,
          ColumnName: x.colHeader,
          MappingName: x.mappingName,
          MergeHeader:x.colGroup
        };
      }
    );
    let paramObj = { reportname:this.reportname, reportparam:this.reportparam, 
      columnSetting:excelColumnName?excelColumnName:this.reportHeaders,REPORTDISPLAYNAME:this.showReportName?this.showReportName:this.reportname,extension:extension}
    this.masterService.DownLoadAllExcelReportPreparedFromAPI(paramObj).subscribe(
      data => {
        this.downloadFile(data);
      },
      error => {
      }
    )
  }

  downloadFile(response: any) {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(response.content);
    element.download = response.filename;
    document.body.appendChild(element);
    element.click();
  }

  
  prepareOptionalDynamicHeader(headers: any[] = []) {
    let tmpoptionalreportHeaders = [];
    let index= 0;
    if (headers.length) {
      for (var i in headers) {
      if (this.reportmasterDetail.HASDYNAMICCOLUMNS && this.reportmasterDetail.DYNAMICHEADER == 1) {
        let dynamicOptionalHeader='Default';
        let totColGroup2:any;
          if(this.reportmasterDetail.DYNAMICHEADER == 1 && headers[i].mappingName.includes("~")){
            let abc = headers[i].mappingName.split('~');
            dynamicOptionalHeader = abc[0];
          }else{
            dynamicOptionalHeader='Default';
          }
            totColGroup2 = this.allHeaders.filter(x => x.mappingName.split('~')[0] == headers[i].mappingName.split('~')[0]);
            let existingOptHeader2 = tmpoptionalreportHeaders.filter(y => y.mappingName.split('~')[0] == headers[i].mappingName.split('~')[0]);
            if (index+1 >= this.reportmasterDetail.DYNAMICCOLUMNSLEVEL) {
              if (!existingOptHeader2.length ) {      
                tmpoptionalreportHeaders.push(<any>{
                  colGroup: dynamicOptionalHeader == 'Default' ? '' : dynamicOptionalHeader,
                  width: getMergedDynamicHeaderWidth(totColGroup2,this.reportmasterDetail.DYNAMICCOLUMNWIDTH) + 'px',
                  colspan: Number(totColGroup2.length),
                  alignment: 'center',
                  mappingName:headers[i].mappingName,
                  colPosition: dynamicOptionalHeader == 'Default' ? headers[i].colPosition+5000:headers[i].colPosition,
                  visible:headers[i].visible
                })
            }
            }
            else{
                tmpoptionalreportHeaders.push({
                  colGroup: '',
                  colspan: 1,
                  width: Number(headers[i].size) + 'px',
                  alignment: 'center',
                  mappingName:headers[i].mappingName,
                  colPosition:headers[i].colPosition,
                  visible:headers[i].visible
                })                
            
        }
          }
        index++;
      }

          let sortedArray = _.sortBy(tmpoptionalreportHeaders, 'colPosition'); 
          tmpoptionalreportHeaders=sortedArray;
          let _filteredheaders=tmpoptionalreportHeaders.filter(x=>(x.visible==1) || (x.visible==0 && x.mappingName.includes("~")));
      this.optionalreportHeaders = _filteredheaders.length ? _filteredheaders : (tmpoptionalreportHeaders.length?tmpoptionalreportHeaders:[]);
    }
  
  
    function getMergedDynamicHeaderWidth(subHeader: any[] = [],DYNAMICCOLUMNWIDTH) {
      //console.log("@@DYNAMICCOLUMNWIDTH",DYNAMICCOLUMNWIDTH)
      let totalWidthOfColMerged: number = 0;
      if (subHeader.length) {
        subHeader.forEach(x => {
          
          totalWidthOfColMerged = totalWidthOfColMerged + Number(DYNAMICCOLUMNWIDTH);
        });
        return totalWidthOfColMerged;
      } else {
        return 100
      }
    }
  }

  preparereportHeader(headers: any[] = []) {
    let tmpreportHeaders = [];
    if (headers.length) {
      for (var head of headers) {
        if (head.hasOwnProperty('colHeader') && head.colHeader != '' && (!isNullOrUndefined(head.colHeader))) {
          let totColHeader = headers.filter(x => x.colHeader == head.colHeader);
          let existingOptHeader = tmpreportHeaders.filter(y => y.colHeader == head.colHeader);
          if (!existingOptHeader.length) {
            tmpreportHeaders.push({
              width: getMergedHeaderWidth(totColHeader) + 'px',
              colspan: Number(totColHeader.length),
              alignment: 'center',
              mappingName:head.mappingName,
              colHeader:head.colHeader
            })
          }
        }else{
          tmpreportHeaders.push({
            colHeader:head.colHeader,
            colspan: 1,
            width: Number(head.size) + 'px',
            alignment: 'center',
            mappingName:head.mappingName
          })
        }
      }
      this.mergereportHeaders = tmpreportHeaders ? tmpreportHeaders : [];
    }


    function getMergedHeaderWidth(subHeader: any[] = []) {

      let totalWidthOfColMerged: number = 0;
      if (subHeader.length) {
        subHeader.forEach(x => {
          totalWidthOfColMerged = totalWidthOfColMerged + Number(x.size);
        });
        return totalWidthOfColMerged;
      } else {
        return 100
      }
    }
  }

  refreshReportColumns(){
    this.reportMainService.refreshReportColumnFormate(this.reportname,this.reportparam)
    .subscribe(
      (res) => {
        if (res.status == "ok") {
          this.reportColumnFormate = res.result;
          this.rowsperpage = res.result ? res.result[0].rowsperpage : '100';
          if (this.reportColumnFormate.length == 0) {
            this.ReportColumnName = this.reportHeaders.map(
              x => {
                return <ReportColumnFormat>{
                  ReportName: this.reportname,
                  ColumnName: x.colHeader,
                  MappingName: x.mappingName,
                  Show: x.Visible,
                  ColWidth: x.size,
                  Format: x.stringFormat,
                  Align: x.alignment,
                  ColumnPosition: x.colPosition,
                  ColGroup: x.ColGroup,
                  GroupSummary: x.groupSummaryFunction,
                  GSFunction: x.groupSummaryFunction,
                  TableSummary: x.showTables,
                  TSFunction: x.tableSummaryFunction,
                  ReportTitle: this.reportTitle,
                  rowsperpage: this.rowsperpage
                };
              }
            );
      
            this.ReportColumnName.forEach((x, z) => { x.Show = 1, x.TableSummary = 0, x.GroupSummary = 0, x.ColumnPosition = z + 1 });
      
          } else {
            this.ReportColumnName = this.reportColumnFormate.map(
              x => {
                return <ReportColumnFormat>{
                  ReportName: this.reportname,
                  ColumnName: x.ColumnName,
                  MappingName: x.MappingName,
                  Show: x.Show,
                  ColWidth: x.ColWidth,
                  Format: x.Format,
                  Align: x.Align,
                  ColumnPosition: x.ColumnPosition,
                  ColGroup: x.ColGroup,
                  GroupSummary: x.GroupSummary,
                  GSFunction: x.GSFunction,
                  TableSummary: x.TableSummary,
                  TSFunction: x.TSFunction,
                  ReportTitle: this.reportTitle,
                  rowsperpage: x.rowsperpage
                };
              }
            );
          }
        } else {
          this.reportColumnFormate = [];
        }
      }
    )

    
  }
  checkedRows: any[] = [];
  celldataList: any[] = [];
  checkData(index, data) {
    if (data.isCheck == true) {
      this.checkedRows.push(data);
    }
  }

  showcellpayPopup() {
    this.cellpayPayment();
  }

  cellpayPayment() {
    this.celldataList = this.checkedRows.filter(x => x.isCheck == true);
    //console.log("dataList", this.celldataList)
    if (this.celldataList.length == 0) {
      return;
    }
    this.reportService.drillParam.reportparam.ACID = this.celldataList[0]['ACID'];
    this.reportService.drillParam.reportparam.ACNAME = this.celldataList[0]['CUSTOMER NAME'];
    //console.log("this.celldataList[0]['DR AMOUNT']", this.celldataList[0]['DR AMOUNT'])
    this.reportService.drillParam.reportparam.DRAMNT = this.celldataList[0]['DR AMOUNT']
    // this.router.navigate(
    //   [this.getDrillRouteVoucherWise('CX')],
    //   {
    //     queryParams: {
    //       mode: 'PAYMENT',
    //       returnUrl: this.activeurlpath,
    //     }
    //   }
    // ); 
    this._trnMainService.initialFormLoad(75);
    //console.log("TrntranList", this._trnMainService.TrnMainObj.TrntranList)
    this._trnMainService.TrnMainObj.TRNMODE = 'Party Payment';
    // this._trnMainService.TrnMainObj.TRNAC = 'AG124';
    // this._trnMainService.TrnMainObj.TRNACName = 'GLOBAL IME BANK - 02654666522222';

    this._trnMainService.TrnMainObj.TrntranList[0].AccountItem.ACID = this.reportService.drillParam.reportparam.ACID;
    this._trnMainService.TrnMainObj.TrntranList[0].A_ACID = this.reportService.drillParam.reportparam.ACID;
    this._trnMainService.TrnMainObj.TrntranList[0].AccountItem.ACNAME = this.reportService.drillParam.reportparam.ACNAME;
    this._trnMainService.TrnMainObj.TrntranList[0].acitem = this._trnMainService.TrnMainObj.TrntranList[0].AccountItem;
    var dramnt = this.reportService.drillParam.reportparam.DRAMNT;
    var result = dramnt.replace(/,/g, "");
    // //console.log("@@result", result)
    this._trnMainService.TrnMainObj.TrntranList[0].DRAMNT = result;
    let ACID = this.reportService.drillParam.reportparam.ACID;
    let ACNAME = this.reportService.drillParam.reportparam.ACNAME;
    // this._trnMainService.getAccountWiseTrnAmount(ACID);
    this.masterService.getDetailsOfAccount(ACNAME).subscribe(res => {
      if (res.status == "ok") {
        let accDetails = res.result;
        this.checkBankDetails(accDetails[0]);
      }
    })

  }

  checkBankDetails(ac) {
    this.masterService.getAllAccount(ac.ACID)
      .subscribe(data => {
        if (data.status == 'ok') {
          if (data.result5.length > 0) {
            this._trnMainService.TrnMainObj.TrntranList[0].disableBank = false;
            this._trnMainService.TrnMainObj.TrntranList[0].hasAdditionalBank = true;
            this._trnMainService.TrnMainObj.TrntranList[0].BANKNAME = ac.BANKNAME;
            this._trnMainService.TrnMainObj.TrntranList[0].BANKCODE = ac.BANKCODE;
            this._trnMainService.TrnMainObj.TrntranList[0].ChequeNo = ac.BANKACCOUNTNUMBER;
          } else {
            this._trnMainService.TrnMainObj.TrntranList[0].BANKID = ac.BANKID;
            this._trnMainService.TrnMainObj.TrntranList[0].BANKNAME = ac.BANKNAME;
            this._trnMainService.TrnMainObj.TrntranList[0].BANKCODE = ac.BANKCODE;
            this._trnMainService.TrnMainObj.TrntranList[0].ChequeNo = ac.BANKACCOUNTNUMBER;
            this._trnMainService.TrnMainObj.TrntranList[0].hasAdditionalBank = false;
            if (ac.BANKCODE) {
              this._trnMainService.TrnMainObj.TrntranList[0].disableBank = true;
            } else {
              this._trnMainService.TrnMainObj.TrntranList[0].disableBank = false;
            }
          }
          var dramnt = this.reportService.drillParam.reportparam.DRAMNT;
          var result = dramnt.replace(/,/g, "");
          this._trnMainService.TrnMainObj.TrntranList[0].DRAMNT = result;
          this.AddCellPayFee();
        }
      })

    this._trnMainService.TrnMainObj.TrntranList[0].NARATION1 = "e-transfer";
  }

  CellPayFee: string;
  AddCellPayFee() {
    //console.log("CheckResult", this._trnMainService.TrnMainObj.TrntranList[0])
    this._trnMainService.addRowForTransaction(0);
    var dramnt = this._trnMainService.TrnMainObj.TrntranList[0].DRAMNT
    var cramnt = this._trnMainService.TrnMainObj.TrntranList[0].DRAMNT;
    if (dramnt == null || dramnt == undefined) { this.alertService.warning("DRAMNT missing!"); return; }
    if (this._trnMainService.TrnMainObj.TrntranList[0].acitem.ACNAME != 'CellPay Fee' && (dramnt < 100 || dramnt > 1000000)) {
      this.alertService.warning("Please enter amount between 100 and 1000000!");
      this._trnMainService.TrnMainObj.TrntranList[0].DRAMNT = 0;
      if (this._trnMainService.TrnMainObj.TrntranList[1] && this._trnMainService.TrnMainObj.TrntranList[1].acitem &&
        this._trnMainService.TrnMainObj.TrntranList[1].acitem.ACNAME == 'CellPay Fee') {
        this._trnMainService.TrnMainObj.TrntranList[1].acitem.ACID = '';
        this._trnMainService.TrnMainObj.TrntranList[1].acitem.ACNAME = '';
        this._trnMainService.TrnMainObj.TrntranList[1].DRAMNT = 0;
      }
      return;
    }
    this.CellPayFee = (dramnt ? dramnt : cramnt).toString();
    // //console.log("CellPayFeeACID", this.masterService.userSetting.CellPayFee);
    if (this.masterService.userSetting.CellPayFee == null || this.masterService.userSetting.CellPayFee == '' ||
      this.masterService.userSetting.CellPayFee == undefined) {
      this.alertService.info("Please add CellPayFee ACID in database!");
      return;
    }
    this.masterService.getFeeFromCellPay(this.CellPayFee).subscribe(y => {


      this._trnMainService.TrnMainObj.TrntranList[1].DRAMNT = y.fee;
      var ac = <TAcList>{};

      ac.ACID = this.masterService.userSetting.CellPayFee ? this.masterService.userSetting.CellPayFee : 'AG479';
      ac.ACNAME = 'CellPay Fee';



      this._trnMainService.TrnMainObj.TrntranList[1].AccountItem = ac;
      this._trnMainService.TrnMainObj.TrntranList[1].acitem = ac;
      this._trnMainService.TrnMainObj.TrntranList[1].A_ACID = ac.ACID;
      this._trnMainService.TrnMainObj.TrntranList[1].AccountItem.ACCODE = ac.ACCODE;
      if (this._trnMainService.TrnMainObj.TrntranList[1].acitem.ACNAME == 'CellPay Fee') {
        this._trnMainService.TrnMainObj.TrntranList[1].disableCellPayRow = true;
      }
      this.showCellPayPaymentPopup = true;


    })

  }

  OkCellpayCommand() {
    if (this._trnMainService.TrnMainObj.TrntranList[1].DRAMNT && this._trnMainService.TrnMainObj.TrntranList[1].DRAMNT > 0) {

      if (this._trnMainService.TrnMainObj.TRNACName == null ||
        this._trnMainService.TrnMainObj.TRNACName === undefined ||
        this._trnMainService.TrnMainObj.TRNACName == ""
      ) {
        alert("CASH/BANK A/C IS NOT SELECTED. PLS SELECT IT FIRST");
        return;
      }

      this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj)
        .subscribe(
          data => {
            if (data.status == "ok") {
              let xyz = this.checkedRows.findIndex(x => x.ACID == this._trnMainService.TrnMainObj.TrntranList[0].A_ACID);
              this.checkedRows.splice(xyz, 1);
              this.spinnerService.hide();
              this.showCellPayPaymentPopup = false;
              this.cellpayPayment();
            }
          })
    }
  }
  CancelCellpayCommand() {
    this.showCellPayPaymentPopup = false;
  }

  showAcPartyList() {
    //console.log("trnmode", this._trnMainService.TrnMainObj.TRNMODE)
    let TRNMODE = 'PartyPaymentCellpay';
    this.gridACListPartyPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Master/${TRNMODE}/`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: "ACCODE",
          title: "AC CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACNAME",
          title: "A/C NAME",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridACListParty.show();
  }

  onAcPartySelect(value) {
    this._trnMainService.TrnMainObj.TRNAC = value.ACID;
    this._trnMainService.TrnMainObj.TRNACName = value.ACNAME;
  }

  exportReportFormat() {
    this.spinnerService.show('Exporting, Please Wait...');
    this.reportMainService.exportReportFormat(this.reportname).subscribe((res: any) => {
      let blob: any = new Blob([JSON.stringify(res)], { type: "text/html" });
      let reportdownloadname = `${this.showReportName}.txt`;
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = reportdownloadname;
      a.click();
      this.spinnerService.hide();
      this.CancelCommand();
    }, error => {
      this.alertService.info("Exporting Unsuccessfull!!");
      this.spinnerService.hide();
      this.CancelCommand();
    })
  }

}

export interface StockLedgerAccountObj extends ReportFilterOptions{}
export interface AccoutLedgerObj extends ReportFilterOptions {
}
export interface PartyLedgerObj extends ReportFilterOptions {
}
export interface SummaryLedgerObj extends ReportFilterOptions {

}
export interface SummaryPartyLedgerObj extends ReportFilterOptions {

}
export interface DebtorsReportObj extends ReportFilterOptions {
}
export interface CreditorsReportObj extends ReportFilterOptions {
}
export interface DebtorsAgeingObj extends ReportFilterOptions {
}
export interface CreditorsAgeingObj extends ReportFilterOptions {
}
export interface ActualVsBudgetObj extends ReportFilterOptions {
}
export interface VoucherRegisterObj extends ReportFilterOptions {
}
export interface CashAndBankBookObj extends ReportFilterOptions {
}
export interface DayBookObj extends ReportFilterOptions {
}
export interface SubLedgerObj extends ReportFilterOptions {
}
export interface DebtorsOutstandingObj extends ReportFilterOptions {
}
export interface CreditorsOutstandingObj extends ReportFilterOptions {
}

export interface SubLedgerAcbaseObj extends ReportFilterOptions { }
export interface TrialBalanceObj extends ReportFilterOptions { }
export interface AdditionalCostDetailObj extends ReportFilterOptions { }
export interface AdditionalCostSummaryObj extends ReportFilterOptions { }
export interface SalesReturnSummaryObj extends ReportFilterOptions { }
export interface SalesReturnSummaryRetailerObj extends ReportFilterOptions { }
export interface SalesReturnReportDetailObj extends ReportFilterOptions{}
export interface StockValuationObj extends ReportFilterOptions{}
export interface StockSummaryAccountObj extends ReportFilterOptions{}
export interface CurrentStockWarehousewiseAccObj extends ReportFilterOptions{}
export interface StockAbcAnalysisAccountObj extends ReportFilterOptions{}
export interface ConsolidatedTrialBalanceObj extends ReportFilterOptions{}
export interface ProfitLossObj extends ReportFilterOptions { }
export interface BalanceSheetObj extends ReportFilterOptions {}
export interface TDSObj extends ReportFilterOptions{}
export interface ConsolidatedBalanceSheetObj extends ReportFilterOptions{}
export interface ConsolidatedProfitLossObj extends ReportFilterOptions{}
export interface BillTrackingObj extends ReportFilterOptions {}
export interface CreditorsBillTrackingObj extends ReportFilterOptions {}
export interface PostDatedChequeObj extends ReportFilterOptions {}
export interface MonthlySalesPaymentObj extends ReportFilterOptions {}
export interface LocalPurchaseCostAllocationObj extends ReportFilterOptions {}
export interface StockAgeingObj extends ReportFilterOptions{}

export interface ReportFilterOptions {
  ACIDwithPA: boolean;
  ACCODEwithSL: boolean;
  DATE1: string;
  DATE2: string;
  BSDATE1: string;
  BSDATE2: string;
  DIV: string;
  CostCenter: string;
  GROUPBY: string;
  REPORTMODE: string;
  SHOWDPARTYDETAIL: number;
  // OPNINGBLONLY: number;
  DOAGEINGOFOPENINGBL: any;
  ReportType: any;
  ISSUMMARY: string;
  // AreaWise: any;
  IGNOREOPPOSITAC: any;
  SHOWNDATE: any;
  EnableCombineLedger: boolean;
  MERGEREPORT: any;
  SHOWNARATION: any;
  CCENTER: any;
  REPORTMODEVR: any;
  // multipleCostcenter: any[];
  // multipleAreas: any[];
  // showAllContacts: boolean;
  SingleAccount: string;
  AccountsID: string;
  AccountsName: string;
  multipleAccounts: any[];
  ACCNAME: string;
  ACCODE: string;
  multipleACCODE: string;
  multipleACNAME: string;
  ACID: string;
  multipleACID: string;
  Reportnameis: string;
  FROM_VNO: any;
  TO_VNO: any;
  VTYPE: string;
  REPORT_TYPE: any;
  USER: string;
  DETAILREPORT: string;
  assignPrevioiusDate: boolean;
  REPORTMODEC: string;
  SHOWCASEOPENINGCLOSINGBL:any;
  Multiple_GROUP_ACID:string;
  Multiple_GROUP_ACNAME:string;
  multiple_Group_ACCODE:string;

  
  AccLedger_DATE1: string;
  AccLedger_DATE2: string;
  AccLedger_BSDATE1: string;
  AccLedger_BSDATE2: string;
  AccLedger_ACCNAME: string;
  AccLedger_ACCODE: string;
  AccLedger_ACID: string;
  AccLedger_SingleAccount: string;
  AccLedger_DIV: string;
  AccLedger_CostCenter: string;
  AccLedger_ReportType: any;
  AccLedger_multipleCostcenter: any[];
  AccLedger_showAllContacts: boolean;
  AccLedger_multipleAccounts: any[];
  AccLedger_Areawise: any;
  AccLedger_DIVISIONNAME:any;
  AccLedger_LABELDISPLAYNAME:any;
  AccLedger_LEDGERDISPLAYNAME:any;
  AccLedger_COSTCENTERDISPLAYNAME:any;
  AccLedger_SUMMARYREPORT:any;
  AccLedger_HIDENARATION:any;
  AccLedger_HIDEVOUCHERTYPE:any;
  AccLedger_SHOWITEMDETAIL:any;
  AccLedger_INCLUDEPOSTDATE:any;
  AccLedger_HIDECOSTCENTER:any;
  AccLedger_GroupAccount: string;
  AccLedger_multipleGroupAccounts: any[];
  AccLedger_SingleGroupAccount:string;
  

  PartyLedger_DATE1: string;
  PartyLedger_DATE2: string;
  PartyLedger_BSDATE1: string;
  PartyLedger_BSDATE2: string;
  PartyLedger_ACCNAME: string;
  PartyLedger_ACCODE: string;
  PartyLedger_ACID: string;
  PartyLedger_SingleAccount: string;
  PartyLedger_DIV: string;
  PartyLedger_CostCenter: string;
  PartyLedger_ReportType: any;
  PartyLedger_showAllContacts: boolean;
  PartyLedger_multipleAccounts: any[];
  PartyLedger_multipleCostcenter: any[];
  PartyLedger_AreaWise: any;
  PartyLedger_ADDRESS: any;
  PartyLedger_VATNO: any;
  PartyLedger_PHONE: any;
  PartyLedger_EMAIL: any;
  PartyLedger_DIVISIONNAME:any;
  PartyLedger_LABELDISPLAYNAME:any;
  PartyLedger_LEDGERDISPLAYNAME:any;
  PartyLedger_COSTCENTERDISPLAYNAME:any;
  PartyLedger_SUMMARYREPORT:any;
  PartyLedger_HIDENARATION:any;
  PartyLedger_HIDEVOUCHERTYPE:any;
  PartyLedger_SHOWITEMDETAIL:any;
  PartyLedger_INCLUDEPOSTDATE:any;
  PartyLedger_HIDECOSTCENTER:any;
  PartyLedger_multipleGroupAccounts:any[];
  PartyLedger_multipleGroupACCName:string;
  PartyLedger_GroupAccount: string;
  

  SummaryLedger_DATE1: string;
  SummaryLedger_DATE2: string;
  SummaryLedger_BSDATE1: string;
  SummaryLedger_BSDATE2: string;
  SummaryLedger_DIV: string;
  SummaryLedger_CostCenter: string;
  SummaryLedger_ReportType: any;
  SummaryLedger_selectedNode: any;
  SummaryLedger_showAllContacts: boolean;
  SummaryLedger_multipleCostcenter: any[];
  SummaryLedger_DIVISIONNAME:any;
  SummaryLedger_GROUPDISPLAYNAME:any;
  SummaryLedger_COSTCENTERDISPLAYNAME:any;
  SummaryLedger_REPORTOPTIONDISPLAYNAME:any;

  SummaryPartyLedger_DATE1: string;
  SummaryPartyLedger_DATE2: string;
  SummaryPartyLedger_BSDATE1: string;
  SummaryPartyLedger_BSDATE2: string;
  SummaryPartyLedger_DIV: string;
  SummaryPartyLedger_CostCenter: string;
  SummaryPartyLedger_ReportType: any;
  SummaryPartyLedger_selectedNode: any;
  SummaryPartyLedger_multipleCostcenter: any[];
  SummaryPartyLedger_multipleAreas: any[];
  SummaryPartyLedger_AreaWise: any;
  SummaryPartyLedger_showAllContacts: boolean;
  SummaryPartyLedger_DIVISIONNAME:any;
  SummaryPartyLedger_GROUPDISPLAYNAME:any;
  SummaryPartyLedger_COSTCENTERDISPLAYNAME:any;
  SummaryPartyLedger_REPORTOPTIONDISPLAYNAME:any;

  Debtors_DATE1: string;
  Debtors_DATE2: string;
  Debtors_BSDATE1: string;
  Debtors_BSDATE2: string;
  Debtors_DIV: string;
  Debtors_CostCenter: string;
  Debtors_OPNINGBLONLY: any;
  Debtors_DIVISIONNAME:any;
  Debtors_COSTCENTERDISPLAYNAME:any;
  Debtors_SHOWBRANCHBL:any;
  Debtors_INCLUDEPOSTEDTRANSACTION:any
  Debtors_salesman:string;
  Debtors_salesman_ID:string;


  Creditors_DATE1: string;
  Creditors_DATE2: string;
  Creditors_BSDATE1: string;
  Creditors_BSDATE2: string;
  Creditors_DIV: string;
  Creditors_CostCenter: string;
  Creditors_OPNINGBLONLY: any;
  Creditors_DIVISIONNAME:any;
  Creditors_COSTCENTERDISPLAYNAME:any;
  Creditors_SHOWBRANCHBL:any;
  Creditors_INCLUDEPOSTEDTRANSACTION:any;

  DebtorsAgeing_DATE1: string;
  DebtorsAgeing_BSDATE1: string;
  DebtorsAgeing_DIV: string;
  DebtorsAgeing_CostCenter: string;
  DebtorsAgeing_DIVISIONNAME:any;
  DebtorsAgeing_COSTCENTERDISPLAYNAME:any;
  DebtorsAgeing_PartyCategory:any;
  DebtorsAgeing_SHOWBRANCHBL:any

  CreditorsAgeing_DATE1: string;
  CreditorsAgeing_BSDATE1: string;
  CreditorsAgeing_DIV: string;
  CreditorsAgeing_CostCenter: string;
  CreditorsAgeing_DIVISIONNAME:any;
  CreditorsAgeing_COSTCENTERDISPLAYNAME:any;
  CreditorsAgeing_SHOWBRANCHBL:any;
  CreditorsAgeing_PartyCategory:any;

  VoucherRegister_DATE1: string;
  VoucherRegister_DATE2: string;
  VoucherRegister_BSDATE1: string;
  VoucherRegister_BSDATE2: string;
  VoucherRegister_ACCNAME: string;
  VoucherRegister_ACCODE: string;
  VoucherRegister_ACID: string;
  VoucherRegister_DIV: string;
  VoucherRegister_DIVISIONNAME:any;
  VoucherRegister_COSTCENTERDISPLAYNAME:any;
  VoucherRegister_VTYPEDISPLAYNAME:any;

  CashBankBook_DATE1: string;
  CashBankBook_DATE2: string;
  CashBankBook_BSDATE1: string;
  CashBankBook_BSDATE2: string;
  CashBankBook_DIV: string;
  CashBankBook_DETAILREPORT: string;
  CashBankBook_DIVISIONNAME:any;
  CashBankBook_COSTCENTERDISPLAYNAME:any;
  CashBankBook_REPORTOPTIONDISPLAYNAME:any;
  CashBankBook_SUMMARYREPORTDISPLAYNAME:any;
  CashBankBook_INCLUDEPOSTDATE:any;

  DayBook_DATE1: string;
  DayBook_DATE2: string;
  DayBook_BSDATE1: string;
  DayBook_BSDATE2: string;
  DayBook_DIV: string;
  DayBook_VTYPE: string;
  DayBook_DETAILREPORT: string;
  DayBook_DIVISIONNAME:any;
  DayBook_VTYPEDISPLAYNAME:any;
  Daybook_FROM_VNO:number;
  Daybook_TO_VNO:number;
  Daybook_MultipleVoucher:any[];
  Daybook_MultipleVoucherId:any;
  DayBook_VTYPENAME:string;

  SubLedger_DATE1: string;
  SubLedger_DATE2: string;
  SubLedger_BSDATE1: string;
  SubLedger_BSDATE2: string;
  SubLedger_DIV: string;
  SubLedger_CostCenter: string;
  SubLedger_REPORTTYPE: string;
  SubLedger_ACCNAME: string;
  SubLedger_ACCODE: string;
  SubLedger_ACID: string;
  SubLedger_SHOWSUMMARYINTREE: any;
  SubLedger_LEDGERSEGREGATION: any;
  SubLedger_SL_ACID: string;
  SubLedger_SL_ACNAME: string;
  SubLedger_SHOWNDATE: any;
  SubLedger_DIVISIONNAME:any;
  SubLedger_COSTCENTERDISPLAYNAME:any;
  SubLedger_HIDECOSTCENTER:any;
  SubLedger_HIDENARATION:any;


  DebtorsOutstanding_DATE1: string;
  DebtorsOutstanding_BSDATE1: string;
  DebtorsOutstanding_DIV: string;
  DebtorsOutstanding_CostCenter: string;
  DebtorsOutstanding_AreaWise: any;
  DebtorsOutstanding_multipleAccounts: any[];
  DebtorsOutstanding_DIVISIONNAME:any;
  DebtorsOutstanding_COSTCENTERDISPLAYNAME:any;
  DebtorsOutstanding_INCLUDEPOSTEDTRANSACTION:any;

  CreditorsOutstanding_DATE1: string;
  CreditorsOutstanding_BSDATE1: string;
  CreditorsOutstanding_DIV: string;
  CreditorsOutstanding_CostCenter: string;
  CreditorsOutstanding_AreaWise: any;
  CreditorsOutstanding_multipleAccounts: any[];
  CreditorsOutstanding_DIVISIONNAME:any;
  CreditorsOutstanding_COSTCENTERDISPLAYNAME:any;
  CreditorsOutstanding_INCLUDEPOSTEDTRANSACTION:any;

  SubLedgerAcbase_DATE1: string;
  SubLedgerAcbase_DATE2: string;
  SubLedgerAcbase_BSDATE1: string;
  SubLedgerAcbase_BSDATE2: string;
  SubLedgerAcbase_DIV: string;
  SubLedgerAcbase_CostCenter: string;
  SubLedgerAcbase_REPORTTYPE: string;
  SubLedgerAcbase_ACCNAME: string;
  SubLedgerAcbase_ACCODE: string;
  SubLedgerAcbase_ACID: string;
  SubLedgerAcbase_SHOWSUMMARYINTREE: any;
  SubLedgerAcbase_LEDGERSEGREGATION: any;
  SubLedgerAcbase_SL_ACID: string;
  SubLedgerAcbase_SL_ACNAME: string;
  SubLedgerAcbase_SHOWNDATE: any;
  SubLedgerAcbase_DIVISIONNAME:any;
  SubLedgerAcbase_COSTCENTERDISPLAYNAME:any;

  TrialBalance_DATE1: string;
  TrialBalance_DATE2: string;
  TrialBalance_BSDATE1: string;
  TrialBalance_BSDATE2: string;
  TrialBalance_DIV: string;
  TrialBalance_CostCenter: string;
  TrialBalance_LEDGERWISE: any;
  TrialBalance_SUMMARYREPORT: any;
  TrialBalance_LEVELS: any;
  TrialBalance_SHOWOPENINGTRIALONLY: any;
  TrialBalance_SHOWSUBLEDGER: any;
  TrialBalance_SHOWDEBTORSCREDITORSDETAILS: any;
  TrialBalance_SHOWSTOCKVALUE: any;
  TrialBalance_SHOWCLOSINGONPY: any;
  TrialBalance_SHOWZEROBL: any;
  TrialBalance_NODEACID: string;
  TrialBalance_NODEACNAME: string;
  TrialBalance_COMPANYTYPE:string;
  TrialBalance_DIVISIONNAME:any;
  TrialBalance_COSTCENTERDISPLAYNAME:any;
  TrialBalance_REPORTOPTIONDISPLAYNAME:any;
  TrialBalance_SUMMARYREPORTDISPLAYNAME:any;

  AdditionalCostDetail_DATE1: string;
  AdditionalCostDetail_DATE2: string;
  AdditionalCostDetail_BSDATE1: string;
  AdditionalCostDetail_BSDATE2: string;
  AdditionalCostDetail_DIV: string;
  AdditionalCostDetail_VOUCHERNO: string;
  AdditionalCostDetail_ISSUMMARY: string;
  AdditionalCostDetail_ACID: string;
  AdditionalCostDetail_ACNAME: string;
  AdditionalCostDetail_DIVISIONNAME:any;
  AdditionalCostDetail_SUMMARYREPORTDISPLAYNAME:any;

  AdditionalCostSummary_DATE1: string;
  AdditionalCostSummary_DATE2: string;
  AdditionalCostSummary_BSDATE1: string;
  AdditionalCostSummary_BSDATE2: string;
  AdditionalCostSummary_DIV: string;
  AdditionalCostSummary_VOUCHERNO: string;
  AdditionalCostSummary_ISSUMMARY: string;
  AdditionalCostSummary_ACID: string;
  AdditionalCostSummary_ACNAME: string;
  AdditionalCostSummary_DIVISIONNAME:any;
  AdditionalCostSummary_SUMMARYREPORTDISPLAYNAME:any;

  SalesReturnSummary_DATE1: string;
  SalesReturnSummary_DATE2: string;
  SalesReturnSummary_BSDATE1: string;
  SalesReturnSummary_BSDATE2: string;
  SalesReturnSummary_DIV: string;

  SalesReturnSummaryRetailer_DATE1: string;
  SalesReturnSummaryRetailer_DATE2: string;
  SalesReturnSummaryRetailer_BSDATE1: string;
  SalesReturnSummaryRetailer_BSDATE2: string;
  SalesReturnSummaryRetailer_DIV: string;
  SalesReturnSummaryRetailer_SalesmanID: string;
  SalesReturnSummaryRetailer_Salesman: string;
  SalesReturnSummaryRetailer_RetailerName: string;
  SalesReturnSummaryRetailer_RetailerID: string;
  SalesReturnSummaryRetailer_MultipleSalesman: any[];
  SalesReturnSummaryRetailer_MultipleRetailer: any[];
  SalesReturnSummaryRetailer_EnableSalesman: boolean;
  SalesReturnSummaryRetailer_EnableRetailer: boolean;

  SalesReturnReportDetail_DATE1: string;
  SalesReturnReportDetail_DATE2: string;
  SalesReturnReportDetail_BSDATE1: string;
  SalesReturnReportDetail_BSDATE2: string;
  SalesReturnReportDetail_DIV: string;
  SalesReturnReportDetail_ProductID: string;
  SalesReturnReportDetail_ProductName: string;
  SalesReturnReportDetail_BrandID: string;
  SalesReturnReportDetail_BrandName: string;
  SalesReturnReportDetail_RetailerID: string;
  SalesReturnReportDetail_RetailerName: string;
  SalesReturnReportDetail_MultipleProduct: any[];
  SalesReturnReportDetail_EnableProduct: boolean;
  SalesReturnReportDetail_MultipleBrand: any[];
  SalesReturnReportDetail_EanbleBrand: boolean;
  SalesReturnReportDetail_MultipleRetailer: any[];
  SalesReturnReportDetail_EnableRetailer: boolean;

  StockValuationAccount_DATE1:string;
  StockValuationAccount_DATE2:string;
  StockValuationAccount_BSDATE1:string;
  StockValuationAccount_BSDATE2:string;
  StockValuationAccount_DIV:string;
  StockValuationAccount_MCODE:string;
  StockValuationAccount_SHOWDETAIL:any;
  StockValuationAccount_ITEM:string;
  StockValuationAccount_MENUCODE:string;
  StockValuationAccount_BARCODE:string;
  
  StockLedgerReportAcc_DATE1:string;
  StockLedgerReportAcc_DATE2:string;
  StockLedgerReportAcc_BSDATE1:string;
  StockLedgerReportAcc_BSDATE2:string;
  StockLedgerReportAcc_DIV:string;
  StockLedgerReportAcc_MCODE:string;
  StockLedgerReportAcc_WAREHOUSE:string;
  StockLedgerReportAcc_ITEMGROUPWISE:any;
  StockLedgerReportAcc_ITEMGROUP:string;
  StockLedgerReportAcc_SHOWDETAIL:any;
  StockLedgerReportAcc_ITEM:string;
  StockLedgerReportAcc_MENUCODE:string;
  StockLedgerReportAcc_BARCODE:string;
  StockLedgerReportAcc_VARIANT:any;
  StockLedgerReportAcc_VARIANTVALUES:any;
  StockLedgerReportAcc_SHOWVARIANT:any;
  StockLedgerReportAcc_SHOWBATCHWISE:any;
  
  StockSummaryAccount_DATE1:string;
  StockSummaryAccount_DATE2:string;
  StockSummaryAccount_BSDATE1:string;
  StockSummaryAccount_BSDATE2:string;
  StockSummaryAccount_DIV:string;
  StockSummaryAccount_DETAILFORMAT:any;
  StockSummaryAccount_SUPPLIERCODE:string;
  StockSummaryAccount_SUPPLIER:string;
  StockSummaryAccount_MCODE:string;
  StockSummaryAccount_ITEM:string;
  StockSummaryAccount_MENUCODE:string;
  StockSummaryAccount_REPORTTYPE:any;
  StockSummaryAccount_ReportMode:any;
  StockSummaryAccount_ShowItemInGroupWiseReport:any;
  StockSummaryAccount_WAREHOUSE:string;
  StockSummaryAccount_MGROUP:string;
  StockSummaryAccount_PTYPE:any;
  StockSummaryAccount_MCAT:string;
  StockSummaryAccount_BARCODE:string;
  StockSummaryAccount_SHOWDETAIL:any;
  StockSummaryAccount_VARIANT:any;
  StockSummaryAccount_VARIANTVALUES:any;
  StockSummaryAccount_SHOWBATCHWISE:any;
  StockSummaryAccount_SHOWALTUNIT:any;
  StockSummaryAccount_SHOWVARIANT:any;
  StockSummaryAccount_SHOWGROUPING:any;
  StockSummaryAccount_BRANDID:any;
  StockSummaryAccount_BRANDNAME:any;

  CurrentStockWarehouseWiseAccount_DATE1:string;
  CurrentStockWarehouseWiseAccount_DATE2:string;
  CurrentStockWarehouseWiseAccount_BSDATE1:string;
  CurrentStockWarehouseWiseAccount_BSDATE2:string;
  CurrentStockWarehouseWiseAccount_DIV:string;
  CurrentStockWarehouseWiseAccount_COMPANY:string;
  CurrentStockWarehouseWiseAccount_WAREHOUSETYPE:string;
  CurrentStockWarehouseWiseAccount_WAREHOUSE:string;
  CurrentStockWarehouseWiseAccount_SHOWBATCHWISE:any;

  StockAbcAnalysisAccount_DATE1:string;
  StockAbcAnalysisAccount_DATE2:string;
  StockAbcAnalysisAccount_BSDATE1:string;
  StockAbcAnalysisAccount_BSDATE2:string;
  StockAbcAnalysisAccount_DIV:string;
  StockAbcAnalysisAccount_SUPPLIERCODE:string;
  StockAbcAnalysisAccount_SUPPLIER:string;
  StockAbcAnalysisAccount_MCODE:string;
  StockAbcAnalysisAccount_ITEM:string;
  StockAbcAnalysisAccount_MENUCODE:string;
  StockAbcAnalysisAccount_REPORTTYPE:any;
  StockAbcAnalysisAccount_ShowItemInGroupWiseReport:any;
  StockAbcAnalysisAccount_WAREHOUSE:string;
  StockAbcAnalysisAccount_MGROUP:string;
  StockAbcAnalysisAccount_PTYPE:any;
  StockAbcAnalysisAccount_MCAT:string;
  StockAbcAnalysisAccount_VARIANT:any;
  StockAbcAnalysisAccount_VARIANTVALUES:any;

  Consolidated_TrialBalance_DATE1: string;
  Consolidated_TrialBalance_DATE2: string;
  Consolidated_TrialBalance_BSDATE1: string;
  Consolidated_TrialBalance_BSDATE2: string;
  Consolidated_TrialBalance_DIV: string;
  Consolidated_TrialBalance_CostCenter: string;
  Consolidated_TrialBalance_LEDGERWISE: any;
  Consolidated_TrialBalance_LEVELS: any;
  Consolidated_TrialBalance_SHOWOPENINGTRIALONLY: any;
  Consolidated_TrialBalance_SHOWSUBLEDGER: any;
  Consolidated_TrialBalance_SHOWDEBTORSCREDITORSDETAILS: any;
  Consolidated_TrialBalance_SHOWSTOCKVALUE: any;
  Consolidated_TrialBalance_SHOWZEROBL: any;
  Consolidated_TrialBalance_DIVISIONNAME:any;
  Consolidated_TrialBalance_COSTCENTERDISPLAYNAME:any;

  TDS_DATE1: string;
  TDS_DATE2: string;
  TDS_BSDATE1: string;
  TDS_BSDATE2: string;
  TDS_DIV: string;
  TDS_TDSNAME:any;
  TDS_TDSID: any;
  TDS_REPORTTYPE:any;
  TDS_DIVISIONNAME:any;
  TDS_PARTYNAME:any;
  TDS_PARTYID:any;
  TDS_ISIRDFORMAT :any;
  TDS_SL_ACID:any;
  TDS_SL_ACNAME:any;

  DebtorsReport_AreaWise:any;
  DebtorsReport_AreaWiseDisplayName:any;
  DebtorsReport_PartyGroup:any;
  DebtorsReport_PartyGroupDisplayName:any;
  DebtorsReport_PartyCategory:any;
  DebtorsReport_PartyCategoryDisplayName:any;
  CreditorsReport_AreaWise:any;
  CreditorsReport_AreaWiseDisplayName:any;
  CreditorsReport_PartyGroup:any;
  CreditorsReport_PartyGroupDisplayName:any;
  CreditorsReport_PartyCategory:any;
  CreditorsReport_PartyCategoryDisplayName:any;
  DebtorsAgeing_AreaWise:any;
  DebtorsAgeing_PartyGroup:any;
  CreditorsAgeing_AreaWise:any;
  CreditorsAgeing_PartyGroup:any;
  DebtorsOutstanding_PartyGroup:any;
  CreditorsOutstanding_PartyGroup:any;
  DebtorsOutstanding_AreaWiseInSummary:any;
  CreditorsOutstanding_AreaWiseInSummary:any;
  CreditorsAgeingObj_INCLUDEPOSTEDTRANSACTION:any;
  DebtorsAgeingObj_INCLUDEPOSTEDTRANSACTION:any;
  

  ProfitLoss_DATE1: string;
  ProfitLoss_DATE2: string;
  ProfitLoss_BSDATE1: string;
  ProfitLoss_BSDATE2: string;
  ProfitLoss_DIV: string;
  ProfitLoss_SHOWSUBLEDGER: any;
  ProfitLoss_COMPANYTYPE:string;
  ProfitLoss_DIVISIONNAME:any;
  ProfitLoss_OSTOCK:any;
  ProfitLoss_CSTOCK:any;
  ProfitLoss_VERTICALFORMAT:any;
  ProfitLoss_CostCenter: any;
  ProfitLoss_COSTCENTERDISPLAYNAME:any;

  BalanceSheet_DATE1: string;
  BalanceSheet_DATE2: string;
  BalanceSheet_BSDATE1: string;
  BalanceSheet_BSDATE2: string;
  BalanceSheet_DIV: string;
  BalanceSheet_SHOWSUBLEDGER: any;
  BalanceSheet_COMPANYTYPE:string;
  BalanceSheet_DIVISIONNAME:any;
  BalanceSheet_OSTOCK:any;
  BalanceSheet_CSTOCK:any;
  BalanceSheet_VERTICALFORMAT:any;
  BalanceSheet_SHOWDEBTORSCREDITORS: any;
  BalanceSheet_CostCenter: any;
  BalanceSheet_COSTCENTERDISPLAYNAME:any;

  Consolidated_BalanceSheet_DATE1: string;
  Consolidated_BalanceSheet_DATE2: string;
  Consolidated_BalanceSheet_BSDATE1: string;
  Consolidated_BalanceSheet_BSDATE2: string;
  Consolidated_BalanceSheet_SHOWTOTALINGROUP: any;
  Consolidated_BalanceSheet_COMPANYTYPE:string;
  Consolidated_BalanceSheet_SHOWDEBTORSCREDITORS: any;

  Consolidated_ProfitLoss_DATE1: string;
  Consolidated_ProfitLoss_DATE2: string;
  Consolidated_ProfitLoss_BSDATE1: string;
  Consolidated_ProfitLoss_BSDATE2: string;
  Consolidated_ProfitLoss_SHOWTOTALINGROUP: any;
  Consolidated_ProfitLoss_COMPANYTYPE:string;

  DebtorsReport_INCLUDEPOSTDATE:any;
  CreditorsReport_INCLUDEPOSTDATE:any;

  BillTracking_DATE1: string;
  BillTracking_DATE2: string;
  BillTracking_BSDATE1: string;
  BillTracking_BSDATE2: string;
  BillTracking_ACCNAME: string;
  BillTracking_ACID: string;
  BillTracking_DIV: string;
  BillTracking_CostCenter: string;
  BillTracking_VoucherType:string;
  BillTracking_DIVISIONNAME:any;
  BillTracking_COSTCENTERDISPLAYNAME:any;
  BillTracking_Detail:any;

  CreditorsBillTracking_DATE1: string;
  CreditorsBillTracking_DATE2: string;
  CreditorsBillTracking_BSDATE1: string;
  CreditorsBillTracking_BSDATE2: string;
  CreditorsBillTracking_ACCNAME: string;
  CreditorsBillTracking_ACID: string;
  CreditorsBillTracking_DIV: string;
  CreditorsBillTracking_CostCenter: string;
  CreditorsBillTracking_VoucherType:string;
  CreditorsBillTracking_DIVISIONNAME:any;
  CreditorsBillTracking_COSTCENTERDISPLAYNAME:any;
  CreditorsBillTracking_Detail:any;

  PostDatedCheque_DATE1: string;
  PostDatedCheque_DATE2: string;
  PostDatedCheque_BSDATE1: string;
  PostDatedCheque_BSDATE2: string;
  PostDatedCheque_DIV: string;
  PostDatedCheque_CostCenter: string;
  PostDatedCheque_DIVISIONNAME:any;
  PostDatedCheque_COSTCENTERDISPLAYNAME:any;
  // PostDatedCheque_CDATE1: string;
  // PostDatedCheque_CDATE2: string;
  PostDatedCheque_CBSDATE1: string;
  PostDatedCheque_CBSDATE2: string;
  PostDatedCheque_TRANTYPE: any;
  PostDatedCheque_PARTYTYPE: any;
  PostDatedCheque_DETAILSREPORT: any;
  PostDatedCheque_TRANSACTIONMODE: any;
  PostDatedCheque_CHEQUEDATEWISEREPORT: any;
  PostDatedCheque_REALIZEDAYS: any;
  // PostDatedCheque_TDATE1:string;
  // PostDatedCheque_TDATE2:string;
  PostDatedCheque_BANKNAME:any
  PostDatedCheque_BANKID:any;
  PostDatedCheque_PARTYID:any;
  PostDatedCheque_PARTYNAME:any;


  MonthlySalesPayment_DATE1: string;
  MonthlySalesPayment_DATE2: string;
  MonthlySalesPayment_BSDATE1: string;
  MonthlySalesPayment_BSDATE2: string;
  MonthlySalesPayment_DIV: string;
  MonthlySalesPayment_DIVISIONAME:any;
  MonthlySalesPayment_ACCNAME: string;
  MonthlySalesPayment_ACID:string;
  MonthlySalesPayment_REPORTOPTIONDISPLAYNAME:any;


  LocalPurchaseCostAllocation_DATE1: string;
  LocalPurchaseCostAllocation_DATE2: string;
  LocalPurchaseCostAllocation_BSDATE1: string;
  LocalPurchaseCostAllocation_BSDATE2: string;
  LocalPurchaseCostAllocation_ACCNAME: string;
  LocalPurchaseCostAllocation_ACID:string;
  LocalPurchaseCostAllocation_PI_VOUCHERNO:string;
  LocalPurchaseCostAllocation_REPORTMODE :any;
  LocalPurchaseCostAllocation_CAPITALPURCHASE_VCHRNO:string;
  LocalPurchaseCostAllocation_REPORTOPTIONDISPLAYNAME:any;



  StockAgeing_AGE1:any;
 StockAgeing_AGE2:any;
 StockAgeing_AGE3:any;
 StockAgeing_AGE4:any;
 StockAgeing_AGE5:any;
 StockAgeing_AGE6:any;
 StockAgeing_AGE7:any;
 StockAgeing_AGE8:any;
 StockAgeing_AGE9:any;
 StockAgeing_AGE10:any;


 ActualVsBudget_DATE1;
 ActualVsBudget_BSDATE1;
 ActualVsBudget_DATE2;
 ActualVsBudget_BSDATE2;
 ActualVsBudget_DIV;
 ActualVsBudget_CostCenter;
//  ActualVsBudget_ShowZeroVarianceOnly;
//  ActualVsBudget_ShowInPercent;
//  ActualVsBudget_ShowInAmount;
//  ActualVsBudget_OverBudget;
//  ActualVsBudget_UnderBudget;
 ActualVsBudget_OVERVIEWREPORT;
 ActualVsBudget_ACTUALVSBUDGETREPORT;
 ActualVsBudget_AccLedger_ACCNAME;
 ActualVsBudget_AccLedger_ACID
 ActualVsBudget_Budget_Name;
 ActualVsBudget_Budget_Num

 ActualVsBudget_DATETYPE;
 ActualVsBudget_CheckOption;

 ActualVsBudget_REPORTOPTION;
 ActualVsBudget_BUDGETSELECTION;
 ActualVsBudget_DIVISIONNAME;
 ActualVsBudget_COSTCENTERNAME;
 ActualVsBudget_REPORTOPTIONDISPLAYNAME;
 


}