import { TransactionService } from "./transaction.service";
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from './../repositories/masterRepo.service';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { SettingService } from './../services';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TrnMain, VoucherTypeEnum } from "../interfaces";



@Component({
    selector: "trnmainmasterparam",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"],
    templateUrl: "./TrnmainMasterParameters.html",
})

export class TrnMainMasterParametersComponent implements OnDestroy {
    TrnMainForm: FormGroup;
    TrnMainObj:TrnMain;
    VoucherType:VoucherTypeEnum;
    constructor(public masterService: MasterRepo, public _trnMainService: TransactionService, private _fb: FormBuilder, private router: Router, private arouter: ActivatedRoute, private setting: SettingService) {
       this.TrnMainObj=_trnMainService.TrnMainObj;
       
    }
    ngAfterViewInit(){
       
    }
      
        
    
    ngOnInit() {      
        this.TrnMainForm = this._fb.group({
            VCHRNO: [''],
            CHALANNO: [''],
            TRNDATE: [''],
            BSDATE: [''],
            TRN_DATE: [''],
            BS_DATE: [''],
            DIVISION: [''],
            TRNMODE: [''],
            REFBILL: [''],
            RETTO: [''],
            TRNAC: [''],
            PARAC: [''],
            COSTCENTER: [''],
            MWAREHOUSE: [''],
            CHEQUENO: [''],
            CHEQUEDATE: [''],
            FCurrency:[''],
            EXRATE:[''],
            REMARKS: [''],
            CREDITDAYS:[''],
            ROUNDOFF:[''],
            BILLTO: [''],
            BILLTOMOB: [''],
            BILLTOADD: [''],
            BILLTOTEL: [''],
            BALANCE:['']
        });

        this.TrnMainForm.valueChanges.subscribe(form => {
            this.TrnMainObj.VCHRNO=form.VCHRNO;
            this.TrnMainObj.CHALANNO=form.CHALANNO;
            this.TrnMainObj.TRNDATE=form.TRNDATE;
            this.TrnMainObj.BSDATE=form.BSDATE;
            this.TrnMainObj.TRN_DATE=form.TRN_DATE;
            this.TrnMainObj.BS_DATE=form.BS_DATE;
            this.TrnMainObj.DIVISION=form.DIVISION;
            this.TrnMainObj.TRNMODE = form.TRNMODE;
            this.TrnMainObj.REFBILL=form.REFBILL;
            this.TrnMainObj.RETTO = form.RETTO;
            this.TrnMainObj.TRNAC = form.TRNAC;
            this.TrnMainObj.PARAC = form.PARAC;
            this.TrnMainObj.COSTCENTER = form.COSTCENTER;
            this.TrnMainObj.MWAREHOUSE=form.MWAREHOUSE;
            this.TrnMainObj.CHEQUENO = form.CHEQUENO;
            this.TrnMainObj.CHEQUEDATE = form.CHEQUEDATE;
            this.TrnMainObj.FCurrency=form.FCurrency;
            this.TrnMainObj.EXRATE=form.EXRATE;
            this.TrnMainObj.REMARKS = form.REMARKS;         
            this.TrnMainObj.CREDITDAYS=form.CREDITDAYS;
            this.TrnMainObj.ROUNDOFF=form.ROUNDOFF;
          this.TrnMainObj.BILLTO=form.BILLTO;
          this.TrnMainObj.BILLTOADD=form.BILLTOADD;
          this.TrnMainObj.BILLTOMOB=form.BILLTOMOB;
          this.TrnMainObj.BILLTOTEL=form.BILLTOTEL;
           this.TrnMainObj.BALANCE=form.BALANCE;
        });
    }


    undo() {
         }
    ngOnDestroy() {
        try {

        }
        catch (ex) {
        }
    }
  

}
