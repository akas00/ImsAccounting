import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import{IDivision} from "../../../../common/interfaces/commonInterface.interface";
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";
@Component(
    {
        
        selector: 'CostCenter',
        template: ` 
           <fieldset class="scheduler-border" style="height: 290px; width:340px; margin-top:6px;">
    <legend class="scheduler-border" style="font-size: 12px;">
    <div class="checkbox checkbox-primary">
<input type="checkbox" [(ngModel)]="OpeningChecked" > CostCenter
</div></legend>
<div class='form-group'>

<div class="checkbox  checkbox-primary">  
 <input type="checkbox" [disabled]="OpeningChecked == false" > XYZ
    </div>
    <div class="checkbox checkbox-primary">  
 <input type="checkbox" [disabled]="OpeningChecked == false" > ABC
    </div>
    <div class="checkbox checkbox-primary">  
 <input type="checkbox" [disabled]="OpeningChecked == false" > CDE
    </div>
    <div class="checkbox checkbox-primary">  
 <input type="checkbox" [disabled]="OpeningChecked == false" > QWE
    </div>
    </div>
 </fieldset>
       
 `,
        providers: [MasterRepo],

    }
)
export class CostCenterComponentRep{
    OpeningChecked:boolean=false;
   ngOnInit() {

    }
   constructor() {}
   
   }









