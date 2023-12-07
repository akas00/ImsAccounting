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
    selector: 'stock-ledger-report-account',
    templateUrl: './stock-ledger-report-account.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]
})

export class StockLedgerReportAccount implements OnInit{

   
    userProfile: any;
    instanceWiseRepName: string = 'Stock Ledger Report';
    @ViewChild("genericGridProduct") genericGridProduct: GenericPopUpComponent;
    gridPopupSettingsForProduct: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;
    gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private arouter: Router, public _ActivatedRoute: ActivatedRoute,
        public reportService: ReportFilterService, private alertService: AlertService,
        public dialogref: MdDialogRef<StockLedgerReportAccount>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        this.userProfile = this._authService.getUserProfile();
      }

      
  


ngOnInit() {
   if (this._reportFilterService.StockLedgerAccountObj.assignPrevioiusDate != true){
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DATE1 = this.userProfile.CompanyInfo.FBDATE.split('T')[0];
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DATE2 = new Date().toJSON().split('T')[0];
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DIV =this.userProfile.CompanyInfo.INITIAL;
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEMGROUPWISE='0';
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_SHOWDETAIL = 0;
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_SHOWBATCHWISE = 0;
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEMGROUP='0';
   }

   this.changeEntryDate(this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DATE1,"AD");
   this.changeEndDate(this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DATE2,"AD")
}

onload() {
    if(this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEM == "" || 
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEM == null ||
     this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEM == undefined ||
     this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_MCODE == "" ||
     this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_MCODE == undefined ||
     this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_MCODE == null ||
     this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_MCODE == '%'){
        this.alertService.info("Plese Select Item !");
        return;
    }
    this.DialogClosedResult("ok");
}





  public DialogClosedResult(res) {

    if (res == "ok") {

        this._reportFilterService.StockLedgerAccountObj.assignPrevioiusDate = true;
        let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
        if (routepaths && routepaths.length) {
            activeurlpath2 = routepaths[routepaths.length - 1]
        }

        if (this._reportFilterService.StockLedgerReportAcc_loadedTimes == 0) {
            this._reportFilterService.previouslyLoadedReportList.push(
                {
                    reportname: 'Stock Ledger Report',
                    activeurlpath: this.arouter.url,
                    instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.StockLedgerReportAcc_loadedTimes,
                    activerurlpath2: activeurlpath2,
                });
        } else {
            this._reportFilterService.previouslyLoadedReportList.push(
                {
                    reportname: 'Stock Ledger Report' + '_' + this._reportFilterService.StockLedgerReportAcc_loadedTimes,
                    activeurlpath: this.arouter.url,
                    instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.StockLedgerReportAcc_loadedTimes,
                    activerurlpath2: activeurlpath2,
                });
        }

    }
    let multiplereportname = 'Stock Ledger ReportAccount';
    // let REPORTTYPE = this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_REPORTTYPE;
    // let ShowItemInGroupWiseReport = this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ShowItemInGroupWiseReport;
    let ITEMNAME = this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEM;
    let SHOWDETAIL = this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_SHOWDETAIL;
    let SHOWBATCH = this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_SHOWBATCHWISE;
    if (SHOWDETAIL == 0 && SHOWBATCH == 0) {
      multiplereportname = 'Stock Ledger ReportAccount';
    } else if (SHOWDETAIL == 0 && SHOWBATCH == 1) {
      multiplereportname = 'Stock Ledger ReportAccount_1';
    } else if (SHOWDETAIL == 1 && SHOWBATCH == 0) {
      multiplereportname = 'Stock Ledger ReportAccount_2';
    } else if (SHOWDETAIL == 1 && SHOWBATCH == 1) {
      multiplereportname = 'Stock Ledger ReportAccount_3';
    }

    if (ITEMNAME == "") {
        this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_MCODE = '%';
    }


    //console.log("@@multiplereportname", multiplereportname)
    this.reportdataEmit.emit({
        status: res, data: {
            reportname: multiplereportname, reportparam: {
                DATE1: this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DATE1,
                DATE2: this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DATE2,
                DIV: this.userProfile.CompanyInfo.INITIAL,
                COMID: this.userProfile.CompanyInfo.COMPANYID,
                COMPANYID: this.userProfile.CompanyInfo.COMPANYID,
                PHISCALID: this.userProfile.CompanyInfo.PhiscalID,
                MCODE: this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_MCODE ? this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_MCODE : '%',
                WAREHOUSE: this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_WAREHOUSE ? this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_WAREHOUSE : '%',
                SHOWDETAIL: this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_SHOWDETAIL ? this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_SHOWDETAIL : 0,
                SHOWBATCH : this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_SHOWBATCHWISE ? this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_SHOWBATCHWISE : 0,
                ITEMNAME: this._reportFilterService.StockLedgerAccountObj.StockValuationAccount_ITEM? this._reportFilterService.StockLedgerAccountObj.StockValuationAccount_ITEM : ""
                // ITEMGROUPWISE:this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEMGROUPWISE ? this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEMGROUPWISE : 0,
                // ITEMGROUP:this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEMGROUP ? this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEMGROUP : '%',
            }

        }
    });
    if (res == "ok") {
        this._reportFilterService.StockLedgerReportAcc_loadedTimes = this._reportFilterService.StockLedgerReportAcc_loadedTimes + 1;
    }
}

  

changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_BSDATE1= (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
            this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
        this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_BSDATE2= (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
            this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
        } else {
            this.alertService.error("Cannot Change the date");
            return;
        }

    }
}

closeReportBox() {  
 this.DialogClosedResult("Error!");
}

WarehouseEnterClicked() {
    this.gridPopupSettingsForWarehouse = this.masterService.getGenericGridPopUpSettings('WarehouseList');
    this.genericGridWarehouse.show();
}
dblClickWarehouseSelect(warehouse) {
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_WAREHOUSE = warehouse.NAME;
}


ProductEnterClicked() {
    this.gridPopupSettingsForProduct = this.masterService.getGenericGridPopUpSettings('ProductList');
    this.genericGridProduct.show();
}

dblClickProductSelect(product) {
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_MCODE = product.MCODE;
    this._reportFilterService.StockLedgerAccountObj.StockLedgerReportAcc_ITEM = product.DESCA;
}

}