import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../common/repositories';
import { AlertService } from '../../../common/services/alert/alert.service';
import { AuthService } from '../../../common/services/permission';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { DialogInfo } from '../MasterDialogReport/MasterDialogReport';


@Component({
    selector: 'localpurchasecost-allocation-report',
    templateUrl: './localpurchasecost-allocation-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]
})

export class LocalPurchaseCostAllocationReport implements OnInit {
    instanceWiseRepName: string = 'Local Purchase Cost Allocation Report';
    loadInitially: boolean = true;
    

    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridLocalPurchaseCostAccount") genericGridLocalPurchaseCostAccount: GenericPopUpComponent;
    gridPopupSettingsForAccountList: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("genericGridLocalPurchasePIVoucher") genericGridLocalPurchasePIVoucher: GenericPopUpComponent;
    gridPopupSettingsForLocalPurchasePIVoucher: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("genericGridCPVoucher") genericGridCPVoucher: GenericPopUpComponent;
    gridCPVoucherPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(private masterService: MasterRepo, private alertService: AlertService, private _authService: AuthService, private arouter: Router,
        public dialogref: MdDialogRef<LocalPurchaseCostAllocationReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo,
        private _reportFilterService: ReportMainService, public _ActivatedRoute: ActivatedRoute,) {
            
    }


    ngOnInit(): void {
        
            if(this._reportFilterService.LocalPurchaseCostAllocationObj.assignPrevioiusDate != true){
            this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_REPORTMODE='0';
         
        }
       
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {

        if(this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACCNAME == ""||
        this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACCNAME == null ||
        this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACCNAME == undefined){
            this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACID='%';
        }
        if (res == "ok") {
            this._reportFilterService.LocalPurchaseCostAllocationObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.LocalPurchaseCostAlloc_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Local Purchase Cost Allocation Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.LocalPurchaseCostAlloc_loadedTimes,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Local Purchase Cost Allocation Report' + '_' + this._reportFilterService.LocalPurchaseCostAlloc_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.LocalPurchaseCostAlloc_loadedTimes,
                    });
            }
        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME: 'Local Purchase Cost Allocation Report',
                reportname: 'Local Purchase Cost Allocation Report',
                instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.LocalPurchaseCostAlloc_loadedTimes,
                reportparam: {
                    REPORTOPTIONDISPLAYNAME: this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_REPORTOPTIONDISPLAYNAME ? this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_REPORTOPTIONDISPLAYNAME : '',
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    REPORTMODE:  this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_REPORTMODE?parseInt(this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_REPORTMODE):0,
                    ACID: this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACID ? this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACID : '%',
                    ACNAME: this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACCNAME ? this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACCNAME : '',
                    PIVNO: this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_PI_VOUCHERNO ? this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_PI_VOUCHERNO : '%',
                    REFVNO: this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_CAPITALPURCHASE_VCHRNO ? this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_CAPITALPURCHASE_VCHRNO : '%',
                }
            }
        })
        this._reportFilterService.LocalPurchaseCostAlloc_loadedTimes = this._reportFilterService.LocalPurchaseCostAlloc_loadedTimes + 1;
    }

    AccountEnterClicked() {
        this.gridPopupSettingsForAccountList = {
            title: "Account List",
            apiEndpoints: '/getACIDForLocalPIReport',
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACNAME",
                    title: "Account Name",
                    hidden: false,
                    noSearch: false,
                }
            ],
        };
        this.genericGridLocalPurchaseCostAccount.show();
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACID = account.ACID;
        this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_ACCNAME = account.ACNAME;
    }

    PiVoucherEnterClicked() {
        this.gridPopupSettingsForLocalPurchasePIVoucher = {
            title: "Vouchers",
            apiEndpoints: '/getPIVoucherNoForLocalPIReport',
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "PI_VOUCHERNO",
                    title: "PI Voucher No",
                    hidden: false,
                    noSearch: false,
                }
            ],
        };
        this.genericGridLocalPurchasePIVoucher.show();
    }

    dblClickPurchasePIVoucherSelect(value) {
        this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_PI_VOUCHERNO = value.PI_VOUCHERNO;

    }

    CPVoucherPopup() {
        this.gridCPVoucherPopupSettings = {
            title: "Ref Vouchers",
            apiEndpoints: '/getRefVoucherNoForLocalPIReport',
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "CAPITALPURCHASE_VCHRNO",
                    title: "Ref Voucher No",
                    hidden: false,
                    noSearch: false,
                }, {
                    key: "TOTALAMOUNT",
                    title: "Total Amount",
                    hidden: false,
                    noSearch: false,
                }
            ],
        };
        this.genericGridCPVoucher.show();
    }

    DblClickCPVoucherSelect(value) {
        this._reportFilterService.LocalPurchaseCostAllocationObj.LocalPurchaseCostAllocation_CAPITALPURCHASE_VCHRNO = value.CAPITALPURCHASE_VCHRNO;
    }
}