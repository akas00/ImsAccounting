import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { ReportService, IreportOption } from '../reports/report.service';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component(
    {

        selector: 'ReportOptions',
        template: `
        <div *ngFor="let p of roption">
        <fieldset class="scheduler-border">
    <legend class="scheduler-border" style="font-size: 12px;width:initial">{{p.description}}</legend>
    <div *ngIf="p.type=='radio'" class="row">
    <div  *ngFor="let r of p.options" style="margin-left:20px">
                    <input  type="radio" name="rd" (change)="radiochangeEvent($event.target.checked,r.name,p.description)"  [checked]="r.value==1" >{{r.name}}            
     </div>
     </div>
     <div *ngIf="p.type=='checkbox'" class="row">
    <div  *ngFor="let r of p.options" style="margin-left:20px">
                    <input  type="checkbox"  (change)="checkboxchangeEvent($event.target.checked,r.name,p.description)"  [checked]="r.value==1" >{{r.name}}            
     </div>
     </div>
                   </fieldset>
                   <div>
       `,
        providers: [],

    }
)
export class ROptionsComponent {
    @Input() roption: Array<IreportOption>;

    radiochangeEvent(value, name, des) {
        try {
            if (value == true) {
                this.roption.filter(x => x.description == des)[0].value = { name: name, value: 1 };
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    checkboxchangeEvent(value, name, des) {
        try {
            if (value == true) { this.roption.filter(x => x.description == des)[0].value = { name: name, value: 1 }; }
            else { this.roption.filter(x => x.description == des)[0].value = { name: name, value: 0 }; }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    constructor() { }

    ngOnInit() {

    }

}









