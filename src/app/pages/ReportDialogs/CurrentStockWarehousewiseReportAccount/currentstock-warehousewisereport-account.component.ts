import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { AlertService } from '../../../common/services/alert/alert.service';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'currentstock-warehousewise-account',
    templateUrl: './currentstock-warehousewisereport-account.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class CurrentStockWarehousWiseReportAccount implements OnInit {
    userProfile: any;
    instanceWiseRepName: string = 'Stock Report - Warehouse Wise';
    warehouseList: any = [];

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private arouter: Router, public _ActivatedRoute: ActivatedRoute,
        public reportService: ReportFilterService, private alertService: AlertService,
        public dialogref: MdDialogRef<CurrentStockWarehousWiseReportAccount>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        this.userProfile = this._authService.getUserProfile();

        this.masterService.getunsalableWarehouseList().subscribe((res) => {
            this.warehouseList.push(res)
        })
    }

    ngOnInit() {
        if (this._reportFilterService.CurrentStockWarehousewiseAccObj.assignPrevioiusDate != true) {
            this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE1 = this.masterService.userProfile.CompanyInfo.FBDATE.split('T')[0];
            this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE2 = new Date().toJSON().split('T')[0];
            this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
            this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_COMPANY = '%';
            this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_WAREHOUSETYPE = '%';
            this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_WAREHOUSE = '%';
        }

        this.changeEntryDate(this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE2, "AD");
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
            var datearr = value.split('/');
            const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if (Validatedata == true) {
                const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
                var adDate1 = adbs.bs2ad(bsDate1);
                this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            } else {
                this.alertService.error("Cannot Change the date");
                return;
            }


        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
            var datearr = value.split('/');
            const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if (Validatedata == true) {
                const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
                var adDate1 = adbs.bs2ad(bsDate1);
                this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            } else {
                this.alertService.error("Cannot Change the date");
                return;
            }

        }
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {

        if (res == "ok") {
            this._reportFilterService.CurrentStockWarehousewiseAccObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.CurrentStockWarehouseWiseAccount_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Stock Report - Warehouse Wise',
                        activeurlpath: this.arouter.url,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.CurrentStockWarehouseWiseAccount_loadedTimes,
                        activerurlpath2: activeurlpath2,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Stock Report - Warehouse Wise' + '_' + this._reportFilterService.CurrentStockWarehouseWiseAccount_loadedTimes,
                        activeurlpath: this.arouter.url,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.CurrentStockWarehouseWiseAccount_loadedTimes,
                        activerurlpath2: activeurlpath2,
                    });
            }

        }

        let multiplereportname = 'Current Stock Warehousewise ReportAccount';
        let ShowBatch = this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_SHOWBATCHWISE;

        if (ShowBatch == 0) {
            multiplereportname = 'Current Stock Warehousewise ReportAccount';
        } else if (ShowBatch == 1) {
            multiplereportname = 'Current Stock Warehousewise ReportAccount_1'
        }
        //console.log("@@multiplereportname", multiplereportname)

        this.reportdataEmit.emit({
            status: res, data: {
                reportname: multiplereportname, reportparam: {
                    DATE1: this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE1,
                    DATE2: this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE2,
                    // date1: this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE1,
                    // date2: this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_DATE2,
                    // PhiscalID: this.userProfile.CompanyInfo.PHISCALID,
                    PHISCALID: this.userProfile.CompanyInfo.PHISCALID,
                    // DIVISION: this.userProfile.CompanyInfo.INIITAL ? this.userProfile.CompanyInfo.INIITAL : '%',
                    DIV: this.userProfile.CompanyInfo.INITIAL ? this.userProfile.CompanyInfo.INITIAL : '%',
                    COMPANYID: this.userProfile.CompanyInfo.COMPANYID,
                    // Warehouse: this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_WAREHOUSE ? this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_WAREHOUSE : '%',
                    // Company: this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_COMPANY ? this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_COMPANY : '%',
                    // WarehouseType: this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_WAREHOUSETYPE ? this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_WAREHOUSETYPE : '%',
                    WAREHOUSE: '%',
	                MCODE : '%',
	                MGROUP : '%',
	                PTYPE : '100',
	                MCAT : '%',
	                SUPCODE : '%',
	                DIVISIONWISEREPORT : 0,
	                SHOWBATCHWISESTOCK: this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_SHOWBATCHWISE?this._reportFilterService.CurrentStockWarehousewiseAccObj.CurrentStockWarehouseWiseAccount_SHOWBATCHWISE:0,
	                REPORTYPE: 0
    }
}
        });

if (res == "ok") {
    this._reportFilterService.CurrentStockWarehouseWiseAccount_loadedTimes = this._reportFilterService.CurrentStockWarehouseWiseAccount_loadedTimes + 1;
}
    }

}

