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
        selector: 'InvoicePrint',
        templateUrl: './invoice.component.html',
        styles: [`
            .modal{
                padding-top:0px;
            }
            .InvoiceHeader{
                text-align:center;
                font-weight:bold
            }
            p
            {
                height:5px;
            }
            table{
                margin:5px
            }
            .summaryTable{
                float: right;
                border: none;
            }

            .summaryTable  td{
                text-align:right;
                border:none;
            }

            .itemtable{
                border: 1px solid black;
                border-collapse: collapse;
            }
            .itemtable th{                
                height:30px;
                font-weight:bold;
            }
            .itemtable th, td {               
                border: 1px solid black;
                padding:2px;

            }

           

        `]
    }
)
export class InvoiceComponent {
    @Input() InvoiceType: string = 'Tax Invoice';
    @Input() CompanyName: string = 'IMS Himalayan Sangrila Pvt. Ltd.';
    @Input() CompanyAddress: string = 'Tripureswore, Kathmandu';
    @Input() CompanyPan: string = '675845231';
    @Input() TrnMainObj: TrnMain = <TrnMain>{};
    @Output() sendPrefix = new EventEmitter();

    ngOnInit() {
        //  @ViewChild('orderModal') orderModal: ModalDirective;
        try {
             
        } catch (ex) {
            //alert(ex);
        }
    }

    constructor() {

    }
}