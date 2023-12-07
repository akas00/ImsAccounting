import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VehicleCostTracking } from "../../../../common/interfaces/VehicleCostTracking.interface";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { VehicleCostTrackingService } from "./vehicle-cost-tracking.service";
@Component({
    selector: 'vehiclecost-tracking',
    templateUrl: './vehicle-cost-tracking.component.html',
    styleUrls: ['./vehicle-cost-tracking.component.css']
})
export class VehicleCostTrackingComponent implements OnInit {
    totalBillListTotal: number;
    BillList: any[] = [];
    public vehicle_costtracking = {
        AMOUNT: 0,
        ACID: "",
        ACNAME: "",
        VCHRNO: "",
        VT_NO: "",
        CAPITALPURCHASE_VCHRNO: "",
        SL_ACID:"",
        SL_ACNAME:"",
        HASSUBLEDGER:0
    }
    public VehicleCostTrack: VehicleCostTracking = <VehicleCostTracking>{};
    DATA_MODE = "ADD"; // cane be ADD / VIEW / EDIT
    RefNoTotalAmount: number;


    @ViewChild("genericGridAccount") genericGridAccount: GenericPopUpComponent;
    gridAccountPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridPIVoucher") genericGridPIVoucher: GenericPopUpComponent;
    gridPIVoucherPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
    fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
    @ViewChild("genericGridCPVoucher") genericGridCPVoucher: GenericPopUpComponent;
    gridCPVoucherPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("gridSubLedgerSettingList")gridSubLedgerSettingList: GenericPopUpComponent;
    gridSubLedgerSetting: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(public _vechiclecosttrackService: VehicleCostTrackingService,
        public _trnMainService: TransactionService,
        private _alertService: AlertService,
        private masterService: MasterRepo,
        private arouter: ActivatedRoute,
        private router: Router
    ) {

        if (this.arouter.snapshot.params && this.arouter.snapshot.params['mode']) {
            this.DATA_MODE = this.arouter.snapshot.params['mode'];
            if (this.DATA_MODE == "VIEW" || this.DATA_MODE == "EDIT") {
                let _VCHRNO = this.arouter.snapshot.params['VCHRNO'];
                this.masterService.PIVoucherDetail(_VCHRNO).subscribe(res => {
                    if (res.status == "ok") {
                        if (res.result && res.result.length && res.result.length > 0) {
                            this.BillList = res.result;
                            this.vehicle_costtracking.VT_NO = res.result[0].VT_NO;
                            let IAmount: any = [];
                            for (let i of this.BillList) {
                                IAmount.push(i.AMOUNT)
                            }
                            this.RefNoTotalAmount=this.totalBillListTotal = IAmount.map((x: any) => Number(x)).reduce((a: any, b: any) => a + b, 0);
                            if (this.DATA_MODE == "EDIT") {
                                // this.vehicle_costtracking.VCHRNO = res.result[0].VCHRNO;
                                this.vehicle_costtracking.CAPITALPURCHASE_VCHRNO = res.result[0].CAPITALPURCHASE_VCHRNO;
                            }
                        }
                    }
                }, err => {
                    this._alertService.info(err);
                })
            } else {
                this.resetAll();
                this.masterService.focusAnyControl("refvoucherno");
            }
        }
    }

    ngOnInit() {
    }

    Save() {
        if (this.BillList.length == 0) {
            this._alertService.info("Please select PI Voucher.");
            return;
        }

        if(this.RefNoTotalAmount!=this.totalBillListTotal){
            this._alertService.info("Total Cost Amount not match with Ref Voucher's Total..");
            return;
        }

        if(this._trnMainService.userSetting.ENABLESUBLEDGER==1){
            let subledger = this.BillList.filter(x => x.HASSUBLEDGER == 1 && (x.SL_ACID=="" || x.SL_ACID==null || x.SL_ACID==undefined));
            for (var i of subledger) {
                    this._alertService.info(`Please select subledger for ${i.ACNAME}`);
                    return;
            }
        }

        this._vechiclecosttrackService.saveVehicleCostTracking(this.BillList).subscribe(res => {
            if (res.status == "ok") {
                this.resetAll();
                this._alertService.success("Data Saved Successfully");
                this.onBackClicked();
            }
        }, err => {
            this._alertService.error(JSON.parse(err._body))
        })
    }

