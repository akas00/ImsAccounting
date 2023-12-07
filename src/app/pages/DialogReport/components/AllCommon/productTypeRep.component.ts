import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";

@Component(
    {
        
        selector: 'ProductType',
       // styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="margin-left: 15px; height: 95px; width:420px;">
    <legend class="scheduler-border" style="font-size: 12px;">ProductType</legend>
     <div class="form-group row"  style="margin-left:25px; width:350px;">
  <select class="form-control"  id="CARep" name="CARep">
            <option>Party Account<option>
        </select>
     </div>
    </fieldset>`,
        providers: [],

    }
)
export class ProductTypeComponent{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









