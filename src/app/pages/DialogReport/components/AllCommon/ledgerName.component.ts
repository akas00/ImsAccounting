import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";
import {TAcList} from "../../../../common/interfaces/Account.interface";
@Component(
    {
        
        selector: 'LedgerName',
        template: `<div class="col-md-12" >
    <div class="form-group row" style="margin-top: 15px;">
          <label  class="col-sm-2 form-control-label" >Ledger Code:</label>
   <div class="col-sm-3">
       <select class="form-control"  id="code" name="ACID" [(ngModel)]="account.ACNAME">
            <option *ngFor="let a of accountList" [ngValue]="a.ACNAME">{{a.ACID}}<option>
        </select>
     
    </div> 
       </div></div>
     
      <div class="col-md-12" >
    <div class="form-group row">
          <label  class="col-sm-2 form-control-label" >Ledger a/c:</label>
   <div class="col-sm-5">
      <select class="form-control"  id="ledger" name="acname" [(ngModel)]="account.ACNAME">
            <option *ngFor="let a of accountList" [ngValue]="a.ACNAME">{{a.ACNAME}}<option>
        </select>
     </div> 
       </div></div>
      `,
        providers: [MasterRepo],

    }
)
export class LedgerNameComponentRep{
    account:TAcList=<TAcList>{};
    accountList:TAcList[]=[];   


  ngOnInit() {
  // this.MasterService.getAccount().subscribe(res=>{this.accountList.push(...res);});        
 }
   constructor(protected MasterService:MasterRepo) {}
  
 
   }









