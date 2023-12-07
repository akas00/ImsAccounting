import { Component, ViewChild, OnInit, Injectable, Inject, HostListener } from '@angular/core';
import { ReportFilterComponent, ReportFilterOption } from '../../../common/popupLists/report-filter/report-filter.component';
import { BalanceSheetService } from './balance-sheet.service';
import { CacheService } from '../../../common/services/permission';
import { AlertService } from '../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { EventListenerService } from '../event-listener.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'balance-sheet',
    templateUrl: './balance-sheet.component.html',
})

export class BalanceSheetComponent implements OnInit {

    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    public reportType: string = "BS"
    public companyProfile: any

    public selectedRowIndex = 0;
    showReportListDialog: boolean;
    previouslyLoadedReportsList: any[] = [];

    constructor(private activatedRoute: ActivatedRoute,private eventListener: EventListenerService, private _reportFilterService: ReportFilterService, private _alertService: AlertService, private _spinnerService: SpinnerService, private _balanceSheetService: BalanceSheetService, private _cacheService: CacheService,
        private arouter: Router, private _reportMainService: ReportMainService) {
        this.companyProfile = this._cacheService.get('USER_PROFILE')

    }


    ngOnInit() {
        if (!this._reportFilterService.ReportFilterObj.isBSLoaded) {
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
        this._reportFilterService.exportTableToExcel("balanceSheet", "Balance Sheet")

    }
    print() {
        this._reportFilterService.print()

    }



    queryAndLoadData(filterParams) {
        this._spinnerService.show("Please Wait. Generating Balance Sheet")
        this._balanceSheetService.getBalanceSheetData(filterParams).subscribe((res) => {
            this._reportFilterService.ReportFilterObj.assets = res.result.assets;
            this._reportFilterService.ReportFilterObj.liabilities = res.result.liabilities;
            this.calculateLengthOfATLB(res.result.assets, res.result.liabilities)
            this._reportFilterService.ReportFilterObj.netLoss = res.result.netLoss;
            this._reportFilterService.ReportFilterObj.netProfit = res.result.netProfit;
            this._reportFilterService.ReportFilterObj.differenceInClosingBalance = res.result.differenceInClosingBalance;
            this._reportFilterService.ReportFilterObj.differenceInOpeningBalance = res.result.differenceInOpeningBalance;
            this._reportFilterService.ReportFilterObj.asstesTotal = res.result.asstesTotal;
            this._reportFilterService.ReportFilterObj.liabilitiesTotal = res.result.liabilitiesTotal;
            this._reportFilterService.ReportFilterObj.isBSLoaded = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
                ////console.log("@@activeurlpath2", activeurlpath2)
            }
            let abc = this._reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Balance Sheet');
            if (abc >= 0) {
                this._reportMainService.previouslyLoadedReportList.splice(abc, 1)
            }
            this._reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Balance Sheet',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2
                });
            this._spinnerService.hide()
        }, error => {
            this._spinnerService.hide()
            this._alertService.error(error)
        })
    }

    calculateLengthOfATLB(asssets: [], liabilities: []) {
        if (asssets.length >= liabilities.length) {
            this._reportFilterService.ReportFilterObj.lengthOfATLB = Array(asssets.length).fill(0).map((x, i) => i)
        } else {
            this._reportFilterService.ReportFilterObj.lengthOfATLB = Array(liabilities.length).fill(0).map((x, i) => i)
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


    @HostListener("document : keydown", ["$event"])
    updown($event: KeyboardEvent) {
        if ($event.code == "ArrowDown") {
            this.selectedRowIndex++
            $event.preventDefault();
            if (this.selectedRowIndex == this._reportFilterService.ReportFilterObj.lengthOfATLB.length) {
                this.selectedRowIndex = this._reportFilterService.ReportFilterObj.lengthOfATLB.length - 1;
            }
        } else if ($event.code == "ArrowUp") {
            $event.preventDefault();
            this.selectedRowIndex--
            if (this.selectedRowIndex == -1) {
                this.selectedRowIndex = 0;
            }
        } else if ($event.code == "Enter" &&
            this.selectedRowIndex >= 0 &&
            this.selectedRowIndex < this._reportFilterService.ReportFilterObj.lengthOfATLB.length) {
            $event.preventDefault()
        }
    }

    drillDown(from: string, selectedRowIndex) {
        if (from === 'AT' && selectedRowIndex <= this._reportFilterService.ReportFilterObj.assets.length) {
            this._reportFilterService.ReportFilterObj.ACID = this._reportFilterService.ReportFilterObj.assets[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.ACCNAME = this._reportFilterService.ReportFilterObj.assets[selectedRowIndex].ACNAME;
            this._reportFilterService.ReportFilterObj.isLedgerWise = this._reportFilterService.ReportFilterObj.assets[selectedRowIndex]['TYPE'] === 'G' ? false : true;
            this._reportFilterService.ReportFilterObj.ledgerType = this._reportFilterService.ReportFilterObj.assets[selectedRowIndex]['TYPE'] === 'G' ? 'GROUP' : 'ACCOUNT';
            this._reportFilterService.ReportFilterObj.ACCODE = this._reportFilterService.ReportFilterObj.assets[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.IsSubLedger = this._reportFilterService.ReportFilterObj.assets[selectedRowIndex]['IsSLedger'];
        if( this._reportFilterService.ReportFilterObj.ACID && this._reportFilterService.ReportFilterObj.ACID.startsWith("PA") ){
            this._reportFilterService.ReportFilterObj.ACIDwithPA=true;
                }else{
                  this._reportFilterService.ReportFilterObj.ACIDwithPA=false;
                }
            this._reportFilterService.drillDown('BS', this.activatedRoute.snapshot['_routerState'].url)

        } else if (from === 'LB' && selectedRowIndex <= this._reportFilterService.ReportFilterObj.liabilities.length) {
            this._reportFilterService.ReportFilterObj.ACID = this._reportFilterService.ReportFilterObj.liabilities[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.ACCNAME = this._reportFilterService.ReportFilterObj.liabilities[selectedRowIndex].ACNAME;
            this._reportFilterService.ReportFilterObj.isLedgerWise = this._reportFilterService.ReportFilterObj.liabilities[selectedRowIndex]['TYPE'] === 'G' ? false : true;
            this._reportFilterService.ReportFilterObj.ledgerType = this._reportFilterService.ReportFilterObj.liabilities[selectedRowIndex]['TYPE'] === 'G' ? 'GROUP' : 'ACCOUNT';
            this._reportFilterService.ReportFilterObj.ACCODE = this._reportFilterService.ReportFilterObj.liabilities[selectedRowIndex].ACID;
            this._reportFilterService.ReportFilterObj.IsSubLedger = this._reportFilterService.ReportFilterObj.liabilities[selectedRowIndex]['IsSLedger'];
        if( this._reportFilterService.ReportFilterObj.ACID && this._reportFilterService.ReportFilterObj.ACID.startsWith("PA") ){
            this._reportFilterService.ReportFilterObj.ACIDwithPA=true;
                }else{
                  this._reportFilterService.ReportFilterObj.ACIDwithPA=false;
                }
            this._reportFilterService.drillDown('BS', this.activatedRoute.snapshot['_routerState'].url)
        }
    }
}