import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'MemberRep',
        
        template: `
            <div class="form-group row" style="margin-top: 25px;">
    <label  class="col-sm-2 form-control-label" >Member:</label>
   <div class="col-sm-4">
       <select class="form-control"  id="memberRep" name="memberRep">
            <option>member<option>
        </select>
     
    </div> 
  </div>
       
`,
        providers: [],

    }
)
export class MemberComponentRep{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









