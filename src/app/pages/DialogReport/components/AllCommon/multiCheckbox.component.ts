import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'MultiCheckbox',
        //styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="height: 155px; width:340px;">
    <legend class="scheduler-border" style="font-size: 12px;">Report Option Selection</legend>

  
  <div class="input-demo radio-demo row">
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap">
        <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="  ">
        <span>Show Item Wise Stock Excluding Zero BL</span>
      </label>
    </div>
    <br />
    <div class="col-md-4"  style="margin-left:-117px">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
        <span>Show Negative Stock BL Item Only</span>
      </label>
    </div><br />
    <div class="col-md-4"  style="margin-left:-116px">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3">
        <span>Show Zero Stock BL Item Only</span>
      </label>
    </div><br />
    <div class="col-md-4"  style="margin-left:-117px">
      <label class="radio-inline custom-radio nowrap"  >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio4" value="option4">
        <span>Show All Product Stock Postion</span>
      </label>
    </div>
    </div>
  </fieldset>`,
        providers: [],

    }
)
export class MultiCheckboxComponentRep{
    
  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









