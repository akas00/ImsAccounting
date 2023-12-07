import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'stockabc-analysis-account',
    templateUrl: './stockabc-analysisreport-account.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class StockAbcAnalysisReportAccount implements OnInit {
    userProfile: any;
    instanceWiseRepName: string = 'Stock Abc Analysis Report';
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
        public dialogref: MdDialogRef<StockAbcAnalysisReportAccount>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        this.userProfile = this._authService.getUserProfile();
    }

    ngOnInit() {
        if (this._reportFilterService.StockAbcAnalysisAccountObj.assignPrevioiusDate != true) {
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DATE1 = this.masterService.userProfile.CompanyInfo.FBDATE.split('T')[0];
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DATE2 = new Date().toJSON().split('T')[0];
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_REPORTTYPE = '0';
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ShowItemInGroupWiseReport = 0;
        }

        this.changeEntryDate(this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DATE2, "AD");

    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.StockAbcAnalysisAccountObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.StockAbcAnalysisAccount_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Sales Abc Analysis Report',
                        activeurlpath: this.arouter.url,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.StockAbcAnalysisAccount_loadedTimes,
                        activerurlpath2: activeurlpath2,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Sales Abc Analysis Report' + '_' + this._reportFilterService.StockAbcAnalysisAccount_loadedTimes,
                        activeurlpath: this.arouter.url,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.StockAbcAnalysisAccount_loadedTimes,
                        activerurlpath2: activeurlpath2,
                    });
            }

        }
        let multiplereportname = 'Sales Abc Analysis ReportAccount';
        let REPORTTYPE = this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_REPORTTYPE;
        let ITEMNAME = this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ITEM;
        let SUPPLIERNAME = this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIER;

        if (REPORTTYPE == 0) {
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ShowItemInGroupWiseReport = 0;
        }

        if (ITEMNAME == "") {
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_MCODE = '%';
        }

        if (SUPPLIERNAME == "") {
            this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIERCODE = '%';
        }

        let ShowItemInGroupWiseReport = this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ShowItemInGroupWiseReport;

        if (REPORTTYPE == 0) {
            multiplereportname = 'Stock Abc Analysis ReportAccount';
        } else if (REPORTTYPE == 1 && ShowItemInGroupWiseReport == 0) {
            multiplereportname = 'Stock Abc Analysis ReportAccount_1';
        } else if (REPORTTYPE == 1 && ShowItemInGroupWiseReport == 1) {
            multiplereportname = 'Stock Abc Analysis ReportAccount_2';
        } else if (REPORTTYPE == 2 && ShowItemInGroupWiseReport == 0) {
            multiplereportname = 'Stock Abc Analysis ReportAccount_3';
        } else if (REPORTTYPE == 2 && ShowItemInGroupWiseReport == 1) {
            multiplereportname = 'Stock Abc Analysis ReportAccount_4';
        }
        //console.log("@@multiplereportname", multiplereportname)


        this.reportdataEmit.emit({
            status: res, data: {
                reportname: multiplereportname, reportparam: {
                    DATE1: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DATE1,
                    DATE2: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_DATE2,
                    DIV: this.userProfile.CompanyInfo.INITIAL,
                    COMID: this.userProfile.CompanyInfo.COMPANYID,
                    COMPANYID: this.userProfile.CompanyInfo.COMPANYID,
                    PHISCALID: this.userProfile.CompanyInfo.PhiscalID,
                    MGROUP: '%',
                    MCAT: '%',
                    PTYPE: 100,
                    ACID: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIERCODE ? this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIERCODE : '%',
                    REPORTYTYPE: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_REPORTTYPE ? this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_REPORTTYPE : '0',
                    SUPCODE: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIERCODE ? this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIERCODE : '%',
                    MCODE: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_MCODE ? this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_MCODE : '%',
                    REPORTTYPE: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_REPORTTYPE ? this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_REPORTTYPE : 0,
                    ShowItemInGroupWiseReport: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ShowItemInGroupWiseReport ? this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ShowItemInGroupWiseReport : 0,
                    ITEMNAME: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ITEM ? this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ITEM : "",
                    SUPPLIERNAME: this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIER ? this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIER : ""
                }
            }
        });
        if (res == "ok") {
            this._reportFilterService.StockAbcAnalysisAccount_loadedTimes = this._reportFilterService.StockAbcAnalysisAccount_loadedTimes + 1;
        }
    }

    ProductEnterClicked() {
        this.gridPopupSettingsForProduct = this.masterService.getGenericGridPopUpSettings('ProductList');
        this.genericGridProduct.show();
    }

    dblClickProductSelect(product) {
        this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_MCODE = product.MCODE;
        this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_ITEM = product.DESCA;
    }

    // BrandEnterClicked() {
    //     this.gridPopupSettingsForBrand = this.masterService.getGenericGridPopUpSettings('BrandList');
    //     this.genericGridBrand.show();
    // }


    // dblClickBrandSelect(brand) {
    //     this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_BRANDID = brand.BRANDCODE;
    //     this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_BRANDNAME = brand.BRANDNAME;
    // }

    SupplierEnterClicked() {
        this.gridPopupSettingsForSupplier = this.masterService.getGenericGridPopUpSettings('SupplierList');
        this.genericGridSupplier.show();
    }

    dblClickSupplierSelect(supplier) {
        this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIERCODE = supplier.ACID;
        this._reportFilterService.StockAbcAnalysisAccountObj.StockAbcAnalysisAccount_SUPPLIER = supplier.ACNAME;
    }
    
}

