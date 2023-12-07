import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";

@Component(
    {
        
        selector: 'SubLedgerAlso',
        
        template: `
    <div class="checkbox">
  <label><input type="checkbox" value="">show SubLedger Also</label>
</div>
  `,
        providers: [],

    }
)
export class SubLedgerAlsoComponentRep{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