    getUntrackedPIVoucherList() {
        this._vechiclecosttrackService.UntrackedPIVoucherList().subscribe(res => {
            if (res.status == "ok") {
                this.BillList = res.result;
            }
        }, err => {
            this._alertService.error(err)
        })
    }

    resetAll() {
        this.vehicle_costtracking.CAPITALPURCHASE_VCHRNO = "";
        this.vehicle_costtracking.VCHRNO = "";
        this.vehicle_costtracking.ACID = "";
        this.vehicle_costtracking.ACNAME = "";
        this.vehicle_costtracking.AMOUNT = 0;
        this.vehicle_costtracking.VT_NO = "";
        this.BillList = [];
        this.DATA_MODE = "ADD";
        this.totalBillListTotal = 0;
        this.RefNoTotalAmount=0;
        this.vehicle_costtracking.SL_ACID="";
        this.vehicle_costtracking.SL_ACNAME="";
        this.vehicle_costtracking.HASSUBLEDGER=0;
    }

    AccountSelect() {
        this.gridAccountPopupSettings = this.masterService.getGenericGridPopUpSettings('DirectAndIndirectExpenseOnly');
        this.genericGridAccount.show();
    }

    DblClickAccountSelect(value) {
        this.vehicle_costtracking.ACID = value.ACID;
        this.vehicle_costtracking.ACNAME = value.ACNAME;
        this.vehicle_costtracking.SL_ACID="";
        this.vehicle_costtracking.SL_ACNAME="";
        if(this._trnMainService.userSetting.ENABLESUBLEDGER==1){
            if(value.HASSUBLEDGER==1){
                this.onsubLedgerTab(value);
                this.vehicle_costtracking.HASSUBLEDGER=1;
            }else{
                this.vehicle_costtracking.HASSUBLEDGER=0;
            }
        }else{
            this.masterService.focusAnyControl("amount");
        }
    }

    onAddClick() {

        // if (confirm("Do you want to add new information?")) {
        if (this.vehicle_costtracking.CAPITALPURCHASE_VCHRNO == "" ||
            this.vehicle_costtracking.VCHRNO == "" ||
            this.vehicle_costtracking.ACID == "" || this.vehicle_costtracking.ACNAME == "" ||
            this.vehicle_costtracking.AMOUNT <= 0) {
            this._alertService.info("Please enter all fields.");
            return;
        }

        if (this._trnMainService.userSetting.ENABLESUBLEDGER == 1 &&
            this.vehicle_costtracking.HASSUBLEDGER == 1 &&
            (this.vehicle_costtracking.SL_ACID == null ||
            this.vehicle_costtracking.SL_ACID == "" ||
            this.vehicle_costtracking.SL_ACID == undefined)) {
            this._alertService.info(`Please select subledger for ${this.vehicle_costtracking.ACNAME}`);
            return;
        }

        if (this.BillList.length) {
            if (this.BillList[0].CAPITALPURCHASE_VCHRNO != this.vehicle_costtracking.CAPITALPURCHASE_VCHRNO) {
                this._alertService.info("Please enter same CP voucher.");
                return;
            }
        }

        if (this.BillList.length) {
            let acid = this.BillList.filter(x => x.ACID == this.vehicle_costtracking.ACID);
            for (var i of acid) {
                if (i.ACID == this.vehicle_costtracking.ACID && i.VCHRNO == this.vehicle_costtracking.VCHRNO) {
                    this._alertService.info("Duplicate Account and PI voucher detected.");
                    return;
                }
            }
        }

        let res = <VehicleCostTracking>{}
        res.VCHRNO = this.vehicle_costtracking.VCHRNO;
        res.ACID = this.vehicle_costtracking.ACID;
        res.ACNAME = this.vehicle_costtracking.ACNAME;
        res.AMOUNT = this.vehicle_costtracking.AMOUNT;
        res.VT_NO = this.vehicle_costtracking.VT_NO;
        res.CAPITALPURCHASE_VCHRNO = this.vehicle_costtracking.CAPITALPURCHASE_VCHRNO;
        res.SL_ACID = this.vehicle_costtracking.SL_ACID;
        res.SL_ACNAME = this.vehicle_costtracking.SL_ACNAME;
        res.HASSUBLEDGER = this.vehicle_costtracking.HASSUBLEDGER;
        // let xyz = res.AMOUNT.toFixed(2);
        // res.AMOUNT=Number(xyz);
        this.BillList.push(res);
        // this.vehicle_costtracking.ACID = "";
        // this.vehicle_costtracking.ACNAME = "";
        this.vehicle_costtracking.AMOUNT = 0;
        this.vehicle_costtracking.VCHRNO = "";
        let IAmount: any = [];
        for (let i of this.BillList) {
            IAmount.push(i.AMOUNT)
        }
        this.totalBillListTotal = IAmount.map((x: any) => Number(x)).reduce((a: any, b: any) => a + b, 0);
        this.masterService.focusAnyControl("acname");
        // }
    }

