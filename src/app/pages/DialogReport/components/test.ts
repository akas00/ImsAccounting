import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { CommonService } from "../../../../common/services/common.service";
import {AddCostCenterService} from './addCostCenter.service';
import{IDivision} from "../../../common/interfaces/commonInterface.interface";
import { ActivatedRoute,Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../common/repositories/masterRepo.service";
import {TAcList} from "../../../common/interfaces/Account.interface";
import {LedgerDialog} from '../../../common/interfaces/LedgerDialog.interface';
import {ReportService,IReportMenu,IReport} from './reports/report.service';
@Component(
    {
        
        selector: 'testt',
        templateUrl: `
         <LedgerName [form]="form"></LedgerName>
    
     <Division [form]="form"></Division> 
     `,
        providers: [MasterRepo],

    }
)
export class testCm{
   dParam:any=<any>{};
      @Input() reportname;
   @Input() Gridsettings;
     @Input() form:FormGroup;

    
  ngOnInit() {
        
 }
   constructor(private reportService:ReportService) {}
   RunClick(){
       
   }
  
 
   }









