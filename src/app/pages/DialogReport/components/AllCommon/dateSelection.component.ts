import { Component, Input, Output, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component(
    {

        selector: 'DateSelection',
        // styleUrls:['../../fieldset.component.css'],
        template: `   
   <fieldset class="scheduler-border" style="width:500px">
    <legend class="scheduler-border" style="font-size: 12px;width:100px">Date Selection</legend>

    <div class="form-group row" style="margin: 10px;">
     <label>Date1:</label>   
     <input style="height:26px" type="date"  id="englishDate" name="date4" [(ngModel)]="ledgerdialog.DATE1" (change)="changeAccountReportDate($event.target.value,'AD')" />
     <input id="nepaliDate" class="nepali-calendar ndp-nepali-calendar" name="date1"  [(ngModel)]="ledgerdialog.BSDATE1" onclick="showNdpCalendarBox('nepaliDate')" type="text" (change)="changeAccountReportDate($event.target.value,'BS')" (click)="clickDate($event.target.value)"   placeholder="yyyy-mm-dd"  />                   
     <label>(BS)</label>
  </div>                                                  
 <div class="form-group row" style="margin: 10px;">
    <label >Date2:</label> 
       <input type="date" style="height:26px"  name="date1" id="englishDate" name="date3" [(ngModel)]="ledgerdialog.DATE2"  (change)="changeReportDate($event.target.value,'AD')" />
    
       <input  id="nepaliDate1" name="date6" class="nepali-calendar ndp-nepali-calendar" onclick="showNdpCalendarBox('nepaliDate1')" type="text" [(ngModel)]="ledgerdialog.BSDATE2" (change)="changeReportDate($event.target.value,'BS')" placeholder="yyyy-mm-dd" (click)="clickDate2($event.target.value)" />
 
       <label>(BS)</label>

  </div>
        </fieldset> 
       `,
        providers: [],
        styleUrls: ['../dialogReport.css']

    }
)
export class DateSelectionComponentRep {
    ledgerdialog: any = <any>{};
    @Input() form: FormGroup;

    ngOnInit() {

    }
    constructor() { }

    changeAccountReportDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.ledgerdialog.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.ledgerdialog.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
            this.form.controls['DATE1'].setValue(this.ledgerdialog.DATE1);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    changeReportDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.ledgerdialog.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.ledgerdialog.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
            this.form.controls['DATE2'].setValue(this.ledgerdialog.DATE2);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    clickDate(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.ledgerdialog.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
                this.form.controls['DATE1'].setValue(this.ledgerdialog.DATE1);
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    clickDate2(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.ledgerdialog.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
                this.form.controls['DATE2'].setValue(this.ledgerdialog.DATE2);
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

}









