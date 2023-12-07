import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { TransactionService } from '../../../common/Transaction Components/transaction.service';

@Component({
    selector: 'gstr-card',
    templateUrl: './gstr-card.component.html',
})

export class GstrCardComponent implements OnChanges {

    @Input() cardList: any


    constructor(public _transactionService:TransactionService){

    }
    ngOnChanges(changes): void {
        this.cardList = changes.cardList.currentValue
    }
    

    parseNumber(number){
        if(typeof(number)=="string"){

            return parseFloat(number.replace(/,/g, ''))
        }else{
            return parseFloat(number)

        }
    }

  
}