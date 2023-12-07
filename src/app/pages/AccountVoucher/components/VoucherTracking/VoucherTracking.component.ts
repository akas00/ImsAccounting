import { Component, Output, Input, EventEmitter } from "@angular/core";
import { TrnMain, BillTrack, VoucherTypeEnum } from "../../../../common/interfaces";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { SettingService } from "../../../../common/services";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { ThrowStmt } from "@angular/compiler/src/output/output_ast";


@Component({
    selector: "voucherTracking",
    templateUrl: "./VoucherTracking.component.html",

    styleUrls: ["../../../modal-style.css"]
})
export class VoucherTrackingComponent {
    /** Input  */
    @Input() AdjustingAmt: number;
    @Input() AccBal: number;
    @Input() PartyName: string;
    @Input() ACBalanceType: any;
    guid: any;
    isActive: boolean = false;
    BillList: any[] = [];
    GridList: any[] = [];
    HoldALLBillList: BillTrack[]
    TrackingObject: any = <any>{};
    voucherType: VoucherTypeEnum
    AdjAmt = 0;
    rowValue: any
    row: any;
    calculateTotal: number = 0;
    selectedTranIndex: number
    isValueLoaded = false;
    constructor(
        private masterService: MasterRepo,
        private _trnMainService: TransactionService,
        private setting: SettingService,
        private alertService: AlertService,
        private loadingSerive: SpinnerService,

    ) {
        // this._trnMainService.BillTrackedList = []
        this.isRefreshClick = false;
        this.lockPopup = false;
    }

    ngOnInit() {
        this.HoldALLBillList = [];
    }

    show(adjamt = null, selectedTranIndex: number = 0) {
        this.selectedTranIndex = selectedTranIndex
        this.isActive = true;
        if(this._trnMainService.TrnMainObj.Mode!="EDIT"){
            this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList = [];
        }
        this.TrackingObject.CRAMOUNT = this._trnMainService.nullToZeroConverter(adjamt)
        if (adjamt != null || adjamt != undefined || adjamt > 0) {
            this.TrackingObject.AdjustingAmt = this._trnMainService.nullToZeroConverter(adjamt)

        }
        if (adjamt <= 0) {
            this.alertService.warning("Amount field is required for Bill Tracking!");
            this.hide();
        }

    }

    hide() {
        // if (this.lockPopup == true) {
        //     alert("Changes detected! Please Refresh the BillTrack first")
        //     return;
        // }
        this.TrackingObject.Total = 0
        this.BillList.forEach(x => x.AdjustingAmt = 0)
        this.isActive = false;
    }

