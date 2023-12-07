import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'StockValuation',
      //  styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="height: 220px; width:340px;">
    <legend class="scheduler-border" style="font-size: 12px;">Stock Valuation</legend>

  
  <div class="input-demo radio-demo row">
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap">
        <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="  ">
        <span>Auto</span>
      </label>
    </div>
    <div class="col-md-4">
      <label class="radio-inline custom-radio nowrap" >
        <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
        <span>Manual</span>
      </label>
    </div>
    </div>
    <div class="form-group row">
    <label for="inputEmail3" class="col-sm-2 form-control-label">Opeining</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" style="width:250px;" id="inputEmail3" placeholder="Opening">
    </div>
  </div>

    <div class="form-group row">
    <label for="inputEmail3" class="col-sm-2 form-control-label">Closing</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" style="width:250px;" id="inputEmail3" placeholder="Closing">
    </div>
  </div>
   <div class="col-md-4" >
      <div class="checkbox">
        <ba-checkbox [(ngModel)]="isRemember" [label]="'Do Valuation'" [ngModelOptions]="{standalone: true}"></ba-checkbox>
      </div>
    </div>
    <div class="col-md-4" >
        <button style="margin-left:90px;" title="Cancel" class="btn btn-info">Calculate</button>
</div>
  </fieldset>`,
        providers: [],

    }
)
export class StockValuationComponentRep{
    
  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









