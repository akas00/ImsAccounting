import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'

@Component(
    {
        
        selector: 'RunBttn',
       // styleUrls:['../../fieldset.component.css'],
        template: ` <div class="col-md-8">
    <div style="margin-top: 15px;">
     <button  title="Save" class="btn btn-info" data-dismiss="modal">Run</button>
    <button type="button" title="Cancel" class="btn btn-info" data-dismiss="modal">close</button></div>
    </div>`,
        providers: [],

    }
)
export class RunBttnComponentRep{
      

  ngOnInit() {
       
 }
   constructor() {}
  
  
   
   }









