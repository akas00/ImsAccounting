import { Component, ViewChild, OnInit, HostListener, ElementRef } from '@angular/core';
import { ReportFilterComponent, ReportFilterOption } from '../../../common/popupLists/report-filter/report-filter.component';
import { TrialBalanceService } from './trial-balance.service';
import { CacheService } from '../../../common/services/permission';
import { AlertService } from '../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { EventListenerService } from '../event-listener.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';


@Component({
    selector: 'trial-balance',
    templateUrl: './trial-balance.component.html',
})

export class TrialBalanceComponent implements OnInit {

    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    @ViewChild('tblTable') tblTable: ElementRef
    public reportType: string = "TBL"
    public trialBalanceData = []
    public companyProfile: any;
    showReportListDialog: boolean;
    previouslyLoadedReportsList: any[] = [];
    isOnlyOpeningBalanceMode: boolean = false;

    constructor(private eventListener: EventListenerService, private activatedRoute: ActivatedRoute,
        private _reportFilterService: ReportFilterService, private _alertService: AlertService, private _spinnerService: SpinnerService, private _trialBlService: TrialBalanceService, private _cacheService: CacheService,
        private arouter: Router, private _reportMainService: ReportMainService) {
        this.companyProfile = this._cacheService.get('USER_PROFILE')

    }

    ngOnInit() {
        if (!this._reportFilterService.ReportFilterObj.isTBLDataLoaded) {
            this.reportFilter.show();
        }
        this.eventListener.onreportObjectChange.subscribe((data: any) => {
            this._reportFilterService.ReportFilterObj = data;
            this._reportFilterService.ReportFilterObj.isTBLDataLoaded = true;
        })

        this.previouslyLoadedReportsList = this._reportMainService.previouslyLoadedReportList;

    }
    loadFilter() {
        this.reportFilter.show()
    }

    getHeaderWidth() {
        if (
            (this._reportFilterService.ReportFilterObj.showTransaction && !this._reportFilterService.ReportFilterObj.showClosingBalance && !this._reportFilterService.ReportFilterObj.showOpeningBalance)
            || (!this._reportFilterService.ReportFilterObj.showTransaction && !this._reportFilterService.ReportFilterObj.showClosingBalance && this._reportFilterService.ReportFilterObj.showOpeningBalance)
            || (!this._reportFilterService.ReportFilterObj.showTransaction && this._reportFilterService.ReportFilterObj.showClosingBalance && !this._reportFilterService.ReportFilterObj.showOpeningBalance)) {
            return 80;
        } else if (
            (this._reportFilterService.ReportFilterObj.showTransaction && this._reportFilterService.ReportFilterObj.showClosingBalance && !this._reportFilterService.ReportFilterObj.showOpeningBalance)
            || (this._reportFilterService.ReportFilterObj.showTransaction && !this._reportFilterService.ReportFilterObj.showClosingBalance && this._reportFilterService.ReportFilterObj.showOpeningBalance)
            || (!this._reportFilterService.ReportFilterObj.showTransaction && this._reportFilterService.ReportFilterObj.showClosingBalance && this._reportFilterService.ReportFilterObj.showOpeningBalance)) {
            return 60;
        } else if (this._reportFilterService.ReportFilterObj.showTransaction && this._reportFilterService.ReportFilterObj.showClosingBalance && this._reportFilterService.ReportFilterObj.showOpeningBalance) {
            return 41;
        }
    }


    getopeningHeaderWidth() {
        if (
            (this._reportFilterService.ReportFilterObj.showTransaction && this._reportFilterService.ReportFilterObj.showClosingBalance && !this._reportFilterService.ReportFilterObj.showOpeningBalance)
            || (this._reportFilterService.ReportFilterObj.showTransaction && !this._reportFilterService.ReportFilterObj.showClosingBalance && this._reportFilterService.ReportFilterObj.showOpeningBalance)
            || (!this._reportFilterService.ReportFilterObj.showTransaction && this._reportFilterService.ReportFilterObj.showClosingBalance && this._reportFilterService.ReportFilterObj.showOpeningBalance)) {
            return 10;
        }
        else {
            return 9;
        }
    }

