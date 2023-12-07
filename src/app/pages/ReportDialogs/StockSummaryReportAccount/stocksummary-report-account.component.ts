import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'stocksummary-reportaccount',
    templateUrl: './stocksummary-report-account.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class StockSummaryReportAccount implements OnInit {
    userProfile: any;
    instanceWiseRepName: string = 'Stock Summary Report';
    @ViewChild("genericGridProduct") genericGridProduct: GenericPopUpComponent;
    gridPopupSettingsForProduct: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridBrand") genericGridBrand: GenericPopUpComponent;
    gridPopupSettingsForBrand: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
    gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;
    gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private arouter: Router, public _ActivatedRoute: ActivatedRoute,
        public reportService: ReportFilterService, private alertService: AlertService,
        public dialogref: MdDialogRef<StockSummaryReportAccount>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        this.userProfile = this._authService.getUserProfile();
    }

    ngOnInit() {
        if (this._reportFilterService.StockSummaryAccountObj.assignPrevioiusDate != true) {
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DATE1 = this.userProfile.CompanyInfo.FBDATE.split('T')[0];
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DATE2 = new Date().toJSON().split('T')[0];
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DIV = this.userProfile.CompanyInfo.INITIAL;
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_REPORTTYPE = '0';
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ShowItemInGroupWiseReport = 0;
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DETAILFORMAT='0';
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ReportMode = '0';
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWDETAIL = 0;
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWBATCHWISE = 0;
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWALTUNIT = 0;
        }
        this.changeEndDate(this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DATE2, "AD");
        this.changeEntryDate(this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DATE1, "AD");
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.StockSummaryAccountObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.StockSummaryAccount_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Stock Summary Report',
                        activeurlpath: this.arouter.url,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.StockSummaryAccount_loadedTimes,
                        activerurlpath2: activeurlpath2,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Stock Summary Report' + '_' + this._reportFilterService.StockSummaryAccount_loadedTimes,
                        activeurlpath: this.arouter.url,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.StockSummaryAccount_loadedTimes,
                        activerurlpath2: activeurlpath2,
                    });
            }

        }
        let multiplereportname = 'Stock Summary ReportAccount';
        let REPORTTYPE = this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_REPORTTYPE;
        let ITEMNAME = this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ITEM;
        let DETAILFORMAT = this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DETAILFORMAT;
        let SUPPLIERNAME = this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIER;
        let ShowDetail = this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWDETAIL;
        let SHOWBATCHWISESTOCK = this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWBATCHWISE;


        if (REPORTTYPE == 0) {
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ShowItemInGroupWiseReport = 0;
        }

        if (ITEMNAME == "") {
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_MCODE = '%';
        }

        if (SUPPLIERNAME == "") {
            this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIERCODE = '%';
        }
        let ShowItemInGroupWiseReport = this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ShowItemInGroupWiseReport;


        if (DETAILFORMAT == 0 && REPORTTYPE == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary ReportAccount';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary ReportAccount_1';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 1 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary ReportAccount_2';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary ReportAccount_3';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 1 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary ReportAccount_4';
        }
        else if (DETAILFORMAT == 0 && REPORTTYPE == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary ReportAccount_Batch';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary ReportAccount_1_Batch';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 1 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary ReportAccount_2_Batch';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary ReportAccount_3_Batch';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 1 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary ReportAccount_4_Batch';
        }
        else if (DETAILFORMAT == 0 && REPORTTYPE == 0 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary ReportAccount_A';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 0 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary ReportAccount_1A';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 1 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary ReportAccount_2A';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 0 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary ReportAccount_3A';
        } else if (DETAILFORMAT == 0 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 1 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary ReportAccount_4A';
        }

        if (DETAILFORMAT == 1 && REPORTTYPE == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary Report DetailAccount';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary Report DetailAccount_1';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 1 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary Report DetailAccount_2';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary Report DetailAccount_3';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 1 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 0) {
            multiplereportname = 'Stock Summary Report DetailAccount_4';
        }
        else if (DETAILFORMAT == 1 && REPORTTYPE == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_Batch';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_1_Batch';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 1 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_2_Batch';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 0 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_3_Batch';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 1 && ShowDetail == 0 && SHOWBATCHWISESTOCK == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_4_Batch';
        }
        else if (DETAILFORMAT == 1 && REPORTTYPE == 0 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_A';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 0 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_1A';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 1 && ShowItemInGroupWiseReport == 1 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_2A';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 0 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_3A';
        } else if (DETAILFORMAT == 1 && REPORTTYPE == 2 && ShowItemInGroupWiseReport == 1 && ShowDetail == 1) {
            multiplereportname = 'Stock Summary Report DetailAccount_4A';
        }

        //console.log("@@multiplereportname", multiplereportname)
        this.reportdataEmit.emit({
            status: res, data: {
                reportname: multiplereportname, reportparam: {
                    DATE1: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DATE1,
                    DATE2: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DATE2,
                    DIV: this.userProfile.CompanyInfo.INITIAL,
                    COMID: this.userProfile.CompanyInfo.COMPANYID,
                    COMPANYID: this.userProfile.CompanyInfo.COMPANYID,
                    PHISCALID: this.userProfile.CompanyInfo.PhiscalID,
                    MGROUP: '%',
                    MCAT: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_BRANDID ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_BRANDID : '%',
                    PTYPE: 100,
                    ACID: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIERCODE ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIERCODE : '%',
                    REPORTYTYPE: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_REPORTTYPE ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_REPORTTYPE : '0',
                    SUPCODE: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIERCODE ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIERCODE : '%',
                    MCODE: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_MCODE ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_MCODE : '%',
                    REPORTTYPE: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_REPORTTYPE ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_REPORTTYPE : 0,
                    ShowItemInGroupWiseReport: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ShowItemInGroupWiseReport ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ShowItemInGroupWiseReport : 0,
                    ITEMNAME: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ITEM ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ITEM : "",
                    SUPPLIERNAME: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIER ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIER : "",
                    VCHR: '%',
                    DETAILFORMAT: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DETAILFORMAT ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_DETAILFORMAT : 0,
                    ReportMode: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ReportMode ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ReportMode : 0,
                    WAREHOUSE: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_WAREHOUSE ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_WAREHOUSE : '%',
                    ShowDetail: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWDETAIL ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWDETAIL : 0,
                    SHOWBATCHWISESTOCK: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWBATCHWISE ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWBATCHWISE : 0,
                    ShowAltUnitStockReport: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWALTUNIT ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWALTUNIT : 0,
                    SHOWGROUPING: this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWGROUPING ? this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SHOWGROUPING : 0,
                }
            }
        });
        if (res == "ok") {
            this._reportFilterService.StockSummaryAccount_loadedTimes = this._reportFilterService.StockSummaryAccount_loadedTimes + 1;
        }
    }

    ProductEnterClicked() {
        this.gridPopupSettingsForProduct = this.masterService.getGenericGridPopUpSettings('ProductList');
        this.genericGridProduct.show();
    }

    dblClickProductSelect(product) {
        this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_MCODE = product.MCODE;
        this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_ITEM = product.DESCA;
    }

    BrandEnterClicked() {
        this.BrandList();
        this.genericGridBrand.show();
    }

    BrandList() {
        this.gridPopupSettingsForBrand = this.masterService.getGenericGridPopUpSettings('BrandList');
    }

    dblClickBrandSelect(brand) {
        this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_BRANDID = brand.BRANDCODE;
        this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_BRANDNAME = brand.BRANDNAME;
    }

    SupplierEnterClicked() {
        this.gridPopupSettingsForSupplier = this.masterService.getGenericGridPopUpSettings('SupplierList');
        this.genericGridSupplier.show();
    }

    dblClickSupplierSelect(supplier) {
        this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIERCODE = supplier.ACID;
        this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_SUPPLIER = supplier.ACNAME;
    }

    WarehouseEnterClicked() {
        this.gridPopupSettingsForWarehouse = this.masterService.getGenericGridPopUpSettings('WarehouseList');
        this.genericGridWarehouse.show();
    }

    dblClickWarehouseSelect(warehouse) {
        this._reportFilterService.StockSummaryAccountObj.StockSummaryAccount_WAREHOUSE = warehouse.NAME;
    }

}

