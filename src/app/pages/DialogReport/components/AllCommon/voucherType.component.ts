import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";
@Component(
    {
        
        selector: 'VoucherTypeRep',
        template: `<fieldset class="scheduler-border" style="height: 170px; width:440px;">
    <legend class="scheduler-border" style="font-size: 12px;">Voucher Select</legend>

        <div class="col-md-12" >
    <div class="form-group row" style="margin-top: 15px;">
          <label  class="col-sm-6 form-control-label" style="width:150px;" >Voucher Type:</label>
   <div class="col-sm-5">
       <select style="width:250px;" class="form-control"  id="code" name="ACID">
            <option>Type<option>
        </select>
     
    </div> 
       </div></div>
     
      <div class="col-md-12" >
    <div class="form-group row">
          <label  class="col-sm-6 form-control-label" style="width:150px;">Voucher Series:</label>
   <div class="col-sm-5">
      <select style="width:250px;" class="form-control"  id="ledger" name="acname">
            <option>series<option>
        </select>
     </div> 
       </div></div></fieldset>
      `,
        providers: [MasterRepo],

    }
)
export class VoucherTypeComponentRep{
   

  ngOnInit() {
        
 }
   constructor(protected MasterService:MasterRepo) {}
  
 
   }









