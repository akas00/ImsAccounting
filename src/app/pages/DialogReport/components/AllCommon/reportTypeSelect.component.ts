import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'ReportTypeSelect',
       // styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="height: 135px; width:340px;">
    <legend class="scheduler-border" style="font-size: 12px;">Report Type Select</legend>

  
  <div class="input-demo radio-demo row">
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap">
        <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="  ">
        <span>Item Wise Stock Report</span>
      </label>
    </div>
    <br />
    <div class="col-md-4"  style="margin-left:-117px">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
        <span>Item Group Wise Stock Report</span>
      </label>
    </div><br />
    <div class="col-md-4"  style="margin-left:-116px">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3">
        <span>Item Category Wise Stock Report</span>
      </label>
    </div><br />
    </div>
  </fieldset>`,
        providers: [],

    }
)
export class ReportTypeSelectComponent{
    
  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