    CustomerPartyObj(AccountObj, guid) {
        this.TrackingObject.Total = 0
        this.gettingMessage = 'getting data please wait..'
        this.isValueLoaded = false;
        this.guid = guid;
        this.TrackingObject.PartyName = AccountObj.ACNAME
        this.TrackingObject.ACID = AccountObj.ACID
        
        
        var vno
        var mode = 0
        if (this._trnMainService.TrnMainObj.Mode == 'VIEW') {
            mode = 1
            vno = this._trnMainService.TrnMainObj.VCHRNO
        } else if (this._trnMainService.TrnMainObj.Mode == 'EDIT') {
            mode = 0
            vno = this._trnMainService.TrnMainObj.VCHRNO
        }
        else {
            mode = 0
            vno = 0
        }

        this.masterService.DueVoucher(AccountObj.ACID, this._trnMainService.TrnMainObj.TRNDATE.toString(), "customer", true, mode, vno).subscribe(res => {
            if (res.status == "ok") {
                ////console.log("res", res.result)
                this._trnMainService.diffAmountItemForAccount = res.result.balance[0].BALANCE
                this.TrackingObject.DUEAMOUNT = res.result.dueBalance[0].DUEBALANCE
                ////console.log("ReturnResult", res.result.bill)
                this.BillList = res.result.bill;

                this.isValueLoaded = true;
                this.gettingMessage = 'getting data please wait..'
                if (res.result.bill.length == 0) {
                    this.isValueLoaded = false;
                    this.gettingMessage = 'data not found!'
                }
                if (this.BillList.length > 0) {
                    if (this.guid != null) {
                        ////console.log("Checking on GUID", this.guid, this.BillList,this.HoldALLBillList,this._trnMainService.TrnMainObj.Mode)
                        for (let i of this.BillList) {
                            for (let p of this.HoldALLBillList) {
                                ////console.log("Data", p.ID, i.BILLNO, p.VCHRNO)
                                if (this.guid == p.ID && i.BILLNO == p.VCHRNO) {
                                    i.AdjustingAmt = 0
                                    ////console.log("D", i.AdjustingAmt)
                                    i.AdjustingAmt = p.TAdjustingAmt;
                                    i.checkbox = true;
                                    ////console.log("E", i.AdjustingAmt, p.TAdjustingAmt)

                                }
                            }
                        }
//                      

                    }
                    if (this._trnMainService.TrnMainObj.Mode == 'EDIT' && this.HoldALLBillList.length==0) {
                        this.BillList.forEach(x => { 
                            this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList.forEach(y=>{
                              if(y.REFBILL==x.BILLNO){
                                x.checkbox=true;
                                x.AdjustingAmt=y.AMOUNT;
                              }
                            })
                          });
                    }

                }



            }
            else {
                this.gettingMessage = 'something went wrong!'
            }


        })

    }
    isreturnDataEmpty = false;
    gettingMessage: any
    SupplierPartyObj(AccountObj, guid) {
        this.TrackingObject.Total = 0
        ////console.log("reachedHere", this.TrackingObject)
        // ////console.log("gudiddd", guid)
        if (guid == undefined || guid == null) {
            this.alertService.warning("Please select the table row first!")
        }
        this.gettingMessage = 'getting data please wait..'
        this.isValueLoaded = false;
        this.guid = guid;
        this.TrackingObject.PartyName = AccountObj.ACNAME
        this.TrackingObject.ACID = AccountObj.ACID
        
        var vno
        var mode = 0
        if (this._trnMainService.TrnMainObj.Mode == 'VIEW') {
            mode = 1
            vno = this._trnMainService.TrnMainObj.VCHRNO
        } else if (this._trnMainService.TrnMainObj.Mode == 'EDIT') {
            mode = 0
            vno = this._trnMainService.TrnMainObj.VCHRNO
        }
        else {
            mode = 0
            vno = 0;
        }


        this.masterService.DueVoucher(AccountObj.ACID, this._trnMainService.TrnMainObj.TRNDATE.toString(), "supplier", true, mode, vno).subscribe(res => {
            if (res.status == "ok") {
                this._trnMainService.diffAmountItemForAccount = res.result.balance[0].BALANCE
                this.TrackingObject.DUEAMOUNT = res.result.dueBalance[0].DUEBALANCE
                
                // if (this.HoldALLBillList.length > 0) {
                //     this.BillList = this.HoldALLBillList.filter(x => x.ID == guid)
                //     this.isValueLoaded = true;
                //     ////console.log("CheckkBillList",this.BillList)
                // }
                // else {
                
                this.BillList = res.result.bill;
               

                this.isValueLoaded = true;
                this.gettingMessage = 'getting data please wait..'
                if (res.result.bill.length == 0) {
                    this.isValueLoaded = false;
                    this.gettingMessage = 'data not found!'

                }
                // }
                // ////console.log("checkData1", this.BillList, this.guid)
                if (this.BillList.length > 0) {
                    var Total = 0;
                    if (this.guid != null) {
                        this.TrackingObject.Total = 0
                        // ////console.log("Checking on GUID", this.guid, this.BillList)                       
                        for (let i of this.BillList) {
                            for (let p of this.HoldALLBillList) {
                                // ////console.log("Data", p.ID, i.BILLNO, p.VCHRNO)
                                if (this.guid == p.ID && i.BILLNO == p.VCHRNO) {
                                    i.AdjustingAmt = 0
                                    // ////console.log("D", i.AdjustingAmt)
                                    i.AdjustingAmt = p.TAdjustingAmt;
                                    i.checkbox = true;
                                    // ////console.log("E", i.AdjustingAmt, p.TAdjustingAmt)
                                    this.TrackingObject.Total += Number(p.TAdjustingAmt);

                                }
                            }
                        }

                    }

                    if (this._trnMainService.TrnMainObj.Mode == 'EDIT' && this.HoldALLBillList.length==0) {
                        this.BillList.forEach(x => { 
                            this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList.forEach(y=>{
                              if(y.REFBILL==x.BILLNO){
                                x.checkbox=true;
                                x.AdjustingAmt=y.AMOUNT;
                              }
                            })
                          });
                    }
                }
      
    
                
                



            }
            else {
                this.gettingMessage = 'something went wrong!'
            }

        })

    }


