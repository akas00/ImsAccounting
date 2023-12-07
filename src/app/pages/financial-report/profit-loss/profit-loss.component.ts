import { Component, ViewChild, OnInit, HostListener, ElementRef } from '@angular/core';
import { ReportFilterComponent, ReportFilterOption } from '../../../common/popupLists/report-filter/report-filter.component';
import { ProfitLossService } from './profit-loss.service';
import { AuthService, CacheService } from '../../../common/services/permission';
import { AlertService } from '../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { EventListenerService } from '../event-listener.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';

@Component({
    selector: 'profit-loss',
    templateUrl: './profit-loss.component.html',
})

export class ProfitLossComponent implements OnInit {

    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    public reportType: string = "PL"
    public companyProfile: any;
    showReportListDialog: boolean;
    previouslyLoadedReportsList: any[] = [];
    userSetting: any;

    constructor(private activatedRoute: ActivatedRoute, private eventListener: EventListenerService, private _reportFilterService: ReportFilterService, private _alertService: AlertService, private _spinnerService: SpinnerService, private _profitLossService: ProfitLossService, private _cacheService: CacheService,
        private arouter: Router, private _reportMainService: ReportMainService, private _authService: AuthService) {
        this.companyProfile = this._cacheService.get('USER_PROFILE')
        this.userSetting = _authService.getSetting();

    }
    ngOnInit() {
        if (!this._reportFilterService.ReportFilterObj.isPlLoaded) {
            this.reportFilter.show();
        }
        this.eventListener.onreportObjectChange.subscribe((data: any) => {
            this._reportFilterService.ReportFilterObj = data;
        })
        this.previouslyLoadedReportsList = this._reportMainService.previouslyLoadedReportList;
    }

    applyFilter(filterParams) {
        this.queryAndLoadData(filterParams)
        this.reportFilter.popupClose()
    }


