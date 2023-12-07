import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'ReportFormat',
      //  styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="height: 155px; width:340px;">
    <legend class="scheduler-border" style="font-size: 12px;">Report Format</legend>

  
  <div class="input-demo radio-demo row">
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap">
        <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
        <span  style="margin-left:15px;">Non Line structure</span>
      </label>
    </div>
    <br />
    <div class="col-md-4"  style="margin-left:-117px">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
        <span  style="margin-left:15px;">Line Structure</span>
      </label>
    </div><br />
   </div>
   <div class="col-sm-3">
       <select class="form-control"  id="RepFormat" name="RepFormat" style="width:290px;">
            <option>Report Format<option>
        </select>
     
    </div> 
  </fieldset>`,
        providers: [],

    }
)
export class ReportFormatComponent{
    
  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









