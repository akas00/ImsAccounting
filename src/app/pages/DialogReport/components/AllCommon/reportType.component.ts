import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'ReportType',
        // styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="height: 105px; width:180px; margin-top:25px;">
    <legend class="scheduler-border" style="font-size: 12px;">Report Type</legend>

  
  <div class="input-demo radio-demo row">
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap">
        <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="  ">
        <span>Summary Type</span>
      </label>
    </div>
    <br />
    <div class="col-md-4"  style="margin-left:-117px">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
        <span style="margin-left:54px;">Ledger Type</span>
      </label>
    </div>
    
   
    </div>
  </fieldset>`,
        providers: [],

    }
)
export class ReportTypeComponent{
    
  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









