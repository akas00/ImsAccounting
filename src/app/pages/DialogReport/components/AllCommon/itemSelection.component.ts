import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'itemSelection',
        // styleUrls:['../../fieldset.component.css'],
        template: `<fieldset class="scheduler-border" style="margin-left: -1px; margin-top:15px; height: 200px; width:410px;">
    <legend class="scheduler-border" style="font-size: 12px;">Item Selection</legend>
     
                    <div class="form-group row">
    <label  class="col-sm-4 form-control-label" >Bar Code:</label>
   <div class="col-sm-6">
         <input style="width: 200px;" type="text" class="form-control">
    </div> 
  </div>
  <div class="form-group row">
    <label  class="col-sm-4 form-control-label" >Item Code:</label>
   <div class="col-sm-4">
       <select class="form-control"  id="Itemname" name="Itemname">
            <option>asd<option>
        </select>
     
    </div> 
  </div>
  <div class="form-group row">
    <label  class="col-sm-4 form-control-label" >Item Name:</label>
   <div class="col-sm-6">
       <select class="form-control"  id="Itemname" name="Itemname">
            <option>asd<option>
        </select>
     
    </div> 
  </div>
           

                    
                   </fieldset>`,
        providers: [],

    }
)
export class ItemSelectionComponentRep{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









