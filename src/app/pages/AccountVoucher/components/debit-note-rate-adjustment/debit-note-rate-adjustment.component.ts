import { Component, ViewChild } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { TrnProd } from "../../../../common/interfaces";
import { DebitNoteComponentService } from "./debit-note-rate-adjustment.service";
import { ActivatedRoute } from "@angular/router";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { from } from "rxjs/observable/from";
import { groupBy } from "rxjs/operator/groupBy";
import Rx from 'rxjs/Rx';
import * as _ from 'lodash';
import { PrintInvoiceComponent } from "../../../../common/Invoice/print-invoice/print-invoice.component";

@Component({
    selector: 'debit-note-rate-adjustment',
    templateUrl: './debit-note-rate-adjustment.comopnent.html',
    providers: [DebitNoteComponentService, PrintInvoiceComponent],
    styleUrls: ["../../../Style.css"]
})
export class DebitNoteRateAdjustmentComponent {


    @ViewChild("customerSupplierGeneric") customerSupplierGeneric: GenericPopUpComponent;
    gridCustomerSupplierPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("refBillNoGeneric") refBillNoGeneric: GenericPopUpComponent;
    gridRefBillNoGenericPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("itemGeneric") itemGeneric: GenericPopUpComponent;
    gridItemGenericPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("vchrnoView") vchrnoView: GenericPopUpComponent;
    @ViewChild("editVchrno") editVchrno: GenericPopUpComponent;
    gridVoucherGenericPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();



    public activerowIndex: number = 0;
    public rowIndex: any;
    public tempProdList: any[] = [];
    public differenceAmount = 0;
    public totalDifferenceAmount: number = 0;
    public totalGST = 0;
    public activeurlpath: any;

    public menuCode: string;
    public pageHeading: string;
    public CustomerSupplier: any;

    public adjustmentRate: any;
    public previousRate: any;
    public rowAdd: boolean = false;
    public VoucherPrefix: any;
    public netAmount: number;

    public totalAmount: number = 0;


