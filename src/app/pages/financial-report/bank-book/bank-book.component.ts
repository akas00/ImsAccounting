import { Component, ViewChild, OnInit } from '@angular/core';
import { ReportFilterComponent } from '../../../common/popupLists/report-filter/report-filter.component';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericReportListSettings, ReportData } from '../report-body.component';

import { BankBookService } from './bank-book.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { MasterRepo } from '../../../common/repositories/masterRepo.service';




@Component({
    selector: 'bank-book',
    templateUrl: './bank-book.component.html',
})

export class BankBookComponent implements OnInit{
    listSetting: GenericReportListSettings = new GenericReportListSettings()
    public reportType: string = "Bank Book"
    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    ReportDataObj: ReportData = <ReportData>{}
    constructor(private _alertService: AlertService, private _bankService: BankBookService, private _spinnerService: SpinnerService,private _reportFilterService:ReportFilterService,private masterService:MasterRepo) {

        this.listSetting = {
            title: "Cash Book",
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
           
            let param={
                DIV:this.masterService.userProfile.CompanyInfo.INITIAL,
                ACID: this._reportFilterService.ReportFilterObj.ACID,
                DATE1:this.filterObj.DATE1,
                DATE2:this.filterObj.DATE2,
                CID:this.masterService.userProfile.CompanyInfo.COMPANYID
            };
            this. _bankService.getBankBookData(param).subscribe((res) => {
                if (res.result.length == 0) {
                    this._alertService.warning("No Result Found")
                }
                this.ReportDataObj.particularsRow = res.result.data
                this.ReportDataObj.totalRow = res.result2==null?[]:res.result2
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
        this._reportFilterService.exportTableToExcel("reportTable","Bank Book");
        
    }
}