    calculateDueAmt() {
        let TotalDue = 0;
        for (let i of this.BillList) {
            TotalDue = TotalDue + i.DUEAMOUNT
        }
        this.TrackingObject.DUEAMOUNT = TotalDue;


    }

    GetAdjAmtValue(AdjAmt) {
        ////console.log("CheckAdjustAmount", AdjAmt)

        if (this._trnMainService.TrnMainObj.VoucherType == 17 || this._trnMainService.TrnMainObj.VoucherType == 18) {
            if (AdjAmt !== undefined && AdjAmt !== null) {
                ////console.log("journaledit");
                this.TrackingObject.AdjustingAmt = Number(AdjAmt.target.value)
            }
        }

    }

    IndAdjAmountEnter(index) {
        let totalAdjustedAmount: number = 0;
        this.BillList[index].checkbox = true;
        for (let i in this.BillList) {
            totalAdjustedAmount = totalAdjustedAmount + this._trnMainService.nullToZeroConverter(this.BillList[i].AdjustingAmt);
        }
        if (this._trnMainService.nullToZeroConverter(this.TrackingObject.AdjustingAmt) > 0) {
            let adjustableAmount = this._trnMainService.nullToZeroConverter(this.TrackingObject.AdjustingAmt) - this._trnMainService.nullToZeroConverter(totalAdjustedAmount);
            if (adjustableAmount <= this._trnMainService.nullToZeroConverter(this.BillList[index].DUEAMOUNT) && adjustableAmount > 0) {
                this.BillList[index].AdjustingAmt = adjustableAmount;
            } else if (adjustableAmount > 0 && adjustableAmount > this.BillList[index].DUEAMOUNT) {
                this.BillList[index].AdjustingAmt = this.BillList[index].DUEAMOUNT;

            }

            this.TrackingObject.Total = 0
            this.BillList.forEach(x => {
                this.TrackingObject.Total = this._trnMainService.nullToZeroConverter(this.TrackingObject.Total) + this._trnMainService.nullToZeroConverter(x.AdjAmt.target.value)
            })
            if (index < this.BillList.length) {
                if (document.getElementById("adj" + (index + 1)) != null) {
                    document.getElementById("adj" + (index + 1)).focus()
                }
            }
        }
    }
    IndAdjAmountChange(index) {
        // alert("reached"+this.BillList[index].AdjustingAmt +","+  this.BillList[index].DUEAMOUNT)
        ////console.log("CheckList",this.BillList)
        this.BillList[index].checkbox = true;
        if (this._trnMainService.nullToReturnZero(this.BillList[index].AdjustingAmt) > this._trnMainService.nullToReturnZero(this.BillList[index].DUEAMOUNT)) {
            ////console.log("CheckAmount123", index,this.BillList[index].AdjustingAmt, this.BillList[index].DUEAMOUNT)
            this.alertService.error("Due Amount cannot be less than new adjustment amount");
            this.BillList[index].AdjustingAmt = 0;

            return false;
        }
        else if (this._trnMainService.nullToReturnZero(this.TrackingObject.Total) > this._trnMainService.nullToReturnZero(this.TrackingObject.AdjustingAmt)) {
            this.alertService.error("Total Amount cannot be greater than Adjusting amount");
            this.BillList[index].AdjustingAmt = 0;

            return false;
        }
        else{
            ////console.log("CheckList1",this.BillList)
            this.calculateTotalAmount(index)
        }
  
    
        if (index < this.BillList.length) {
            if (document.getElementById("adj" + (index + 1)) != null) {
                document.getElementById("adj" + (index + 1)).focus()
            }
        }
        this.selectedRow(index);
    }

    okClick() {
        // this.checkValidation();
        // this.CheckDuplicateRow();
        // this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].CRAMNT = this.TrackingObject.AdjustingAmt
        // ////console.log("CheckOk", this._trnMainService.nullToZeroConverter(this.TrackingObject.AdjustingAmt))

        // ////console.log("CheckValue", this._trnMainService.nullToZeroConverter(this.TrackingObject.AdjustingAmt), this._trnMainService.nullToZeroConverter(this.TrackingObject.Total))
        
        if (this._trnMainService.nullToZeroConverter(this.TrackingObject.AdjustingAmt) == this._trnMainService.nullToZeroConverter(this.TrackingObject.Total)) {
            this.prepareBillTrack();

        } else if (this._trnMainService.nullToZeroConverter(this.TrackingObject.AdjustingAmt) > this._trnMainService.nullToZeroConverter(this.TrackingObject.Total)) {
            if (confirm(`Total Adjusted Amount is less than available adjusting amount.\nDo You want to proceed?`)) {
                this.prepareBillTrack();
            }
        } else {
            confirm(`Total Adjusted Amount is greater than available adjusting amount.\nPlease review your bill track?`)

        }
    }


