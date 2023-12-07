import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";

@Component(
    {
        
        selector: 'EnabledFormatedPrintOut',
        
        template: `
    <div class="checkbox">
  <label><input type="checkbox" value="">Enabled Formated PrintOut</label>
</div>
  `,
        providers: [],

    }
)
export class checkboxEnabledComponentRep{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









