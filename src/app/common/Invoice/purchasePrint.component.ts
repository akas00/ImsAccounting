import { TransactionService } from './../Transaction Components/transaction.service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { TrnMain } from "../../common/interfaces/TrnMain";
import { VoucherTypeEnum } from '../../common/interfaces/TrnMain';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MasterRepo } from "../repositories/index";
@Component(
    {
        selector: 'salesPrint',
        templateUrl: './purchasePrint.component.html',
        styles: ["./invoice.css"]
    }
)
export class PurchasePrintComponent {
    @Input() InvoiceType: string = 'ABBREVIATED Tax Invoice';
    @Input() CompanyName: string = 'DemoCompany Pvt. Ltd.';
    @Input() CompanyAddress: string = 'Tripureswore, Kathmandu';
    @Input() CompanyPan: string = '675845231';
    @Input() printCopyCaption:string="";
    @Input() TrnMainObj: TrnMain = <TrnMain>{};
    @Output() sendPrefix = new EventEmitter();
    @Input() TrnMainSubject: BehaviorSubject<any>;
    printData: any;

    constructor(public masterService: MasterRepo,public _transactionService:TransactionService) {
    }
    ngOnInit() {
            try {
            this._transactionService.PrintStuff$.subscribe(data => {
                this.printData = data;

            })

        } catch (ex) {
           // alert(ex);
        }

        // this._data
        //     .subscribe(x => {
        //         this.groupPosts = this.groupByCategory(this.data);
        //     });
    }

    
}