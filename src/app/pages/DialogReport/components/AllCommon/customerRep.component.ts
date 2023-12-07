import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";

@Component(
    {
        
        selector: 'CustomerReport',
        
        template: `
            <div class="form-group row" style="margin-top: 25px;">
    <label  class="col-sm-2 form-control-label" >Customer Account:</label>
   <div class="col-sm-4">
       <select class="form-control"  id="Division" name="division">
            <option>Customer Report<option>
        </select>
     
    </div> 
  </div>
       
`}
)
export class CustomerComponentRep{
      

   constructor() {}
  
  
   
   }









