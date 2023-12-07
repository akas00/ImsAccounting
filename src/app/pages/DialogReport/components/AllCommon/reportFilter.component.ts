import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'ReportFilter',
      //  styleUrls:['../../fieldset.component.css'],
        template: `
        <style>
        .labelWidth{width:120px;}
        .reportWidth{
            width:250px;
        }
        </style>
         <fieldset class="scheduler-border" style="height: 250px; margin-left:-1px;margin-top:15px;">
                       
    <legend class="scheduler-border" style="font-size: 12px;">Report Filter Option</legend>
    
       
     <div class="form-group row">
    <label  class="col-sm-3 form-control-label labelWidth" >Item Group:</label>
   <div class="col-sm-5">
       <select class="form-control reportWidth"  id="ItemGroup" name="ItemGroup">
            <option>as<option>
        </select>
     
    </div> 
  </div>
  <div class="form-group row">
    <label  class="col-sm-3 form-control-label labelWidth" >Item Category:</label>
   <div class="col-sm-5">
       <select class="form-control reportWidth"  id="Itemcategory" name="Itemcategory">
            <option>s<option>
        </select>
     
    </div> 
  </div>
  <div class="form-group row">
    <label  class="col-sm-3 form-control-label labelWidth" >Item Type:</label>
   <div class="col-sm-5">
       <select class="form-control reportWidth"  id="Itemname" name="Itemname">
            <option>asd<option>
        </select>
     
    </div> 
  </div>
 <div class="form-group row">
    <label  class="col-sm-3 form-control-label labelWidth" >Supplier Name:</label>
   <div class="col-sm-5">
       <select class="form-control reportWidth"  id="Itemname" name="Itemname">
            <option>asd<option>
        </select>
     
    </div> 
  </div>
                   </fieldset>`,
        providers: [],

    }
)
export class ReportFilterComponentRep{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









