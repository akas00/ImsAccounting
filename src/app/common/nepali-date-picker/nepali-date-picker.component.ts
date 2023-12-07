import { Component, OnInit, forwardRef, Inject, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormControl } from "@angular/forms";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MasterRepo } from '../repositories/masterRepo.service';
// import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';


declare var jQuery

@Component({
    selector: 'nepali-date-picker',
    templateUrl: 'nepali-date-picker.component.html',
    styleUrls: ['nepali-date-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NepaliDatePickerComponent),
            multi: true
        },
        ],

})
export class NepaliDatePickerComponent implements OnInit, ControlValueAccessor {

    private onChange: (value: string[]) => void = () => { };
    private onTouch: any = () => { };
    public disableBefore = ''
    public date:string;
    @Input() id: string = "";
    @Input() label: string = "";
    @Input() disable:boolean = false;
    @Input() max:boolean = true;
    // @Output() tab =  new EventEmitter();
    public dateControl = new FormControl();
    dateBS: string;
    DBS: string;
    activeurlpath:string

    constructor(private elementRef: ElementRef,
      public masterRepo: MasterRepo,public router : Router) {
        this.activeurlpath = this.router.url;
    }

    ngOnInit() {
      this.isNullOrEmpty(this.id);

      // //console.log("ID", this.id);
      var today = new Date();
      this.date = moment(today).format('YYYY-MM-DD');
    //   //console.log("today", today);
     //   //console.log("date", this.date);
      this.changeDate(this.date,'AD');
    //   //console.log("Change Date", this.changeDate);
    //   //console.log("english and nepali date", this.date,this.dateBS);
      this.DBS = "30/12/2077"

  }


    ngAfterViewInit() {
        var _this = this;

        jQuery(document).ready(function () {
            jQuery(document).on('click', `#${_this.id}`, function () {
                document.getElementById(`${_this.id}Picker`).focus()
            })
        })

        jQuery(document).ready(function () {
            jQuery(document).on('focus', `#${_this.id}Picker`, function () {
                jQuery(`#${_this.id}Picker`).nepaliDatePicker({
                    language: "english",
                    onChange: function () {
                        _this.dateControl.setValue(jQuery(`#${_this.id}Picker`).val());
                        _this.propagateChange(_this.dateControl.value);
                document.getElementById(`${_this.id}Picker`).focus()

                 },
                    dateFormat: "DD/MM/YYYY",
                    readOnlyInput: false,
                   disableAfter: _this.dateBS,
                    ndpYear: true,
                    ndpMonth: true,
                    ndpYearCount: 5


                })
            })

        })
    }

    changeDate(value, format:string){
        var adbs = require("ad-bs-converter");
        if(format == "AD"){
          var adDate = (value.replace("-","/")).replace("-","/");
          var bsDate = adbs.ad2bs(adDate);
          if(this.max == true && this.activeurlpath!="/pages/financialreports/registerBookReports/postdated-chequevoucher-report"){
          this.dateBS= (bsDate.en.day == '1'|| bsDate.en.day =='2' || bsDate.en.day =='3' || bsDate.en.day =='4' || bsDate.en.day =='5' || bsDate.en.day =='6' || bsDate.en.day =='7' || bsDate.en.day =='8' || bsDate.en.day =='9'? '0' + bsDate.en.day:bsDate.en.day)+'/'+bsDate.en.month + '/' + bsDate.en.year;

          }else{
              this.dateBS = null;
        }
        
      }else if( format == "BS"){
        var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
          var adDate = adbs.bs2ad(bsDate);
          this.date = (adDate.year + '-'+((adDate.month).toString().length == 1?'0'+adDate.month :adDate.month)+'-'+((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        
        }
    }

  //   tabClicked(event){
  //       //console.log("TAB TAB");
  //       this.tab.emit(true);
  //   }


    writeValue = (obj: any): void => {
        this.dateControl.setValue(obj);
    }



    registerOnChange = (_fn: any): void => {

        this.onChange = _fn;
    }

    registerOnTouched = (_fn: any): void => {
        this.onTouch = _fn;
    }








    private propagateChange = (value: any) => {
        this.onChange(value);
        this.onTouch(value);
        this.elementRef.nativeElement.dispatchEvent(new CustomEvent('change',
            { detail: { 'value': value }, bubbles: true }));


    }



    isNullOrEmpty(val) {
        if (typeof val !== "string") {
            throw Error("Invalid Type for Id");
        }

        if (val == "" || val == null || val == undefined) {
            throw Error("Invalid Id");
        }
    }

}
