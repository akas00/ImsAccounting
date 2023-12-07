import { Component, Input, OnChanges, HostListener, Inject, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: "report-body",
    templateUrl: "./report-body.component.html",
})
export class ReportBodyComponent implements OnChanges {

    public tabindex: string = "list"
    @Input() particularsRow: any
    @Input() ACNAME: string
    @Input() DATE1: string
    @Input() DATE2: string
    @Input() totalRow: any
    @Input() listSetting: GenericReportListSettings;
    @Input() reportType: string
    @Input() voucherName: string
    public dataList: any
    public dataListTotal: any
    public selectedRowIndex = 0
    @ViewChild('dataTable') dataTable: ElementRef

    constructor(private router: Router, @Inject(DOCUMENT) private document: any, ) {

    }
    ngOnChanges(changes: any) {

        if (changes.reportType) {
            this.reportType = changes.reportType.currentValue
        }

        if (changes.listSetting) {
            this.listSetting = changes.listSetting.currentValue;
        }
        if (changes.particularsRow) {
            this.dataList = changes.particularsRow.currentValue
        }
        if (changes.totalRow) {
            this.dataListTotal = changes.totalRow.currentValue
        }
        if (changes.ACNAME) {
            this.ACNAME = changes.ACNAME.currentValue
        }
        if (changes.DATE1) {
            this.DATE1 = changes.DATE1.currentValue
        }
        if (changes.DATE2) {
            this.DATE2 = changes.DATE2.currentValue
        }
        if (changes.voucherName) {
            this.voucherName = changes.voucherName.currentValue
        }

    }


    @HostListener("document : keydown", ["$event"])
    updown($event: KeyboardEvent) {
        if ($event.code == "ArrowDown") {
            this.dataTable.nativeElement.scrollTop = this.dataTable.nativeElement.scrollTop + 26

            $event.preventDefault();
            this.selectedRowIndex++;
            if (this.selectedRowIndex == this.dataList.length) {
                this.selectedRowIndex = this.dataList.length - 1;
            }
        } else if ($event.code == "ArrowUp") {
            $event.preventDefault();
            if (this.dataTable.nativeElement.scrollTop > 0) {
                this.dataTable.nativeElement.scrollTop = this.dataTable.nativeElement.scrollTop - 26
            }
            this.selectedRowIndex--;
            if (this.selectedRowIndex == -1) {
                this.selectedRowIndex = 0;
            }
        } 
        else if (
            $event.ctrlKey && $event.code == "Enter" &&
            this.selectedRowIndex >= 0 &&
            this.selectedRowIndex < this.dataList.length
        ) {
            $event.preventDefault();
        }
         else if ($event.code == "Enter" && this.selectedRowIndex >= 0 && this.selectedRowIndex < this.dataList.length) {
            $event.preventDefault()
            if (this.reportType == 'Ledger Voucher') {
                let invoicePrefix = this.dataList[this.selectedRowIndex]['VCH TYPE']
                if (this.isDrillableVoucher(invoicePrefix)) {
                    {
                        this.loadInvoiceFromVoucherType(invoicePrefix, this.dataList[this.selectedRowIndex])
                    }
                }
            }
        }
    }

    doubleClicked(index) {
        this.selectedRowIndex = index
        if (this.reportType == 'Ledger Voucher') {
            let invoicePrefix = this.dataList[this.selectedRowIndex]['VCH TYPE']
            if (this.isDrillableVoucher(invoicePrefix)) {
                this.loadInvoiceFromVoucherType(invoicePrefix, this.dataList[this.selectedRowIndex])

            }
        }
    }
    isDrillableVoucher(invoicePrefix: any) {
        switch (invoicePrefix) {
            case 'SALES':
                return true
            case 'INCOME':
                return true
            case 'EXPENSE':
                return true
            case 'PURCHASE':
                return true
            case 'JOURNAL':
                return false
            case 'DEBITNOTE':
                return false
            case 'CREDITNOTE':
                return false
            case 'CONTRA':
                return false
            default:
                return false;
        }
    }




    loadInvoiceFromVoucherType(invoicePrefix: string, invoiceDataObj: any) {
        window.open(window.location.origin + this.resolveRouteUrl(invoicePrefix)
            + "?voucherNumber="+invoiceDataObj['VCH NO']+"&from=Ledger","_self");
    }




    resolveRouteUrl(prefix: string) {
        switch (prefix) {
            case 'SALES':
                return "/#/pages/transaction/sales/addsientry"
            case 'INCOME':
                return "/account/#/pages/account/acvouchers/income-voucher"
            case 'EXPENSE':
                return "/account/#/pages/account/acvouchers/expense-voucher"
            case 'PURCHASE':
                return "/#/pages/transaction/purchases/add-purchase-invoice"
            case 'JOURNAL':
                return "/account/#/pages/account/acvouchers/journal-voucher"
            case 'DEBITNOTE':
                return
            case 'CREDITNOTE':
                return
            case 'CONTRA':
                return "/account/#/pages/account/acvouchers/contra-voucher"


            default:
                break;
        }
    }


}

export class GenericReportListSettings {
    title: string;
    columns: ColumnSettings[] = [];
}

export class ColumnSettings {
    key: string;
    title: string;
}

export interface ReportData {
    particularsRow: any,
    totalRow: any
}
