import { TrnMain } from './../interfaces/TrnMain';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Inputs } from "./../../pages/forms/components/inputs/inputs.component";
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { VoucherTypeEnum } from '../../common/interfaces/TrnMain';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MasterRepo } from "../repositories/index";
import { TransactionService } from "../Transaction Components/transaction.service";

@Component(
    {
        selector: 'InvoiceNewPrint',
        templateUrl: './invoicePrint.component.html',
        styles: ["./invoice.css"]
    }
)
export class InvoicePrintComponent {
    private _data = new BehaviorSubject<TrnMain[]>([]);
    @Input() InvoiceType: string = 'INVOICE';
    @Input() CompanyName: string = 'IMS Himalayan Sangrila Pvt. Ltd.';
    @Input() CompanyAddress: string = 'Tripureswore, Kathmandu';
    @Input() CompanyPan: string = '675845231';
    @Input() VAT: string = '123';
    @Input() printCopyCaption:string="";
    // @Input() TELA:string='a';
    @Input() TrnMainObj: TrnMain = <TrnMain>{};
    @Output() sendPrefix = new EventEmitter();
    @Input() TrnMainSubject:BehaviorSubject<any>;
    printData:any;

    test:any;
    // (value) {
    //     // set the latest value for _data BehaviorSubject
    //     this._data.next(value);
    // };

    // get TrnMainSubject() {
    //     // get the latest value from _data BehaviorSubject
    //     return this._data.getValue();
    // }
      constructor(public masterService:MasterRepo,public _transactionService:TransactionService) {
    }

    ngOnInit() {
      
        try {
              this._transactionService.PrintStuff$.subscribe(data => {
                this.printData = data;
              })

        } catch (ex) {
            //alert(ex);
        }
      
        // this._data
        //     .subscribe(x => {
        //         this.groupPosts = this.groupByCategory(this.data);
        //     });
    }
 }