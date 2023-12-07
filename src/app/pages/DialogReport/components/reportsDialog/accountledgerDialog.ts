import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";
import {TAcList} from "../../../../common/interfaces/Account.interface";
import {LedgerDialog} from '../../../../common/interfaces/LedgerDialog.interface';
import {ReportService,IReportMenu,IReport,IreportOption} from '../reports/report.service';
@Component(
    {      
        selector: 'acledger',
        template: `
	<div class="row" class="form-horizontal">	
        <ba-card [title]="modeTitle" baCardClass="with-scroll"> 
        <div class="col-md-9">
     <LedgerName  [form]="form"></LedgerName>
     <DateSelection  [form]="form"></DateSelection>  
    
     <Division [form]="form"></Division>  
     </div>
      <div class="col-md-3">
       <ReportOptions [roption]="roption"></ReportOptions>
      </div>
	</ba-card>	
    </div>
   
  

  
`,

    }
)
export class ACLedgerComponentRep{
    @Input() reportname;
    @Input() form:FormGroup;
    @Input() roption:Array<IreportOption>;
  ngOnInit() {
        
 }
   constructor(private reportService:ReportService,private fb: FormBuilder) {}
  
 
   }









