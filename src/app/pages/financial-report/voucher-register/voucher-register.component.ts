import { Component, ViewChild, OnInit } from '@angular/core';
import { ReportFilterComponent } from '../../../common/popupLists/report-filter/report-filter.component';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericReportListSettings, ReportData } from '../report-body.component';
import { VoucherRegisterService } from './voucher-register.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import * as jsPDF from 'jspdf'


@Component({
    selector: 'voucher-register',
    templateUrl: './voucher-register.component.html',
})

export class VoucherRegisterComponent implements OnInit {
    listSetting: GenericReportListSettings = new GenericReportListSettings()
    public reportType: string = "Voucher Register"
    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    ReportDataObj: ReportData = <ReportData>{}
    constructor(private _reportFilterService: ReportFilterService, private _alertService: AlertService, private _ledgerService: VoucherRegisterService, private _spinnerService: SpinnerService) {

        this.listSetting = {
            title: "Voucher Register",
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
                    key: "DRAMNT",
                    title: "DEBIT"
                },
                {
                    key: "CRAMNT",
                    title: "CREDIT"
                }
            ]

        }
    }

    ngOnInit() {
        this.loadFilter()
    }


    loadFilter() {
        this.reportFilter.show()
    }


    ExportReportInExcel() {
        this._reportFilterService.exportTableToExcel("reportTable", this.filterObj.VOUCHERNAME)
    }


    print(){
        this._reportFilterService.print()
    }



























    public filterObj: any
    applyFilter(filterObj) {
        this.filterObj = filterObj
        this.reportFilter.popupClose()
        this._spinnerService.show(' Please Wait! Getting Report Data.')
        try {
            this._ledgerService.getVoucherRegisterData(filterObj.VTYPE, filterObj.DATE1, filterObj.DATE2, filterObj.SHOWNARRATION, filterObj.DIV).subscribe((res) => {
                this._spinnerService.hide()
                if (res.status == "ok") {
                    if (res.result.length == 0) {
                        this._alertService.warning("No Result Found")
                    }
                    ////console.log("CheckVoucher",res.result)
                    this.ReportDataObj.particularsRow = res.result
                    this.ReportDataObj.totalRow = res.result2 == null ? [] : res.result2
                }else{
                    this._alertService.error(res.result)
                }
            }, error => {
                this._alertService.error(error)
            })
        } catch (ex) {
            this._alertService.error(ex)
        }
    }

}