    prepareBillTrack() {

        var guid = null;
        const uuidV1 = require('uuid/v1');
        guid = uuidV1();

        // ////console.log("checkValue", this._trnMainService.TrnMainObj.BillTrackedList, guid, this.BillList)
        // if (this._trnMainService.TrnMainObj.Mode == 'EDIT') {
            this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList = [];

        // }
        this.HoldALLBillList = [];

        for (let i of this.BillList.filter(x => x.checkbox == true)) {

            let a: BillTrack = <BillTrack>{}
            if (i.AdjustingAmt > 0 || i.AdjustingAmt < 0) {
                a.AMOUNT = i.AdjustingAmt;
                a.REFBILL = i.BILLNO;
                a.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
                a.DIVISION = i.DIVISION;
                a.ACID = this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].AccountItem.ACID;
                a.REFDIVISION = i.DIVISION;
                //Below a will not go to API
                a.TBillNo = i.CHALANNO;
                a.TTRNDATE = i.TRNDATE;
                a.TVCHRNO = i.CHALANNO;
                a.TCLRAMOUNT = i.CLRAMOUNT;
                a.TDUEAMOUNT = i.DUEAMOUNT;
                a.TAMOUNT = i.AMOUNT;
                a.TAdjustingAmt = i.AdjustingAmt;
                a.Row = this.row;
                a.VOUCHERTYPE = this._trnMainService.TrnMainObj.VoucherPrefix;
                if (this._trnMainService.TrnMainObj.Mode != 'EDIT') {
                    a.ID = this.guid;
                }else{
                    a.ID = this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].guid;
                }

                this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList.push(a);
            }
            this.isActive = false;
            // ////console.log("BillTrackedList", this._trnMainService.TrnMainObj.BillTrackedList)

        }


        // below function will store all value eiter it is check or not for View purpose
        for (let i of this.BillList) {

            let a: BillTrack = <BillTrack>{}
            if (i.AdjustingAmt > 0) {

                a.AMOUNT = i.AdjustingAmt;
                a.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
                a.VCHRNO = i.BILLNO
                a.DIVISION = i.DIVISION;
                a.ACID = this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].AccountItem.ACID;
                a.REFDIVISION = i.DIVISION;
                //Below a will not go to API
                a.TBillNo = i.CHALANNO;
                a.TTRNDATE = i.TRNDATE;
                a.TVCHRNO = i.CHALANNO;
                a.TCLRAMOUNT = i.CLRAMOUNT;
                a.TDUEAMOUNT = i.DUEAMOUNT;
                a.TAMOUNT = i.AMOUNT;
                a.TAdjustingAmt = i.AdjustingAmt;
                a.Row = this.row
                ////console.log("CheckAdj", a.ID)
                if (this._trnMainService.TrnMainObj.Mode != 'EDIT') {
                    if (a.ID == undefined || a.ID == null) {
                        a.ID = this.guid;
                    }

                }else{
                    a.ID = this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].guid;
                }


                    this.HoldALLBillList.push(a);
            }
            this.isActive = false;


        }
        ////console.log("HoldList", this.HoldALLBillList)
    }
    checkValidation() {
        this.BillList.forEach(x => {
            if (x.AdjustingAmt != 0 && x.AdjustingAmt > x.DUEAMOUNT) {
                this.alertService.error(`Adjustment Amount is greater then Due Amount for ${x.BILLNO}`);
                return;
            }
        });
    }



    AutoAdjust(value) {
        // ////console.log("CheckAuto",value)
        
        let adjustmentAmount = value + 0.00
        this.TrackingObject.Total = 0
        var CheckBox_Selected = false;
        for (let a of this.BillList) {
            a.AdjustingAmt = 0;
            if (a.checkbox == true) CheckBox_Selected = true
        }


        ////console.log("checkBillList", this.BillList)
        for (let x of this.BillList) {

            if (adjustmentAmount > 0) {
                if (x.DUEAMOUNT < 0) {
                    x.AdjustingAmt = 0
                    x.checkbox = false;

                } else if (x.DUEAMOUNT > 0 && (this._trnMainService.nullToZeroConverter(x.DUEAMOUNT) < this._trnMainService.nullToZeroConverter(adjustmentAmount))) {
                    x.AdjustingAmt = x.DUEAMOUNT;
                    x.checkbox = true;
                    adjustmentAmount = this._trnMainService.nullToZeroConverter(adjustmentAmount) - this._trnMainService.nullToZeroConverter(x.DUEAMOUNT)

                    this.TrackingObject.Total = this._trnMainService.nullToZeroConverter(this.TrackingObject.Total) + this._trnMainService.nullToZeroConverter(x.AdjustingAmt)

                } else if (x.DUEAMOUNT > 0 && (this._trnMainService.nullToZeroConverter(x.DUEAMOUNT) >= this._trnMainService.nullToZeroConverter(adjustmentAmount))) {
                    x.AdjustingAmt = parseFloat(adjustmentAmount).toFixed(2)
                    x.checkbox = true;
                    adjustmentAmount = this._trnMainService.nullToZeroConverter(adjustmentAmount) - this._trnMainService.nullToZeroConverter(x.DUEAMOUNT)
                    this.TrackingObject.Total = this._trnMainService.nullToZeroConverter(this.TrackingObject.Total) + this._trnMainService.nullToZeroConverter(x.AdjustingAmt)

                } else {
                    x.AdjustingAmt = 0.00
                    x.checkbox = false;
                }
            }
            else {
                x.checkbox = false;
            }

        }

    }
    isRefreshClick = false;
    lockPopup = false;
    Refresh() {
        this.isRefreshClick = true;
        this.lockPopup = false;
        for (let i of this.BillList) {
            i.AdjustingAmt = 0;
            i.checkbox = false;
        }
        this.TrackingObject.Total = 0;
        // this.TrackingObject = 0;

    }
    RemoveAlreadyTrackedRow() {
        var BT = this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList
        if (BT != null)
            this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList.splice(this.TrackingObject.ACID);
    }
    CheckDuplicateRow() {
        this.RemoveAlreadyTrackedRow();
    }
    selectedRow(index) {
        // this.BillList[index].checkbox = true;
        // this.RecalculateTotalBillList(index);
    }
    RecalculateTotalBillList(index) {
        this.BillList[index].AdjustingAmt = this.BillList[index].DUEAMOUNT
        if ((this.BillList[index].checkbox == false))
            this.BillList[index].AdjustingAmt = this.BillList[index].DUEAMOUNT
        if ((this.BillList[index].checkbox == true))
            this.BillList[index].AdjustingAmt = 0
        this.calculateTotalAmount(index);

    }
    calculateTotalAmount(index) {
        this.TrackingObject.Total = 0
        // ////console.log("checkDatat",this.BillList)
        this.BillList.forEach(x => {
            this.TrackingObject.Total = this._trnMainService.nullToZeroConverter(this.TrackingObject.Total) + this._trnMainService.nullToZeroConverter(x.AdjustingAmt)
        })
        if (this._trnMainService.nullToZeroConverter(this.TrackingObject.Total) > this.TrackingObject.AdjustingAmt) {
            this.TrackingObject.Total = this.TrackingObject.Total - this.BillList[index].AdjustingAmt

            this.BillList[index].AdjustingAmt = this.TrackingObject.AdjustingAmt - this._trnMainService.nullToZeroConverter(this.TrackingObject.Total);
            this.calculateTotalAmount(index)
            return;
        }
    }
    clickCheckBox(index) {
        // ////console.log("checkCheckBox",this.BillList[this.selectedTranIndex].checkbox)
        // if (this.BillList[this.selectedTranIndex].checkbox == true)
        // {
        this.BillList[index].AdjustingAmt = 0
        this.RecalculateTotalBillList(index)
        // }
        // else{
        //     this.BillList[this.selectedTranIndex].AdjustingAmt = 0

        // }

    }
    removeRowFromGuid(guid,index) {
        this.selectedTranIndex=index;
        // ////console.log("guid",guid,this._trnMainService.TrnMainObj.BillTrackedList)
        var BT = this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList
        if (BT != null && BT !== undefined) {
            if (BT.length > 0) {
                this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList = this._trnMainService.TrnMainObj.TrntranList[this.selectedTranIndex].RowWiseBillTrackedList.filter(x => x.ID != guid)

            }
        }


    }
}
