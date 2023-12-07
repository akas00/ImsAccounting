import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { ActivatedRoute,Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import {MasterRepo} from "../../../common/repositories/masterRepo.service";


@Component(
    {
        
        selector: 'stockPosition',
        templateUrl: './stockPosition.component.html',
        providers: [MasterRepo],

    }
)
export class stockPositionComponentRep{
  
   
  ngOnInit() {
      
 }
   constructor() {}
  
 
   }









