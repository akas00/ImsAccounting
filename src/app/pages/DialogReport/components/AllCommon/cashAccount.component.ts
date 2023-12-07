import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";

@Component(
    {
        
        selector: 'CashAccount',
       // styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="margin-left: 15px; height: 130px; width:420px;">
    <legend class="scheduler-border" style="font-size: 12px;">Cash Account Selection</legend>
     <div class="form-group row"  style="margin-left:25px; width:350px;">
  <select class="form-control"  id="CARep" name="CARep">
            <option>cashAccount<option>
        </select>
     </div>
    <div class="checkbox"  style="margin-left:25px;">
  <label><input type="checkbox" value="">Show Consolidated Cash Book</label>
</div>
  </fieldset>`,
        providers: [],

    }
)
export class CashACComponentRep{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









