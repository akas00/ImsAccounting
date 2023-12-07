import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MasterRepo } from '../../repositories';
import { TrnProd, VoucherTypeEnum } from '../../interfaces';
import { TransactionService } from '../../Transaction Components/transaction.service';

@Component(
    {
        selector: 'PCategoryList',
        templateUrl: './PopCategory.html',
        styleUrls: ["../../../pages/Style.css", "../pStyle.css"],

    }
)
export class PopCategoryComponent {
    
    /** Input/Output/Viewchild  */
    @Input() title: string;
    @Input() tabindex;
    @Output() dbClickEvent = new EventEmitter();
    @Output() CategoryClosedClick = new EventEmitter();
    @ViewChild("SearchBox") _Search: ElementRef;
    
    /** Object Declaration  */
    selectPopupRowList: Function;
    selectedRow: Number;
    selectedRowIndex: Number;
    isFocus: boolean = true;

    /** List Declaration  */
    p: number[] = [];
    setClickedRow: Function;
    CatList: any[] = [];

    unitList: any[] = [];

    @Input() activerowIndex: number;

    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService) {

        this.setClickedRow = function (index) {
            this.selectedRow = index;
        }

    }
    

    pagingChange(value) {
        this.p[this.tabindex] = value;
    }
    
    dblClickCatObj(value) {
        this.dbClickEvent.emit(value)

    }

    getCatList() {
        this.masterService.getAllCat()
            .subscribe(res => {
                this.CatList = [];
                this.CatList = res;

            }, error => {
                this.masterService.resolveError(error, "Popup- getCategoryList");
            });
    }
    itemCategoryClosed() {
        this.CategoryClosedClick.emit();
    }
    
}