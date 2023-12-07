import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../../common/repositories/masterRepo.service";

@Component(
    {
        
        selector: 'DueAgeing',
     //   styleUrls:['../../fieldset.component.css'],
        template: `
        <style>
        .TextElement
        {
            margin-left:-3px;
            width:40px;
        }
        </style>
        <fieldset class="scheduler-border" style="margin-left: -1px; height: 80px; width:410px; margin-top:15px;">
    <legend class="scheduler-border" style="font-size: 12px;"><input type="checkbox" value="">Show Due Ageing</legend>

     <div class="form-group row"  style="margin-left:25px; width:350px;">
  <input class="TextElement" type="text" value="15">
  <input class="TextElement" type="text" value="16">
  <input class="TextElement" type="text" value="17">
  <input class="TextElement" type="text" value="18">
  <input class="TextElement" type="text" value="19">
  <input class="TextElement" type="text" value="20">
     </div>
    
  </fieldset>`,
        providers: [],

    }
)
export class DueAgeingComponentRep{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









