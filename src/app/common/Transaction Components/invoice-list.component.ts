import { Component, OnInit, Output, EventEmitter, Input, Injector, OnChanges, HostListener, ViewChild, ElementRef } from "@angular/core";
import { TransactionService } from "./transaction.service";
import { PagedListingComponentBase } from "../../paged-list-component-base";
import { FormControl } from "@angular/forms";
@Component({
    selector: "invoice-list",
    templateUrl: "./invoice-list.component.html",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class InvoiceListComponent extends PagedListingComponentBase implements OnInit, OnChanges {

    public itemList: any[] = [];
    public tabindex: string = "list"
    @Input() source: any
    @Output() pageChange: EventEmitter<any> = new EventEmitter<any>()
    @Input() listSetting: GenericListSettings;

    constructor(public injector: Injector, public _transactionService: TransactionService) {
        super(injector);
        

    }
    ngOnInit() {
        
    }

    ngOnChanges(changes: any): void {
        this.listSetting = changes.listSetting.currentValue;
        this._transactionService.voucherPostingObj.invoiceList = changes.source.currentValue
        this.buildCheckBox()
    }

    onPageChange(value) {
        this.pageNumber = value ? value : 1;
        this.pageChange.emit(this.pageNumber)
    }

    getData() {
    }


    @HostListener("document : keydown", ["$event"])
    @debounce(10)
    updown($event: KeyboardEvent) {
        if ($event.code == "ArrowRight") {
            $event.preventDefault();
            this.calculateTotalPages();
            if (this.pageNumber >= this.totalPages) {
                this.pageNumber = this.totalPages;
                return;
            }
            this.pageNumber = this.pageNumber + 1;
            this.onPageChange(this.pageNumber)
        } else if ($event.code == "ArrowLeft") {
            $event.preventDefault();
            if (this.pageNumber <= 1) {
                this.pageNumber = 1;
                return;
            }
            this.pageNumber = this.pageNumber - 1;
            this.onPageChange(this.pageNumber)

        }
    }

    public selectAll = false
    checkedAll(event) {
        if (event.target.checked) {
            for (let i in this._transactionService.voucherPostingObj.invoiceList) {
                this._transactionService.voucherPostingObj.invoiceList[i].checked = true
            }
        } else {
            for (let i in this._transactionService.voucherPostingObj.invoiceList) {
                this._transactionService.voucherPostingObj.invoiceList[i].checked = false
            }
        }
    }

    buildCheckBox() {
        for (let i = 0; i < this._transactionService.voucherPostingObj.invoiceList.length; i++) {
            this._transactionService.voucherPostingObj.invoiceList[i].checked = false
        }

    }



    itemChecked(event, index) {
        this.selectAll=true;
        this._transactionService.voucherPostingObj.invoiceList.forEach(x => {
            if (!x.checked) {
                this.selectAll = false
            }
        });

    }

}

export function debounce(delay: number): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const original = descriptor.value;
        const key = `__timeout__${propertyKey}`;

        descriptor.value = function (...args) {
            clearTimeout(this[key]);
            this[key] = setTimeout(() => original.apply(this, args), delay);
        };

        return descriptor;
    };
}


export class GenericListSettings {
    title: string;
    apiEndpoints: string;
    columns: ColumnSettings[] = [];
}


export class ColumnSettings {
    key: string;
    title: string;
}