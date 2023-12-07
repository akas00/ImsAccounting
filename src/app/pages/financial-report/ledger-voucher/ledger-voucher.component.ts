import { Component, ViewChild, OnInit } from '@angular/core';
import { ReportFilterComponent } from '../../../common/popupLists/report-filter/report-filter.component';
import { LedgerVoucherService } from './ledger-voucher.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericReportListSettings, ReportData } from '../report-body.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { EventListenerService } from '../event-listener.service';
import { Location } from '@angular/common';
import * as moment from 'moment';



@Component({
    selector: 'ledger-voucher',
    templateUrl: './ledger-voucher.component.html',
})

export class LedgerVoucherComponent implements OnInit {

    listSetting: GenericReportListSettings = new GenericReportListSettings()
    public reportType: string = "Ledger Voucher"
    public returnUrl: string;
    public _reportFilterData: any;
    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    ReportDataObj: ReportData = <ReportData>{}
    public filterObj: any


    constructor(private _location: Location, public eventListener: EventListenerService, public _reportFilterService: ReportFilterService,
        private router: Router, private activatedRoute: ActivatedRoute, private _alertService: AlertService, private _ledgerService: LedgerVoucherService, private _spinnerService: SpinnerService) {
        this._reportFilterService.ReportFilterObj.ledgerType = "account";
        this._reportFilterService.ReportFilterObj.summaryreport = 0;

        this.listSetting = {
            title: "Ledger Voucher",
            columns: [
                {
                    key: "DATE",
                    title: "Date"
                },
                {
                    key: "PARTICULARS",
                    title: "Particulars"
                },
                {
                    key: "VCH TYPE",
                    title: "VCH TYPE"
                },
                {
                    key: "VCH NO",
                    title: "VCH NO"
                },
                {
                    key: "DEBIT",
                    title: "DEBIT"
                },
                {
                    key: "CREDIT",
                    title: "CREDIT"
                },
                {
                    key: "BALANCE",
                    title: "Cummulative Balance"
                }
            ]

        }
    }
    ngOnInit() {
        this.eventListener.onreportObjectChange.subscribe((data: any) => {
            this._reportFilterService.ReportFilterObj = data
        })

        const mode = this.activatedRoute.snapshot.params['mode'];
        const DATE1 = this.activatedRoute.snapshot.params['DATE1'];
        const DATE2 = this.activatedRoute.snapshot.params['DATE2'];
        if (mode == "D") {
            this.reportFilter.selectedDate.startDate = moment(new Date(DATE1))
            this.reportFilter.selectedDate.endDate = moment(new Date(DATE2))
            this.queryAndLoad(this.activatedRoute.snapshot.params)

        } else {
            this.reportFilter.show()
        }

    }

    loadFilter() {
        this.reportFilter.show()
    }

    ExportReportInExcel() {
        this._reportFilterService.exportTableToExcel("reportTable", this.filterObj.ACCNAME)

    }

    print() {
        this._reportFilterService.print()
    }





    applyFilter(filterObj) {
        try {
            this.queryAndLoad(filterObj);
        } catch (ex) {
            this._alertService.error(ex);
        }
    }

    queryAndLoad(filterObj) {
        this.returnUrl = filterObj.returnUrl;
        this.filterObj = filterObj;
        this.reportFilter.popupClose();
        this._spinnerService.show(' Please Wait! Getting Report Data.');
        this._ledgerService.getLedgerVoucherData(filterObj.DATE1, filterObj.DATE2, filterObj.ACID, filterObj.DIV, filterObj.summaryreport, filterObj.ledgerType).subscribe((res) => {
            if (res.result.length == 0) {
                this._alertService.warning("No Result Found");
            }
            this.ReportDataObj.particularsRow = res.result;
            this.ReportDataObj.totalRow = res.result2 == null ? [] : res.result2;
            this._spinnerService.hide();
        }, error => {
            this._alertService.error(error);
        })
    }

    return() {
        this.eventListener.updateReportObject(this._reportFilterService.ReportFilterObj);
        this._location.back();

    }

}


