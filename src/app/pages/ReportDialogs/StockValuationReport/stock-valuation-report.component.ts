import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../common/services/alert/alert.service';
import { AuthService } from '../../../common/services/permission';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';


export interface DialogInfo {
    header: string;
    message: Observable<string>;
}
@Component({
    selector: 'stock-valuation-report',
    templateUrl: './stock-valuation-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]
})

export class StockValuationReport implements OnInit {

    userProfile: any;
    instanceWiseRepName: string = 'Stock Valuation Report';
    @ViewChild("genericGridProduct") genericGridProduct: GenericPopUpComponent;
    gridPopupSettingsForProduct: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;
    gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();
    @Output() reportdataEmit = new EventEmitter();
    

    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private arouter: Router, public _ActivatedRoute: ActivatedRoute,
        public reportService: ReportFilterService, private alertService: AlertService,
        public dialogref: MdDialogRef<StockValuationReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo){
           this.userProfile = this._authService.getUserProfile();

    }

    public ngOnInit() {
        if (this._reportFilterService.StockValuationAccountObj.assignPrevioiusDate != true) {
            this._reportFilterService.StockValuationAccountObj.StockValuationAccount_DATE1 = this.userProfile.CompanyInfo.FBDATE.split('T')[0];
            this._reportFilterService.StockValuationAccountObj.StockValuationAccount_DATE2 = new Date().toJSON().split('T')[0];
            this._reportFilterService.StockValuationAccountObj.StockValuationAccount_DIV = this.userProfile.CompanyInfo.INITIAL;
            this._reportFilterService.StockValuationAccountObj.StockValuationAccount_SHOWDETAIL = '0';
        }
        this.changeEntryDate(this._reportFilterService.StockValuationAccountObj.StockValuationAccount_DATE1, "AD");
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.StockValuationAccountObj.StockValuationAccount_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.StockValuationAccountObj.StockValuationAccount_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.StockValuationAccountObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.StockValuationAccount_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Stock Valuation Report',
                        activeurlpath: this.arouter.url,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.StockValuationAccount_loadedTimes,
                        activerurlpath2: activeurlpath2,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Stock Valuation Report' + '_' + this._reportFilterService.StockValuationAccount_loadedTimes,
                        activeurlpath: this.arouter.url,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.StockValuationAccount_loadedTimes,
                        activerurlpath2: activeurlpath2,
                    });
            }

        }
        let multiplereportname = 'Stock Valuation ReportAccount';
        let ITEMNAME = this._reportFilterService.StockValuationAccountObj.StockValuationAccount_ITEM;
        let ShowDetail = this._reportFilterService.StockValuationAccountObj.StockValuationAccount_SHOWDETAIL;
        // let BARCODE = this._reportFilterService.StockValuationAccountObj.StockValuationAccount_BARCODE;


       

        if (ITEMNAME == "") {
            this._reportFilterService.StockValuationAccountObj.StockValuationAccount_MCODE = '%';
        }

        

    if(ShowDetail == 0){
        multiplereportname = 'Stock Valuation ReportAccount';
    }else if( ShowDetail == 1){
        multiplereportname = 'Stock Valuation ReportAccount_1'
    }
        //console.log("@@multiplereportname", multiplereportname)
        this.reportdataEmit.emit({
            status: res, data: {
                reportname: multiplereportname, reportparam: {
                    DATE: this._reportFilterService.StockValuationAccountObj.StockValuationAccount_DATE1,
                    DIV: this.userProfile.CompanyInfo.INITIAL,
                    COMID: this.userProfile.CompanyInfo.COMPANYID,
                    COMPANYID: this.userProfile.CompanyInfo.COMPANYID,
                    PHISCALID: this.userProfile.CompanyInfo.PhiscalID,
                    MGROUP: '%',
                    MCAT:'%',
                    PTYPE: 100,
                    MCODE: this._reportFilterService.StockValuationAccountObj.StockValuationAccount_MCODE ? this._reportFilterService.StockValuationAccountObj.StockValuationAccount_MCODE : '%',
                    ITEMNAME: this._reportFilterService.StockValuationAccountObj.StockValuationAccount_ITEM ? this._reportFilterService.StockValuationAccountObj.StockValuationAccount_ITEM : "",
                    SHOWDETAIL: this._reportFilterService.StockValuationAccountObj.StockValuationAccount_SHOWDETAIL ? this._reportFilterService.StockValuationAccountObj.StockValuationAccount_SHOWDETAIL : 0
                }
            }
        });
        if (res == "ok") {
            this._reportFilterService.StockValuationAccount_loadedTimes = this._reportFilterService.StockValuationAccount_loadedTimes + 1;
        }
    }

    ProductEnterClicked() {
        this.gridPopupSettingsForProduct = this.masterService.getGenericGridPopUpSettings('ProductList');
        this.genericGridProduct.show();
    }

    dblClickProductSelect(product) {
        this._reportFilterService.StockValuationAccountObj.StockValuationAccount_MCODE = product.MCODE;
        this._reportFilterService.StockValuationAccountObj.StockValuationAccount_ITEM = product.DESCA;
        // this._reportFilterService.StockValuationAccountObj.StockValuationAccount_MENUCODE = product.MENUCODE;
    }




}