    ExportReportInExcel() {
        this._reportFilterService.exportTableToExcel("profitAndLossAccount", "Profit-Loss")
    }
    print() {
        this._reportFilterService.print()
    }
    queryAndLoadData(filterParams) {
        this._spinnerService.show("Please Wait. Loading Data For Profit and Loss")
        this._profitLossService.getProfitLossData(filterParams).subscribe((res) => {
            this._reportFilterService.ReportFilterObj.directIncome = res.result.directIncome;
            this._reportFilterService.ReportFilterObj.directExpense = res.result.directExpense;
            this.calcLengthOfIncomeExpense(res.result.directIncome, res.result.directExpense)
            this._reportFilterService.ReportFilterObj.directIncomeTotal = res.result.directIncomeTotal;
            this._reportFilterService.ReportFilterObj.directExpenseTotal = res.result.directExpenseTotal;
            this._reportFilterService.ReportFilterObj.directIncomeExpenseTotal = res.result.directIncomeExpenseTotal;
            this._reportFilterService.ReportFilterObj.grossProfitCD = res.result.grossProfitCD;
            this._reportFilterService.ReportFilterObj.grossLossCD = res.result.grossLossCD;
            this._reportFilterService.ReportFilterObj.indirectIncome = res.result.indirectIncome;
            this._reportFilterService.ReportFilterObj.indirectExpense = res.result.indirectExpense;
            this.calcLengthOfIndirectIncomeExpense(res.result.indirectIncome, res.result.indirectExpense)
            this._reportFilterService.ReportFilterObj.netLoss = res.result.netLoss;
            this._reportFilterService.ReportFilterObj.netProfit = res.result.netProfit;
            this._reportFilterService.ReportFilterObj.indirectIncomeExpenseTotal = res.result.indirectIncomeExpenseTotal;
            this._reportFilterService.ReportFilterObj.isPlLoaded = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
                ////console.log("@@activeurlpath2", activeurlpath2)
            }
            let abc = this._reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Profit & Loss A/C');
            if (abc >= 0) {
                this._reportMainService.previouslyLoadedReportList.splice(abc, 1)
            }
            this._reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Profit & Loss A/C',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2
                });
            this._spinnerService.hide()
        }, error => {
            this._spinnerService.hide()
            this._alertService.error(error)
        })
    }

    calcLengthOfIncomeExpense(income: [], expense: []) {
        if (income.length > expense.length) {
            this._reportFilterService.ReportFilterObj.lengthOfIncomeExpense = Array(income.length).fill(0).map((x, i) => i)
        } else {
            this._reportFilterService.ReportFilterObj.lengthOfIncomeExpense = Array(expense.length).fill(0).map((x, i) => i)
        }
    }
    calcLengthOfIndirectIncomeExpense(indirectIncome: [], indirectExpense: []) {
        if (indirectIncome.length > indirectExpense.length) {
            this._reportFilterService.ReportFilterObj.lengthOfIndirectIncomeExpense = Array(indirectIncome.length).fill(0).map((x, i) => i)
        } else {
            this._reportFilterService.ReportFilterObj.lengthOfIndirectIncomeExpense = Array(indirectExpense.length).fill(0).map((x, i) => i)
        }
    }
    drillDown(from: string, selectedRowIndex) {
        if (from === 'DE' && selectedRowIndex <= this._reportFilterService.ReportFilterObj.directExpense.length) {
            this._reportFilterService.ReportFilterObj.ACID = this._reportFilterService.ReportFilterObj.directExpense[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.ACCNAME = this._reportFilterService.ReportFilterObj.directExpense[selectedRowIndex].ACNAME;
            this._reportFilterService.ReportFilterObj.isLedgerWise = this._reportFilterService.ReportFilterObj.directExpense[selectedRowIndex]['TYPE'] === 'G' ? false : true;
            this._reportFilterService.ReportFilterObj.ledgerType = this._reportFilterService.ReportFilterObj.directExpense[selectedRowIndex]['TYPE'] === 'G' ? 'GROUP' : 'ACCOUNT';
            this._reportFilterService.ReportFilterObj.ACCODE = this._reportFilterService.ReportFilterObj.directExpense[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.IsSubLedger = this._reportFilterService.ReportFilterObj.directExpense[selectedRowIndex]['IsSLedger'];
        if( this._reportFilterService.ReportFilterObj.ACID && this._reportFilterService.ReportFilterObj.ACID.startsWith("PA") ){
            this._reportFilterService.ReportFilterObj.ACIDwithPA=true;
                }else{
                  this._reportFilterService.ReportFilterObj.ACIDwithPA=false;
                }
            this._reportFilterService.drillDown('PL', this.activatedRoute.snapshot['_routerState'].url);

        } else if (from === 'INE' && selectedRowIndex <= this._reportFilterService.ReportFilterObj.indirectExpense.length) {
            this._reportFilterService.ReportFilterObj.ACID = this._reportFilterService.ReportFilterObj.indirectExpense[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.ACCNAME = this._reportFilterService.ReportFilterObj.indirectExpense[selectedRowIndex].ACNAME;
            this._reportFilterService.ReportFilterObj.isLedgerWise = this._reportFilterService.ReportFilterObj.indirectExpense[selectedRowIndex]['TYPE'] === 'G' ? false : true;
            this._reportFilterService.ReportFilterObj.ledgerType = this._reportFilterService.ReportFilterObj.indirectExpense[selectedRowIndex]['TYPE'] === 'G' ? 'GROUP' : 'ACCOUNT';
            this._reportFilterService.ReportFilterObj.ACCODE = this._reportFilterService.ReportFilterObj.indirectExpense[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.IsSubLedger = this._reportFilterService.ReportFilterObj.indirectExpense[selectedRowIndex]['IsSLedger'];
        if( this._reportFilterService.ReportFilterObj.ACID && this._reportFilterService.ReportFilterObj.ACID.startsWith("PA") ){
            this._reportFilterService.ReportFilterObj.ACIDwithPA=true;
                }else{
                  this._reportFilterService.ReportFilterObj.ACIDwithPA=false;
                }
            this._reportFilterService.drillDown('PL', this.activatedRoute.snapshot['_routerState'].url)

        } else if (from === 'DI' && selectedRowIndex <= this._reportFilterService.ReportFilterObj.directIncome.length) {
            this._reportFilterService.ReportFilterObj.ACID = this._reportFilterService.ReportFilterObj.directIncome[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.ACCNAME = this._reportFilterService.ReportFilterObj.directIncome[selectedRowIndex].ACNAME;
            this._reportFilterService.ReportFilterObj.isLedgerWise = this._reportFilterService.ReportFilterObj.directIncome[selectedRowIndex]['TYPE'] === 'G' ? false : true;
            this._reportFilterService.ReportFilterObj.ledgerType = this._reportFilterService.ReportFilterObj.directIncome[selectedRowIndex]['TYPE'] === 'G' ? 'GROUP' : 'ACCOUNT';
            this._reportFilterService.ReportFilterObj.ACCODE = this._reportFilterService.ReportFilterObj.directIncome[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.IsSubLedger = this._reportFilterService.ReportFilterObj.directIncome[selectedRowIndex]['IsSLedger'];
        if( this._reportFilterService.ReportFilterObj.ACID && this._reportFilterService.ReportFilterObj.ACID.startsWith("PA") ){
            this._reportFilterService.ReportFilterObj.ACIDwithPA=true;
                }else{
                  this._reportFilterService.ReportFilterObj.ACIDwithPA=false;
                }
            this._reportFilterService.drillDown('PL', this.activatedRoute.snapshot['_routerState'].url)

        } else if (from === 'INI' && selectedRowIndex <= this._reportFilterService.ReportFilterObj.indirectIncome.length) {
            this._reportFilterService.ReportFilterObj.ACID = this._reportFilterService.ReportFilterObj.indirectIncome[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.ACCNAME = this._reportFilterService.ReportFilterObj.indirectIncome[selectedRowIndex].ACNAME;
            this._reportFilterService.ReportFilterObj.isLedgerWise = this._reportFilterService.ReportFilterObj.indirectIncome[selectedRowIndex]['TYPE'] === 'G' ? false : true;
            this._reportFilterService.ReportFilterObj.ledgerType = this._reportFilterService.ReportFilterObj.indirectIncome[selectedRowIndex]['TYPE'] === 'G' ? 'GROUP' : 'ACCOUNT';
            this._reportFilterService.ReportFilterObj.ACCODE = this._reportFilterService.ReportFilterObj.indirectIncome[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.IsSubLedger = this._reportFilterService.ReportFilterObj.indirectIncome[selectedRowIndex]['IsSLedger'];
        if( this._reportFilterService.ReportFilterObj.ACID && this._reportFilterService.ReportFilterObj.ACID.startsWith("PA") ){
            this._reportFilterService.ReportFilterObj.ACIDwithPA=true;
                }else{
                  this._reportFilterService.ReportFilterObj.ACIDwithPA=false;
                }
            this._reportFilterService.drillDown('PL', this.activatedRoute.snapshot['_routerState'].url)
        }
    }

    loadFilter() {
        this.reportFilter.show()
    }

    showPreviouslyLoadedReports() {
        this.showReportListDialog = true;
    }

    CancelReportList() {
        this.showReportListDialog = false;
    }

}