    applyFilter(filterObj) {
        this.loadData(filterObj)
    }
    loadData(filterObj: any) {
        this.reportFilter.popupClose()
        this._spinnerService.show("Please Wait! Loading trial Balance.")
        this._trialBlService.getTrialBalanceData(filterObj).subscribe((res) => {
            if (this._reportFilterService.ReportFilterObj.SHOWOPENINGTRIALONLY == true &&
                this._reportFilterService.ReportFilterObj.showPartylistInTrialBalance != true &&
                this._reportFilterService.ReportFilterObj.showSubLedgerInTrialBalance != true &&
                this._reportFilterService.ReportFilterObj.showClosingStockValueInTrialBalance != true &&
                this._reportFilterService.ReportFilterObj.isZeroBalance !== true) {
                this._reportFilterService.ReportFilterObj.showOpeningBalance = true;
                this._reportFilterService.ReportFilterObj.showClosingBalance = false;
                this._reportFilterService.ReportFilterObj.showTransaction = false;
            } else {
                this._reportFilterService.ReportFilterObj.showOpeningBalance = true;
                this._reportFilterService.ReportFilterObj.showClosingBalance = true;
                this._reportFilterService.ReportFilterObj.showTransaction = true;
            }
            this._reportFilterService.ReportFilterObj.tblDataStore = res.result
            this._reportFilterService.ReportFilterObj.isTBLDataLoaded = true
            if (this._reportFilterService.ReportFilterObj.isSummary && !this._reportFilterService.ReportFilterObj.isLedgerWise) {
                this._reportFilterService.ReportFilterObj.tblData = this._reportFilterService.ReportFilterObj.tblDataStore.summaryTrialBalance
            } else if (!this._reportFilterService.ReportFilterObj.isSummary && !this._reportFilterService.ReportFilterObj.isLedgerWise && !this._reportFilterService.ReportFilterObj.showAllLevel) {
                this._reportFilterService.ReportFilterObj.tblData = this._reportFilterService.ReportFilterObj.tblDataStore.detailTrialBalance
            } else if (this._reportFilterService.ReportFilterObj.showAllLevel && !this._reportFilterService.ReportFilterObj.isLedgerWise) {
                this._reportFilterService.ReportFilterObj.tblData = this._reportFilterService.ReportFilterObj.tblDataStore.allLevelTrialBalance
            } else if (this._reportFilterService.ReportFilterObj.isLedgerWise) {
                this._reportFilterService.ReportFilterObj.tblData = this._reportFilterService.ReportFilterObj.tblDataStore.ledgerTrialBalance
            }
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
                ////console.log("@@activeurlpath2", activeurlpath2)
            }
            let abc = this._reportMainService.previouslyLoadedReportList.findIndex(report => report.reportname == 'Trial Balance Report');
            if (abc >= 0) {
                this._reportMainService.previouslyLoadedReportList.splice(abc, 1)
            }
            this._reportMainService.previouslyLoadedReportList.push(
                {
                    reportname: 'Trial Balance Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2
                });
            this.reportFilter.popupClose()
            this._spinnerService.hide()

        }, error => {
            this._spinnerService.hide()
            this._alertService.error(error)
        })
    }

    ExportReportInExcel() {
        this._reportFilterService.exportTableToExcel("trialBalance", "Trial Balance")
    }
    print() {
        this._reportFilterService.print()
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
            $event.preventDefault();
            this.tblTable.nativeElement.scrollTop = this.tblTable.nativeElement.scrollTop + 26
            this._reportFilterService.selectedRowIndex++;
            if (this._reportFilterService.selectedRowIndex == this._reportFilterService.ReportFilterObj.tblData.length) {
                this._reportFilterService.selectedRowIndex = this._reportFilterService.ReportFilterObj.tblData.length - 1;
            }
        } else if ($event.code == "ArrowUp") {
            $event.preventDefault();
            this._reportFilterService.selectedRowIndex--;
            if (this.tblTable.nativeElement.scrollTop > 0) {
                this.tblTable.nativeElement.scrollTop = this.tblTable.nativeElement.scrollTop - 26
            }
            if (this._reportFilterService.selectedRowIndex == -1) {
                this._reportFilterService.selectedRowIndex = 0;
            }
        } else if ($event.code == "Enter" &&
            this._reportFilterService.selectedRowIndex >= 0 &&
            this._reportFilterService.selectedRowIndex < this._reportFilterService.ReportFilterObj.tblData.length) {
            $event.preventDefault()
            this._reportFilterService.ReportFilterObj.showAll = false
            this._reportFilterService.ReportFilterObj.nodeACID = this._reportFilterService.ReportFilterObj.tblData[this._reportFilterService.selectedRowIndex]['ACID']
            this._reportFilterService.ReportFilterObj.nodeACNAME = this._reportFilterService.ReportFilterObj.tblData[this._reportFilterService.selectedRowIndex]['ACNAME']
            this.drillTypeWise()

        } else if ($event.code == "Escape") {
            $event.preventDefault();
            if (!this._reportFilterService.ReportFilterObj.showAll) {
                this.reportFilter.loadParams("TBL")
                this.loadData(this._reportFilterService.ReportFilterObj)
            }
        } else if ($event.code == "F2") {
            $event.preventDefault();
            this._reportFilterService.ReportFilterObj.isSummary = true
            this._reportFilterService.selectedRowIndex = 0
        } else if ($event.code == "F3") {
            $event.preventDefault();
            this._reportFilterService.ReportFilterObj.isSummary = false
            this._reportFilterService.selectedRowIndex = 0
        } else if ($event.code == "F4") {
            $event.preventDefault();
            if (this._reportFilterService.ReportFilterObj.isSummary == false) {
                if (this._reportFilterService.ReportFilterObj.showAllLevel == true) {

                    this._reportFilterService.ReportFilterObj.showAllLevel = false
                } else {
                    this._reportFilterService.ReportFilterObj.showAllLevel = true

                }
            }

            this._reportFilterService.selectedRowIndex = 0
        } else if ($event.code == "F6") {
            $event.preventDefault();
            this._reportFilterService.ReportFilterObj.isLedgerWise = false
            this._reportFilterService.selectedRowIndex = 0
        } else if ($event.code == "F7") {
            $event.preventDefault();
            this._reportFilterService.ReportFilterObj.isLedgerWise = true
            this._reportFilterService.selectedRowIndex = 0
        }
    }
    drillTypeWise() {
        this._reportFilterService.ReportFilterObj.isLedgerWise = this._reportFilterService.ReportFilterObj.tblData[this._reportFilterService.selectedRowIndex]['TYPE'] === 'G' ? false : true;
        this._reportFilterService.ReportFilterObj.ledgerType = this._reportFilterService.ReportFilterObj.tblData[this._reportFilterService.selectedRowIndex]['TYPE'] === 'G' ? 'GROUP' : 'ACCOUNT';
        this._reportFilterService.ReportFilterObj.ACCNAME = this._reportFilterService.ReportFilterObj.tblData[this._reportFilterService.selectedRowIndex]['ACNAME']
        this._reportFilterService.ReportFilterObj.ACID = this._reportFilterService.ReportFilterObj.tblData[this._reportFilterService.selectedRowIndex]['ACID']
        this._reportFilterService.ReportFilterObj.ACCODE = this._reportFilterService.ReportFilterObj.tblData[this._reportFilterService.selectedRowIndex]['ACCODE']
        this._reportFilterService.ReportFilterObj.IsSubLedger = this._reportFilterService.ReportFilterObj.tblData[this._reportFilterService.selectedRowIndex]['IsSLedger'];
        if( this._reportFilterService.ReportFilterObj.ACID && this._reportFilterService.ReportFilterObj.ACID.startsWith("PA") ){
            this._reportFilterService.ReportFilterObj.ACIDwithPA=true;
                }else{
                  this._reportFilterService.ReportFilterObj.ACIDwithPA=false;
                }
        this._reportFilterService.drillDown("TBL", this.activatedRoute.snapshot['_routerState'].url)
    }


    onDoubleClick(index) {
        this._reportFilterService.selectedRowIndex = index;
        this.drillTypeWise()
    }

}
