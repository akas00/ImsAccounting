import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MasterRepo } from '../../repositories';
import { TrnProd, VoucherTypeEnum } from '../../interfaces';
import { TransactionService } from '../../Transaction Components/transaction.service';
import { AnonymousSubscription } from 'rxjs/Subscription';

@Component(
    {
        selector: 'PopQtyRange',
        templateUrl: './PopQtyRange.html',
        styleUrls: ["../../../../pages/Style.css", "../../../../common/popupLists/pStyle.css"],

    }
)
export class PopQtyRangeComponent {
    /** Input/Output/Viewchild  */
    @Input() RangeObj: any;
    @Output() RangeQtyClosedClick = new EventEmitter();
    @Output() LoadRangeQty = new EventEmitter();
    /** Object Declaration  */

    isFocus: boolean = true;
  
    /** List Declaration  */
    p: number[] = [];
    setClickedRow: Function;

    RangeList: any[] = [];



    @Input() activerowIndex: number;

    constructor() {
        this.addRow();

        this.setClickedRow = function (index) {
            this.selectedRow = index;
        }

    }

    setFocus() {
        // this._BE.nativeElement.focus();
    }
    SearchList(value) {
        // this.itemChanged(value);

    }
    rangeQtyrowIndex: number = 0;
    TableRowclick(i) {
        this.rangeQtyrowIndex = i
    }
    addRow() {
        var newRow = <any>{};
        newRow.RangeQty = null;
        newRow.DisRate = null;
        newRow.Batches=null;
        newRow.Mcode=null;
        newRow.DiscountRateType=null;
        newRow.RangeType=null;
        this.RangeList.push(newRow);
    }
    accountTab(){
        this.addRow();

        // if(this.RangeObj.Batches!=null)
        // this.RangeList[this.rangeQtyrowIndex].Batches = this.RangeObj.Batches;
        if(this.RangeObj.Mcode!=null)
        this.RangeList[this.rangeQtyrowIndex].Mcode = this.RangeObj.Mcode;
        // this.RangeList[this.rangeQtyrowIndex].DiscountRateType = this.ItemObj.DiscountRateType;
        if(this.RangeObj.RangeType!=null)
        this.RangeList[this.rangeQtyrowIndex].RangeType = this.RangeObj.RangeType;
        
    var nextindex = this.activerowIndex + 1;
     setTimeout(() => {
      if (document.getElementById('quantity' + nextindex) != null) {
        document.getElementById('quantity' + nextindex).focus();
      }
    }, 500);
    }
    LoadAllRangeQty(){
        this.LoadRangeQty.emit(this.RangeList);
    }
    Closed() {
        this.RangeQtyClosedClick.emit();
    }
}