    PIVoucherPopup() {
        this.gridPIVoucherPopupSettings = this.masterService.getGenericGridPopUpSettingsForAdditionalCost("AdditionalCost", "ALL");
        this.genericGridPIVoucher.show();
    }

    DblClickPIVoucherSelect(value) {
        this.vehicle_costtracking.VCHRNO = value.VCHRNO;
        this.masterService.focusAnyControl("addbutton");
    }

    onDeleteClick(i,index) {
        this._vechiclecosttrackService.PIVoucherDetailInAD(i.VCHRNO).subscribe(res => {
            if (res.status == "ok") {
                if (res.result == i.VCHRNO) {
                    this._alertService.info("Additional cost is already done for this PI Voucher.");
                    return;
                } else {
                    this.BillList.splice(index, 1);
                    let IAmount: any = [];
                    for (let i of this.BillList) {
                        IAmount.push(i.AMOUNT)
                    }
                    this.totalBillListTotal = IAmount.map((x: any) => Number(x)).reduce((a: any, b: any) => a + b, 0);
                    this.masterService.focusAnyControl("acname");
                }
            }
        }, err => {
            this._alertService.error(err)
        })

    }

    ExcelUpload() {
        var excelfilename = "COST_ALLOCATION";
        var _sampleexcelfilename = "COST_ALLOCATION_SAMPLE";

        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
            {
                title: "Cost Allocation Excel Upload",
                sampleFileUrl: `/downloadSampleFile/${_sampleexcelfilename}`,
                uploadEndpoints: `/masterImport/${excelfilename}`,
                allowMultiple: false,
                acceptFormat: ".xlsx",
                filename: `${excelfilename}`,
            });
        this.fileUploadPopup.show();
    }

    fileUploadSuccess(uploadedResult) {
        this.resetAll();
        if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
            return;
        }

        if (uploadedResult.status == "ok") {
            this.BillList = [];
            let IAmount: any = [];

            for (let i in uploadedResult.result) {
                var guid = null;
                const uuidV1 = require('uuid/v1');
                guid = uuidV1();

                var newRow = <VehicleCostTracking>{};
                newRow.VCHRNO = uploadedResult.result[i].purchasE_INVOICE_NO ? uploadedResult.result[i].purchasE_INVOICE_NO : "";
                newRow.ACID = uploadedResult.result[i].accounT_ID ? uploadedResult.result[i].accounT_ID : "";
                newRow.ACNAME = uploadedResult.result[i].accounT_NAME ? uploadedResult.result[i].accounT_NAME : "";
                newRow.AMOUNT = uploadedResult.result[i].amount;
                newRow.CAPITALPURCHASE_VCHRNO = uploadedResult.result[i].capitalpurchasE_VCHRNO ? uploadedResult.result[i].capitalpurchasE_VCHRNO : "";
                newRow.REFVOUCHER_TOTAL = uploadedResult.result[i].refvoucheR_TOTAL;
                newRow.SL_ACID = uploadedResult.result[i].sL_ACID ? uploadedResult.result[i].sL_ACID : "";
                newRow.SL_ACNAME = uploadedResult.result[i].sL_ACNAME ? uploadedResult.result[i].sL_ACNAME : "";
                this.BillList.push(newRow);
                IAmount.push(newRow.AMOUNT)
            }
            this.totalBillListTotal = IAmount.map((x: any) => Number(x)).reduce((a: any, b: any) => a + b, 0);
            this.vehicle_costtracking.CAPITALPURCHASE_VCHRNO = this.BillList && this.BillList.length && this.BillList[0].CAPITALPURCHASE_VCHRNO;
            this.RefNoTotalAmount = this.BillList && this.BillList.length && this.BillList[0].REFVOUCHER_TOTAL;
            // this.vehicle_costtracking.VCHRNO = this.BillList && this.BillList.length && this.BillList[0].VCHRNO;
        }
        else {
            this._alertService.error(uploadedResult.result);
            var _errorexcelfilename = "COST_ALLOCATION_ERROR";

            if(uploadedResult.result!="Total Cost Amount not match with Ref Voucher's Total."){
                this.masterService.downloadErrorFile(`/downloadSampleFile/${_errorexcelfilename}`, _errorexcelfilename)
                .subscribe(
                    data => {
                        data.filename = _errorexcelfilename + ".xlsx";
                        this.downloadFile(data);
                    },
                    (error) => {
                        this._alertService.error(error);
                    }
                );
            }
        }
    }

    downloadFile(response: any) {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(response.content);
        element.download = response.filename;
        document.body.appendChild(element);
        element.click();
    }

    CPVoucherPopup() {
        this.gridCPVoucherPopupSettings = this.masterService.getGenericGridPopUpSettings("CPJV", "CP");
        this.genericGridCPVoucher.show();
    }

    DblClickCPVoucherSelect(value) {
        this.vehicle_costtracking.CAPITALPURCHASE_VCHRNO = value.VCHRNO;
        this.RefNoTotalAmount=value.NETAMNT;
        this.masterService.focusAnyControl("acname");
    }

    onBackClicked() {
        this.router.navigate(["/pages/account/acvouchers/localpurchase-costallocation"]);
    }

    onAmountEnter() {
        this.masterService.focusAnyControl("pivchrno");
    }

    keyPress(event: any) {
        if (event.key != "Enter" && event.key != "Tab") {
            event.preventDefault();
        }
    }

    onsubLedgerTab(i) {
        this.gridSubLedgerSetting = {
          title: "SubLedger List",
          apiEndpoints: `/getSubLedgerPageList`,
          defaultFilterIndex: 1,
          columns: [
            {
              key: "SL_ACID",
              title: "SubLedger ID",
              hidden: false,
              noSearch: false
            },
            {
              key: "SL_ACNAME",
              title: "SubLedger Name",
              hidden: false,
              noSearch: false
            }
          ]
        };
        this.gridSubLedgerSettingList.show();
      }

      onSubLedgerSelect(value) {
        this.vehicle_costtracking.SL_ACID=value.SL_ACID;
        this.vehicle_costtracking.SL_ACNAME=value.SL_ACNAME;
        this.masterService.focusAnyControl("amount");
      }

    @HostListener("document : keydown", ["$event"])
    handleKeyDownboardEvent($event: KeyboardEvent) {
        if ($event.code == "F3") {
            $event.preventDefault();
            this.resetAll();
        } else if ($event.code == "F10") {
            $event.preventDefault();
            this.onBackClicked();
        } else if ($event.code == "F6") {
            $event.preventDefault();
            if (this.DATA_MODE != 'VIEW') {
                this.Save();
            }
        }
    }
}



