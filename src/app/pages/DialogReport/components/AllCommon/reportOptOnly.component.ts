import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'ReportOption',
      //  styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="height: 120px; width:190px;">
    <legend class="scheduler-border" style="font-size: 12px;">Report Option</legend>

  
  <div class="input-demo radio-demo row">
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap">
        <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="  ">
        <span>Deptors Party Only</span>
      </label>
    </div>
    <br />
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
        <span style="margin-left:-67px;">Creaditor Only</span>
      </label>
    </div><br />
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3">
        <span style="margin-left:-133px;">All Party</span>
      </label>
    </div><br />
    </div>
  </fieldset>`,
        providers: [],

    }
)
export class ReportOptComponent{
    
  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









