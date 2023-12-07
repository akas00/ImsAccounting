import { Component, ViewChild, OnInit } from '@angular/core';
import { ReportFilterComponent } from '../../../common/popupLists/report-filter/report-filter.component';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericReportListSettings, ReportData } from '../report-body.component';
import { DayBookService } from './day-book.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';




@Component({
    selector: 'day-book',
    templateUrl: './day-book.component.html',
})

export class DayBookComponent implements OnInit{
    listSetting: GenericReportListSettings = new GenericReportListSettings()
    public reportType: string = "Day Book"
    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    ReportDataObj: ReportData = <ReportData>{}
    constructor(private _alertService: AlertService, private _ledgerService: DayBookService, private _spinnerService: SpinnerService,private _reportFilterService: ReportFilterService) {

        this.listSetting = {
            title: "Day Book",
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

    ngOnInit(){
        this.loadFilter()
    }

    loadFilter() {
        this.reportFilter.show()
    }
    public filterObj: any
    applyFilter(filterObj) {
        this.filterObj = filterObj
        this.reportFilter.popupClose()
        this._spinnerService.show(' Please Wait! Getting Report Data.')
        try {
            this._ledgerService.getDayBookData(filterObj.VTYPE, filterObj.DATE1, filterObj.DATE2, filterObj.SHOWNARRATION, filterObj.DIV).subscribe((res) => {
                if(res.status=="ok"){
                if (res.result.length == 0) {
                    this._alertService.warning("No Result Found")
                }
                this.ReportDataObj.particularsRow = res.result
                this.ReportDataObj.totalRow = res.result2==null?[]:res.result2;
            }
            else
            {
                this._alertService.error(res.result);
            }
                this._spinnerService.hide()
            }, error => {
                this._alertService.error(error)
            })
        }catch(ex){
            this._alertService.error(ex)
        }
    }
    ExportReportInExcel() {
        // this._reportFilterService.exportAsExcelFile(this.ReportDataObj.particularsRow,this.filterObj.VOUCHERNAME)
        this._reportFilterService.exportTableToExcel("reportTable","Day Book");
        
    }
}

