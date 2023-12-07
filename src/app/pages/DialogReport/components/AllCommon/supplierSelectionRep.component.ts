import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import{Warehouse} from "../../../../common/interfaces/TrnMain";
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";
@Component(
    {
        
        selector: 'SupplierSelection',
        template: `
                  <div class="form-group row">
    <label  class="col-sm-2 form-control-label" >Supplier Selection:</label>
   <div class="col-sm-6">
       <select class="form-control"  id="warehouse" name="warehouse" style="width:320px;">
            <option>Supplier Selection<option>
        </select>
     
    </div> </div>
    
 `,
        providers: [MasterRepo],

    }
)
export class SupplierSelCompoentRep{
      

  ngOnInit() {
           
 }
   constructor() {}
  
  
   
   }