    constructor(
        public masterService: MasterRepo,
        public _trnMainService: TransactionService,
        public alertService: AlertService,
        public debitNoteComponentServices: DebitNoteComponentService,
        private arouter: ActivatedRoute,
        public spinnerService: SpinnerService,
        public invoicePrint: PrintInvoiceComponent
    ) {
        this.masterService.ShowMore = false;
        this._trnMainService.initialFormLoad(16);
        this.activeurlpath = arouter.snapshot.url.join('');
        if (this.activeurlpath == 'acvouchersdebit-note-rate-adjustment') {
            this._trnMainService.initialFormLoad(16);
            this.pageHeading = 'Debit Note-Rate Adjustment'
            this.VoucherPrefix = 'DN'
            this.gridRefBillNoGenericPopupSettings = {
                title: "Bill Details",
                apiEndpoints: `/getTrnMainPITIPagedList`,
                defaultFilterIndex: 0,
                columns: [
                    {
                        key: 'CHALANNO',
                        title: 'BILL NO',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'TRNDATE',
                        title: 'DATE',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'TRNMODE',
                        title: 'TYPE',
                        hidden: false,
                        noSearch: false
                    },

                    {
                        key: 'NETAMNT',
                        title: 'AMOUNT',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'INVOICETYPE',
                        title: 'INVOICE TYPE',
                        hidden: false,
                        noSearch: false
                    },
                ]
            };

        } else if (this.activeurlpath == 'acvoucherscredit-note-rate-adjustment') {
            this._trnMainService.initialFormLoad(15);
            this.pageHeading = 'Credit Note-Rate Adjustment'
            this.VoucherPrefix = 'CN'
            this.gridRefBillNoGenericPopupSettings = {
                title: "Bill Details",
                apiEndpoints: `/getTrnMainPITIPagedList`,
                defaultFilterIndex: 0,
                columns: [
                    {
                        key: 'VCHRNO',
                        title: 'BILL NO',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'TRNDATE',
                        title: 'DATE',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'TRNMODE',
                        title: 'TYPE',
                        hidden: false,
                        noSearch: false
                    },

                    {
                        key: 'NETAMNT',
                        title: 'AMOUNT',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'INVOICETYPE',
                        title: 'INVOICE TYPE',
                        hidden: false,
                        noSearch: false
                    },
                ]
            };

        }


        this.gridCustomerSupplierPopupSettings = {
            title: "Customer & Supplier ",
            apiEndpoints: `/getAccountPagedListByMapId/Details/PartyOpeningBalance`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACNAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ACCODE",
                    title: "CODE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ADDRESS",
                    title: "ADDRESS",
                    hidden: false,
                    noSearch: false
                }

            ]
        };


        this.gridItemGenericPopupSettings = {
            title: "ITEMS",
            apiEndpoints: `/getMenuitemFromProdForReturnPagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'DESCA',
                    title: 'DESCRIPTION',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'MENUCODE',
                    title: 'ITEM CODE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'STOCK',
                    title: 'STOCK',
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: 'MRP',
                    title: 'MRP',
                    hidden: false,
                    noSearch: false
                }
                // ,
                // {
                //     key: 'BARCODE',
                //     title: 'BARCODE',
                //     hidden: true,
                //     noSearch: false
                // }
            ]
        }

        var PID = this.masterService.PhiscalObj.PhiscalID;
        PID = PID.replace("/","ZZ");
        var division = this.masterService.PhiscalObj.Div;
        this.gridVoucherGenericPopupSettings = {
            title: "Vouchers",
            apiEndpoints: `/getMasterPagedListOfAny/${PID}/vtype/${division}`,
            defaultFilterIndex: 1,
            columns: [
                {
                    key: 'TDATE',
                    title: 'DATE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'VCHRNO',
                    title: 'VOUCHER NO.',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'VOUCHERREMARKS',
                    title: 'TYPE',
                    hidden: false,
                    noSearch: false
                },
            ]
        }


    }

    ngOninit() {


        this._trnMainService.addRow();
        this._trnMainService.TrnMainObj.CNDN_MODE = 2;

    }


    RowClick(index) {
        this.activerowIndex = this.rowIndex = index;
        this.masterService.ShowMore = false;
    }

    onCustomerSupplierPopUPTab() {
        this.customerSupplierGeneric.show()
    }

    onRefBillNoPopUPTab(event) {
        event.preventDefault();
        this.refBillNoGeneric.show(this._trnMainService.TrnMainObj.PARAC);
    }

    onItemPopUPTab() {

        if (this._trnMainService.TrnMainObj.REFBILL == null || this._trnMainService.TrnMainObj.REFBILL == "") {
            this.alertService.info('Please Load the ref bill for return');
            return;
        }
        this.itemGeneric.show(this._trnMainService.TrnMainObj.REFBILL)

    }

    onItemDoubleClickCustomerSupplier(customerSuppleir) {
        this.CustomerSupplier = customerSuppleir.PType;
        this._trnMainService.TrnMainObj.BILLTO = customerSuppleir.ACNAME;
        this._trnMainService.TrnMainObj.PARAC = customerSuppleir.ACID;
        this._trnMainService.TrnMainObj.TRNAC = customerSuppleir.ACID;
        this._trnMainService.TrnMainObj.BILLTOADD = customerSuppleir.ADDRESS;
        this._trnMainService.TrnMainObj.TRNMODE = customerSuppleir.PMODE;
        this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = customerSuppleir.ORG_TYPE;
        this._trnMainService.TrnMainObj.CREDITDAYS = customerSuppleir.CRPERIOD;

    }

    onItemDoubleClickRefBillNO(event) {
        this.CustomerSupplier = event.PType;
        this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
        this._trnMainService.TrnMainObj.TRNMODE = event.TRNMODE;
        this._trnMainService.TrnMainObj.BILLTO = event.ACNAME;
        this._trnMainService.TrnMainObj.BILLTOADD = event.ADDRESS;
        this._trnMainService.TrnMainObj.PARAC = event.PARAC
    }

    onItemDoubleClick(value) {

        this._trnMainService.TrnMainObj.ProdList.filter(x => !isNaN(x.ADJUSTMENTNEWRATE)).forEach(i => { this.menuCode = i.MENUCODE })
        if (this.menuCode == value.MCODE) {
            this.alertService.info('Same Item is Selected');
        } else {
            this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
            this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = value.TRNTYPE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MENUCODE = value.MCODE
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ITEMDESC = value.DESCA
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCH = value.BATCH
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].STOCK = value.STOCK
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Quantity = value.STOCK;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].UNIT = value.UNIT
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MRP = value.MRP
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE = value.RATE
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GSTRATE = value.GST
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].WEIGHT = value.GWEIGHT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR = 1;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SELECTEDITEM = <any>{};
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].REMARKS = value.REMARKS
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].INDDISCOUNT = value.INDDISCOUNT
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PrimaryDiscount = value.PrimaryDiscount;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SecondaryDiscount = value.SecondaryDiscount;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].LiquiditionDiscount = value.LiquiditionDiscount;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].NETAMOUNT = ((value.STOCK * value.RATE) + (value.GST / 100))
        }
    }


    onBlurClick(index) {
        this.CustomerSupplierValidation(index)

    }

    CustomerSupplierValidation(index) {

        if (this.activeurlpath == 'acvouchersdebit-note-rate-adjustment') {
            if (this.CustomerSupplier == 'C') {
                if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].RATE) < this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].ADJUSTMENTNEWRATE)) {
                    this.DifferenceAmountCalculation()
                    this.rowAdd = true;
                } else {
                    this.alertService.info('Adjustment Rate should be grater than Previous Rate')
                }

            } else if (this.CustomerSupplier == 'V') {
                if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].RATE) > this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].ADJUSTMENTNEWRATE)) {
                    this.DifferenceAmountCalculation()
                    this.rowAdd = true;
                } else {
                    this.alertService.info('Adjustment Rate should be less than Previous Rate')
                }

            }

        } else if (this.activeurlpath == 'acvoucherscredit-note-rate-adjustment') {

            if (this.CustomerSupplier == 'C') {
                if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].RATE) > this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].ADJUSTMENTNEWRATE)) {
                    this.DifferenceAmountCalculation()
                    this.rowAdd = true;

                } else {
                    this.alertService.info('Adjustment Rate should be less than Previous Rate')
                }

            } else if (this.CustomerSupplier == 'V') {
                if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].RATE) < this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].ADJUSTMENTNEWRATE)) {
                    this.DifferenceAmountCalculation()
                    this.rowAdd = true;

                } else {
                    this.alertService.info('Adjustment Rate should be greater than Previous Rate')
                }

            }

        }

    }


    DifferenceAmountCalculation() {
        this.totalDifferenceAmount = 0;
        this.totalGST = 0;
        this.totalAmount = 0;
        this._trnMainService.TrnMainObj.ProdList.filter(x => !isNaN(x.ADJUSTMENTNEWRATE)).forEach(i => {
            i.DIFFERENCEAMOUNT = Math.abs(i.STOCK * (i.RATE - i.ADJUSTMENTNEWRATE));
            this.totalDifferenceAmount += Math.abs(i.STOCK * (i.RATE - i.ADJUSTMENTNEWRATE));
            i.VAT = (i.DIFFERENCEAMOUNT * (i.GSTRATE / 100));
            this.totalGST += i.VAT;
            i.NETAMOUNT = i.DIFFERENCEAMOUNT + i.VAT
            this.totalAmount = this._trnMainService.nullToZeroConverter(this.totalAmount) + this._trnMainService.nullToZeroConverter(i.NETAMOUNT);

        });

    }

    addNewRow(event, index) {
        var i = index + 1;
        event.preventDefault();
        this.CustomerSupplierValidation(index);

        if (this._trnMainService.TrnMainObj.Mode.toUpperCase() == "NEW") {
            if (this.rowAdd == true) {
                this._trnMainService.addRow();
                this.activerowIndex = i + 1;
                setTimeout(() => {
                    document.getElementById("Code" + i).focus();
                }, 10);

            }
        }

    }
    isTableRowSelected(i) {
        return this.activerowIndex == i;
    }

    deleteRow() {
        if (confirm("Are you sure u you want to delete the Row?")) {
            this._trnMainService.TrnMainObj.ProdList.splice(this.activerowIndex, 1);
            if (this._trnMainService.TrnMainObj.ProdList.length == 0) {
                this._trnMainService.addRow();
            }
        }
    }

    removeRow(index) {

        this._trnMainService.TrnMainObj.ProdList[index].MENUCODE = ""
        this._trnMainService.TrnMainObj.ProdList[index].ITEMDESC = ""
        this._trnMainService.TrnMainObj.ProdList[index].BATCH = ""
        this._trnMainService.TrnMainObj.ProdList[index].STOCK = null
        this._trnMainService.TrnMainObj.ProdList[index].UNIT = null
        this._trnMainService.TrnMainObj.ProdList[index].MRP = null
        this._trnMainService.TrnMainObj.ProdList[index].RATE = null
        this._trnMainService.TrnMainObj.ProdList[index].DIFFERENCEAMOUNT = null
        this._trnMainService.TrnMainObj.ProdList[index].REMARKS = ""


    }

    onResetClick() {
        if (this.VoucherPrefix == "DN") {
            this._trnMainService.initialFormLoad(16);
            this._trnMainService.TrnMainObj.VoucherType = 16;
        } else {
            this._trnMainService.initialFormLoad(15);
            this._trnMainService.TrnMainObj.VoucherType = 15;

        }
        this.totalDifferenceAmount = 0
        this.totalAmount = 0
        this.totalGST = 0
    }

    onSaveClick() {
        this._trnMainService.TrnMainObj.CNDN_MODE = 2;
        this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(x => x.MENUCODE != null && x.MENUCODE != "")
        this._trnMainService.TrnMainObj.JournalGstList = []
        this._trnMainService.TrnMainObj.CNDN_MODE = 2;
        this._trnMainService.TrnMainObj.ProdList.forEach(x => {
            this._trnMainService.TrnMainObj.JournalGstList.push({
                VCHRNO: this._trnMainService.TrnMainObj.VCHRNO,
                DIVISION: this._trnMainService.TrnMainObj.DIVISION,
                GSTRATE: x.GSTRATE,
                TAXABLE: x.GSTRATE > 0 ? x.DIFFERENCEAMOUNT : 0,
                NONTAXABLE: x.GSTRATE == 0 ? x.DIFFERENCEAMOUNT : 0,
                GST: x.VAT,
                TOTGST: this.totalGST,
                NETAMNT: this.totalAmount,
                ITC_ELIGIBILITY: 'Inputs',
                REFTRNAC: null,
                GSTMODE: 0,
                PARAC: this._trnMainService.TrnMainObj.PARAC
            })
        })
        this.calculateTotalGstByRate()
        this._trnMainService.TrnMainObj.NETAMNT = this.totalAmount;
        if (this.VoucherPrefix == "DN") {
            this._trnMainService.TrnMainObj.VoucherType = 16;
            this._trnMainService.TrnMainObj.VoucherPrefix = "DN";
        } else {
            this._trnMainService.TrnMainObj.VoucherType = 15;
            this._trnMainService.TrnMainObj.VoucherPrefix = "CN";


        }
        this.spinnerService.show("Please wait!Saving Data.")
        this.debitNoteComponentServices.saveDebitNoteRateAdjustment(this._trnMainService.TrnMainObj)
            .subscribe((res) => {

                if (res.status == 'ok') {
                    this.totalDifferenceAmount = 0
                    this.totalAmount = 0
                    this.totalGST = 0
                    this.spinnerService.hide()
                    if (this.VoucherPrefix == "DN") {
                        this._trnMainService.initialFormLoad(16);
                        this._trnMainService.TrnMainObj.VoucherType = 16;
                    } else {
                        this._trnMainService.initialFormLoad(15);
                        this._trnMainService.TrnMainObj.VoucherType = 15;

                    }
                    this.alertService.success(res.result)
                } else {
                    this.spinnerService.hide()
                    this.alertService.error(res.result)
                }
            }, error => {
                this.spinnerService.hide()
                this.alertService.error(error)
            })

    }

    onViewClick() {

        if (this.activeurlpath == 'acvouchersdebit-note-rate-adjustment') {
            this.vchrnoView.show(this._trnMainService.TrnMainObj.PARAC, false, "dnlistforview");
        }
        else {
            this.vchrnoView.show(this._trnMainService.TrnMainObj.PARAC, false, "cnlistforview");
        }
    }

    onEditClick() {
        if (this.activeurlpath == 'acvouchersdebit-note-rate-adjustment') {
            this.editVchrno.show(this._trnMainService.TrnMainObj.PARAC, false, "dnlistforview");
        }
        else {
            this.editVchrno.show(this._trnMainService.TrnMainObj.PARAC, false, "cnlistforview");
        }
    }

    onEditVoucherDoubleClick(vouchers) {
        if (vouchers.CNDN_MODE == 2) {
            this.spinnerService.show("Loading Data. Please Wait!")
            this.debitNoteComponentServices.LoadRateAdjustment(vouchers.VCHRNO).subscribe((res) => {
                let tmp = res.result.main[0];
                this._trnMainService.TrnMainObj = res.result.main[0];
                this._trnMainService.TrnMainObj.ProdList = res.result.prodList;
                this.DifferenceAmountCalculation();
                this._trnMainService.TrnMainObj.Mode = "EDIT";
                this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
                this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = tmp.TRNTYPE;
                this.CustomerSupplier = tmp.PTYPE;
                this.spinnerService.hide();
            }, error => {
                this.alertService.error(error);
                this.spinnerService.hide();
            })
        } else {
            this.alertService.warning(`Cannot Load Voucher!! The Voucher is ${vouchers.VOUCHERREMARKS} based.`);
        }
    }

    onVoucherDoubleClick(vouchers) {
        if (vouchers.CNDN_MODE == 2) {
            this.spinnerService.show("Loading Data. Please Wait!")
            this.debitNoteComponentServices.LoadRateAdjustment(vouchers.VCHRNO).subscribe((res) => {
                this._trnMainService.TrnMainObj = res.result.main[0];
                this._trnMainService.TrnMainObj.ProdList = res.result.prodList;
                this._trnMainService.TrnMainObj.Mode = "VIEW";
                this.spinnerService.hide();
                this.DifferenceAmountCalculation();
            }, error => {
                this.alertService.error(error);
                this.spinnerService.hide();
            })
        } else {
            this.alertService.warning(`Cannot Load Voucher!! The Voucher is ${vouchers.VOUCHERREMARKS} based.`);
            return;
        }
    }

    public groupedData: any
    calculateTotalGstByRate() {
        




    }

    onCancelClick() {
        let prod = this._trnMainService.TrnMainObj.ProdList.filter(x => x.MENUCODE != "" && x.MENUCODE != null && x.MENUCODE != undefined);
        if (prod.length == 0) {
            this.alertService.error("Please load Voucher to Cancel");
            return;
        }
        let data = <any>{};
        if (this.activeurlpath == 'acvouchersdebit-note-rate-adjustment') {
            data.VoucherType = 16;
            data.VoucherPrefix = "DN";

        } else {
            data.VoucherType = 15;
            data.VoucherPrefix = "CN";

        }
        data.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
        data.MODE = "CANCEL";
        if (confirm("Are you sure to cancel this voucher?")) {
            this.spinnerService.show(`Cancelling Voucher ${data.VCHRNO}. Please Wait.`);
            this.masterService.cancelAccoutingVoucher(data).subscribe((res) => {
                this.spinnerService.hide();
                this.alertService.success(res.result);
            }, error => {
                this.spinnerService.hide();
                this.alertService.error(error);
            })
        }
    }



    onPrintClick() {
        try {
            this.spinnerService.show("Getting Invoice Data.Please Wait");
            if (this._trnMainService.TrnMainObj.ProdList.length) {
                this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC, this.activeurlpath, this._trnMainService.TrnMainObj.REFBILL).subscribe((res) => {
                    let invoicedata = res.result;
                    invoicedata.REFBILL = res.result.VCHRNO;
                    invoicedata.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
                    invoicedata.TRNDATE = this._trnMainService.TrnMainObj.TRNDATE;
                    this.invoicePrint.printInvoice(invoicedata, res.result2, "RateAdjustment", this.activeurlpath);
                    this.spinnerService.hide();
                }, error => {
                    this.spinnerService.hide();
                    this.alertService.error(error);
                })
            } else {
                this.alertService.error("Unable to Print.This voucher doesnot exist or has been cancelled");
            }
        } catch (e) {
            this.spinnerService.hide();
            this.alertService.error(e);
        }
    }




}
