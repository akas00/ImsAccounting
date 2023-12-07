import { Component, OnInit, HostListener, ViewChild, ElementRef } from "@angular/core";
import { BillTracking } from "../../../../common/interfaces/bill-tracking.interface";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import * as moment from 'moment'
import { BillTrackingAmendmentService } from "./bill-tracking-amendment.service";
@Component({
    selector: 'bill-tracking-amendment',
    templateUrl: './bill-tracking-amendment.component.html',
    styleUrls: ["../../../Style.css"]

})
export class BillTrackingAmendmentComponent implements OnInit {
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericDueGrid") genericDueGrid: GenericPopUpComponent;
    gridDuePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    public BillTrack: BillTracking = <BillTracking>{}
    public pendingVoucherList = [];
    public isActive: boolean = false;
    public selectVoucherIndex: number = 0;
    public voucherLoadObj = {
        VoucherType: 0,
        VoucherPrefix: "",
        Mode: "NEW",
        DIVISION: "",
        MWAREHOUSE: ""
    }
    isBullTracking : number = 0;
    constructor(private spinnerService: SpinnerService, private alertService: AlertService, private masterServicce: MasterRepo, public _transactionService: TransactionService, public billService: BillTrackingAmendmentService) {
        this.voucherLoadObj.VoucherType = 71;
        this.voucherLoadObj.VoucherPrefix = "#";
        this.voucherLoadObj.DIVISION = this._transactionService.userProfile.CompanyInfo.INITIAL;
        this.voucherLoadObj.MWAREHOUSE = this._transactionService.userProfile.userWarehouse
        this.BillTrack.PARTYTYPE = "Party Payment";






        this.gridPopupSettings = {
            title: "Party List",
            apiEndpoints: `/getAccountPagedListByMapId/Details/${this.BillTrack.PARTYTYPE}`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'ACNAME',
                    title: 'Account Name',
                    hidden: false,
                    noSearch: false
                },
               
            ]
        }
        this.gridDuePopupSettings = {
            title: "Voucher List",
            apiEndpoints: `/getRVPVPendingAmount/${this.BillTrack.PARTYTYPE}/${this.BillTrack.ACID}`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'VCHRNO',
                    title: 'Voucher No',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'AMOUNT',
                    title: 'Amount',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'TRACKED_AMOUNT',
                    title: 'Tracked Amount',
                    hidden: false,
                    noSearch: false
                }

            ]
        }
    }
    ngOnInit() {
        this.initialFormLoad();
    }

    selectParty() {
        if (this.BillTrack.PARTYTYPE == null || this.BillTrack.PARTYTYPE == undefined || this.BillTrack.PARTYTYPE == "") {
            this.alertService.error("Please select party type to proceed");
            return;
        } else {
            this.genericGrid.show()
        }
    }


    selectVoucher() {
        if (this.BillTrack.PARTYTYPE == null || this.BillTrack.PARTYTYPE == undefined || this.BillTrack.PARTYTYPE == "") {
            this.alertService.error("Please select party type to proceed");
            return;
        }

        if (this.BillTrack.ACID == null || this.BillTrack.ACID == undefined || this.BillTrack.ACID == "") {
            this.alertService.error("Please select party name to proceed");
            return;
        }
        this.billService.getDuePendingAmount(this.BillTrack.PARTYTYPE, this.BillTrack.ACID).subscribe((res) => {
            if (res.status == "ok") {
                this.pendingVoucherList = res.result;
            } else {
                this.alertService.error(res.message);
            }
        })
        this.isActive = true;
    }

    OnPartyChange() {
        this.gridPopupSettings.apiEndpoints = `/getAccountPagedListByMapId/Details/${this.BillTrack.PARTYTYPE}`
    }

    initialFormLoad() {
        this.BillTrack = Object.assign({})
        this.BillTrack.SHOWMORE = true;
        this.BillTrack.SHOWZEROBALANCE = true
        this.BillTrack.BILL = []
        this.masterServicce.getVoucherNo(this.voucherLoadObj).subscribe((res) => {
            this.BillTrack.VCHRNO = res.result.VCHRNO
        })
        this.masterServicce.getCurrentDate().subscribe((res) => {
            this.BillTrack.TRNDATE = moment(res.Date).format("YYYY-MM-DD")
        })
    }
    partyAcid: string = null
    dblClickPartyItem(partyData) {
        this.BillTrack.ACID = partyData.ACID;
        this.BillTrack.ACNAME = partyData.ACNAME;
        this.partyAcid = partyData.ACID;
        ////console.log("checkMode",this._transactionService.TrnMainObj.Mode)
        this.spinnerService.show("Getting BillTack data. Please Wait")
        this.DueList(partyData)
        this.NonTracking(partyData)
        this.billService.getDuePendingAmount(this.BillTrack.PARTYTYPE, this.BillTrack.ACID).subscribe((res) => {
            if (res.status == "ok") {
                this.pendingVoucherList = res.result;
            } else {
                this.alertService.error(res.message);
            }
        })
    }
  
    dblClickDueItem(partyData) {
        this.BillTrack.REFVCHRNO = partyData.VCHRNO;
        this.isActive = !this.isActive;
        this.selectVoucherIndex = 0;
        this.BillTrack.ADJUSTINGAMOUNT = this._transactionService.nullToZeroConverter(partyData.AMOUNT) - this._transactionService.nullToZeroConverter(partyData.TRACKED_AMOUNT)
    }
    onKeydownPrevent(event) {
        if (event.key === "Enter" || event.key === "Tab") { }
        else {
            event.preventDefault();
        }
    }

   


    validateAdjustingAmount() {
        if (this.BillTrack.BILL.length) {
            this.BillTrack.BILL.forEach(x => {
                x.TAdjustingAmt = 0;
            })
        }
        this.BillTrack.TOTALADJAMOUNT = 0
        if (this._transactionService.nullToZeroConverter(this.BillTrack.ADJUSTINGAMOUNT) > this._transactionService.nullToZeroConverter(this.BillTrack.BALANCE)) {
            this.alertService.error("Adjustable amount entry greater than Balance")
            this.BillTrack.ADJUSTINGAMOUNT = 0
            return;
        }
    }


    saveBillTrack() {
        if (this.BillTrack.ADJUSTINGAMOUNT == null || this.BillTrack.ADJUSTINGAMOUNT == undefined || this.BillTrack.ADJUSTINGAMOUNT <= 0) {
            this.alertService.error("Please Adjust some value to save.");
            return;
        }
        if (this.BillTrack.BILL.length > 0) {
            if (this.BillTrack.REFVCHRNO == null || this.BillTrack.REFVCHRNO == "" || this.BillTrack.REFVCHRNO == undefined) {
                this.BillTrack.AdjustmentMode = "Manual";
                this.BillTrack.BILL.forEach(x => {
                    x.VCHRNO = x.BILLNO;
                    x.REFBILL = this.BillTrack.VCHRNO;
                    x.AMOUNT = this._transactionService.nullToZeroConverter(x.TAdjustingAmt);
                })
            } else {
                this.BillTrack.AdjustmentMode = "Voucher";
                this.BillTrack.BILL.forEach(x => {
                    x.VCHRNO = x.BILLNO
                    x.REFBILL = this.BillTrack.REFVCHRNO
                    x.AMOUNT = this._transactionService.nullToZeroConverter(x.TAdjustingAmt)
                })
            }
            this.spinnerService.show("Saving Data.Please Wait")
            this.billService.saveBillTrack(this.BillTrack).subscribe((res) => {
                if (res.status == "ok") {
                    this.spinnerService.hide();
                    this.alertService.success(res.result)
                    this.initialFormLoad()
                } else {
                    this.spinnerService.hide();
                    this.alertService.error(res.result)
                }
            }, error => {
                this.spinnerService.hide();
                this.alertService.error(error)
            })
        } else {
            this.alertService.error("Please Load at least one Bill Track to save")
        }
    }

    autoAdjust() {
        this.BillTrack.TOTALADJAMOUNT = 0
        if (this.BillTrack.BILL.length > 0) {
            if (this._transactionService.nullToZeroConverter(this.BillTrack.ADJUSTINGAMOUNT) > 0) {
                let adjustmentAmount: number = this._transactionService.nullToZeroConverter(this.BillTrack.ADJUSTINGAMOUNT);
                for (let x of this.BillTrack.BILL) {
                    if (adjustmentAmount > 0) {
                        if (x.DUEAMOUNT < 0) {
                            x.TAdjustingAmt = 0
                        } else if (x.DUEAMOUNT > 0 && (this._transactionService.nullToZeroConverter(x.DUEAMOUNT) <= this._transactionService.nullToZeroConverter(adjustmentAmount))) {
                            x.TAdjustingAmt = x.DUEAMOUNT;
                            adjustmentAmount = this._transactionService.nullToZeroConverter(adjustmentAmount) - this._transactionService.nullToZeroConverter(x.DUEAMOUNT)
                            this.BillTrack.TOTALADJAMOUNT = this._transactionService.nullToZeroConverter(this.BillTrack.TOTALADJAMOUNT) + this._transactionService.nullToZeroConverter(x.TAdjustingAmt)

                        } else if (x.DUEAMOUNT > 0 && (this._transactionService.nullToZeroConverter(x.DUEAMOUNT) > this._transactionService.nullToZeroConverter(adjustmentAmount))) {
                            x.TAdjustingAmt = adjustmentAmount
                            adjustmentAmount = this._transactionService.nullToZeroConverter(adjustmentAmount) - this._transactionService.nullToZeroConverter(x.DUEAMOUNT)
                            this.BillTrack.TOTALADJAMOUNT = this._transactionService.nullToZeroConverter(this.BillTrack.TOTALADJAMOUNT) + this._transactionService.nullToZeroConverter(x.TAdjustingAmt)

                        } else {
                            x.TAdjustingAmt = 0
                        }
                    }

                }
            } else {
                this.alertService.error("Please Enter Adjusting Amount")
                return;
            }
        } else {
            this.alertService.error("Please Load BillTrack Data to save")

        }

        if (this.BillTrack.REFVCHRNO == null || this.BillTrack.REFVCHRNO == "" || this.BillTrack.REFVCHRNO == undefined) {
            this.prepareBillTrackVoucherWise(this.BillTrack, this.pendingVoucherList);
        }
    }

    onADjustmentChange(index) {
        if (this._transactionService.nullToZeroConverter(this.BillTrack.BILL[index].TAdjustingAmt) > this.BillTrack.BILL[index].DUEAMOUNT) {
            this.alertService.error("Adjustment Amount greater than due amount detected")
            this.BillTrack.BILL[index].TAdjustingAmt = 0;
            return;
        }
        this.BillTrack.TOTALADJAMOUNT = 0;
        this.BillTrack.BILL.forEach(x => {
            this.BillTrack.TOTALADJAMOUNT = this._transactionService.nullToZeroConverter(this.BillTrack.TOTALADJAMOUNT) + this._transactionService.nullToZeroConverter(x.TAdjustingAmt)
        })
        let totalAdjustingAmount: number = 0
        if (this._transactionService.nullToZeroConverter(this.BillTrack.ADJUSTINGAMOUNT) == 0) {
            totalAdjustingAmount = this._transactionService.nullToZeroConverter(this.BillTrack.BALANCE)
        } else {
            totalAdjustingAmount = this._transactionService.nullToZeroConverter(this.BillTrack.ADJUSTINGAMOUNT)
        }
        if (this._transactionService.nullToZeroConverter(this.BillTrack.TOTALADJAMOUNT) > this._transactionService.nullToZeroConverter(totalAdjustingAmount)) {
            this.alertService.error("Adjusted amount is greater than Adjustable amount")
            this.BillTrack.BILL[index].TAdjustingAmt = 0;
            this.BillTrack.TOTALADJAMOUNT = 0;
            this.BillTrack.BILL.forEach(x => {
                this.BillTrack.TOTALADJAMOUNT = this._transactionService.nullToZeroConverter(this.BillTrack.TOTALADJAMOUNT) + this._transactionService.nullToZeroConverter(x.TAdjustingAmt)
            })
            return;
        }
        if (index + 1 < this.BillTrack.BILL.length) {
            document.getElementById("adj" + (index + 1)).focus()
        }
    }

    IndividualAdjustment(index) {
        let totalAdjustedAmount: number = 0;
        for (let i in this.BillTrack.BILL) {
            totalAdjustedAmount = totalAdjustedAmount + this._transactionService.nullToZeroConverter(this.BillTrack.BILL[i].TAdjustingAmt);
        }
        if (this._transactionService.nullToZeroConverter(this.BillTrack.ADJUSTINGAMOUNT) > 0) {
            let adjustableAmount = this._transactionService.nullToZeroConverter(this.BillTrack.ADJUSTINGAMOUNT) - this._transactionService.nullToZeroConverter(totalAdjustedAmount);
            if (adjustableAmount <= this._transactionService.nullToZeroConverter(this.BillTrack.BILL[index].DUEAMOUNT) && adjustableAmount > 0) {
                this.BillTrack.BILL[index].TAdjustingAmt = adjustableAmount;
            } else if (adjustableAmount > 0 && adjustableAmount > this.BillTrack.BILL[index].DUEAMOUNT) {
                this.BillTrack.BILL[index].TAdjustingAmt = this.BillTrack.BILL[index].DUEAMOUNT;

            }

            this.BillTrack.TOTALADJAMOUNT = 0
            this.BillTrack.BILL.forEach(x => {
                this.BillTrack.TOTALADJAMOUNT = (this.BillTrack.TOTALADJAMOUNT) + this._transactionService.nullToZeroConverter(x.TAdjustingAmt)
            })
            if (index < this.BillTrack.BILL.length) {
                if (document.getElementById("adj" + (index + 1)) != null) {
                    document.getElementById("adj" + (index + 1)).focus()
                }
            }
        }
    }

    prepareBillTrackVoucherWise(BillTrackList: BillTracking, voucherlist: any) {
        for (let v of voucherlist) {
            v.PENDINGAMOUNT = this._transactionService.nullToZeroConverter(v.AMOUNT) - this._transactionService.nullToZeroConverter(v.TRACKED_AMOUNT);
        }
        for (let b of BillTrackList.BILL) {
            b.TempAdjustingAmount = b.TAdjustingAmt;
        }

        for (let bill of BillTrackList.BILL) {
            bill.TRACK = [];
            if (bill.TempAdjustingAmount > 0) {
                for (let voucher of voucherlist) {
                    if (bill.TempAdjustingAmount < voucher.PENDINGAMOUNT) {
                        bill.TRACK.push({
                            TRACKBY: voucher.VCHRNO,
                            TRACKAMOUNT: bill.TempAdjustingAmount
                        });
                        voucher.PENDINGAMOUNT = this._transactionService.nullToZeroConverter(voucher.PENDINGAMOUNT) -
                            this._transactionService.nullToZeroConverter(bill.TAdjustingAmt);
                        bill.TempAdjustingAmount = 0;
                        break;
                    }

                    if ((bill.TempAdjustingAmount == voucher.PENDINGAMOUNT) && voucher.PENDINGAMOUNT > 0) {
                        bill.TRACK.push({
                            TRACKBY: voucher.VCHRNO,
                            TRACKAMOUNT: bill.TempAdjustingAmount
                        });
                        voucher.PENDINGAMOUNT = 0;
                        bill.TempAdjustingAmount = 0;
                        break;
                    }

                    if (bill.TempAdjustingAmount > voucher.PENDINGAMOUNT) {
                        bill.TRACK.push({
                            TRACKBY: voucher.VCHRNO,
                            TRACKAMOUNT: voucher.PENDINGAMOUNT
                        });
                        bill.TempAdjustingAmount = bill.TempAdjustingAmount - voucher.PENDINGAMOUNT;
                        voucher.PENDINGAMOUNT = 0;
                        continue;
                    }
                }
            }
        }
    }

    @HostListener("document : keydown", ["$event"])
    updown($event: KeyboardEvent) {
        if ($event.code == "F1") {
            $event.preventDefault();
            this.BillTrack.SHOWMORE = !this.BillTrack.SHOWMORE;
        } else if ($event.code == "ArrowDown") {
            $event.preventDefault();
            if (this.selectVoucherIndex == this.pendingVoucherList.length) {
                this.selectVoucherIndex = this.pendingVoucherList.length;
            } else {
                this.selectVoucherIndex++;
            }

        } else if ($event.code == "ArrowUp") {
            $event.preventDefault();
            if (this.selectVoucherIndex == 0) {
                this.selectVoucherIndex = 0
            } else {
                this.selectVoucherIndex--;
            }

        }
    }
    DeleteExeedTrack(){}
    DoBillTrackFromBeg(){
        if(!this.partyAcid) {this.alertService.warning("Please select the party name first!");return;}
        this._transactionService.TrnMainObj.Mode = 'VIEW'
        this.DueList(this.partyAcid);
        this.NonTracking(this.partyAcid);
    }
    DueList(partyData){
        this.masterServicce.DueVoucherAmendment(partyData.ACID,
            this.BillTrack.TRNDATE,
            this.BillTrack.PARTYTYPE == "Party Payment" ? "supplier" : "customer",
            this.BillTrack.SHOWZEROBALANCE,
            this._transactionService.TrnMainObj.Mode == 'VIEW'?1:0,

        ).subscribe((res) => {
            if (res.status == "ok") {
                this.spinnerService.hide()
                this.BillTrack.LEDGERBALANCE = res.result.balance[0].BALANCE
                this.BillTrack.DUEBALANCE = res.result.dueBalance[0].DUEBALANCE
                this.BillTrack.BALANCE = Math.abs(Math.round(this._transactionService.nullToZeroConverter(res.result.dueBalance[0].DUEBALANCE) - this._transactionService.nullToZeroConverter(res.result.balance[0].BALANCE)))
                this.BillTrack.BILL = res.result.bill
               
            } else {
                this.spinnerService.hide()
                this.alertService.error(res.result)
            }
        }, error => {
            this.spinnerService.hide()
            this.alertService.error(error)
        })
    }
    NonTracking(partyData){
        this.masterServicce.DueVoucherAmendment_Nontracking(partyData.ACID,
            this.BillTrack.TRNDATE,
            this.BillTrack.PARTYTYPE == "Party Payment" ? "supplier" : "customer",
            this.BillTrack.SHOWZEROBALANCE,
            this._transactionService.TrnMainObj.Mode == 'VIEW'?1:0,

        ).subscribe((res) => {
            if (res.status == "ok") {
                this.spinnerService.hide()
                // this.BillTrack.LEDGERBALANCE = res.result.balance[0].BALANCE
                // this.BillTrack.DUEBALANCE = res.result.dueBalance[0].DUEBALANCE
                // this.BillTrack.BALANCE = Math.abs(Math.round(this._transactionService.nullToZeroConverter(res.result.dueBalance[0].DUEBALANCE) - this._transactionService.nullToZeroConverter(res.result.balance[0].BALANCE)))
                this.BillTrack.NonTracking = res.result.bill
               
            } else {
                this.spinnerService.hide()
                this.alertService.error(res.result)
            }
        }, error => {
            this.spinnerService.hide()
            this.alertService.error(error)
        })
    }
    BullTracking(value){
       
    }
}



