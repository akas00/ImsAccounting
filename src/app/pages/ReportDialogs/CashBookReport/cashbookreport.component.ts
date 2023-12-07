import { Component, Output, Inject, EventEmitter } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { Division } from '../../../common/interfaces';



export interface DialogInfo{
    header: string;
    message: Observable<string>;

}

@Component({
    selector : 'result-cashbookreport-dialog',
    templateUrl : './cashbookreport.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class CashBookReport{
 ReportParameters:any=<any>{};
 division: any[]=[];   
 cashAccount: any[]=[];
 
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,public dialogref:MdDialogRef<CashBookReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
        
        //--------Default value on load
        this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
        this.changestartDate(this.ReportParameters.DATE1,'AD');
        this.ReportParameters.DATE2 = new Date().toJSON().split('T')[0];
        this.changeEndDate(this.ReportParameters.DATE2,'AD');
        
        this.ReportParameters.MergeVatAc = "0";
        this.ReportParameters.DIVISION = "%";
        this.ReportParameters.CASH_ACID = "%";
        //--------------------
        
        this.division=[];
        this.masterService.getAllDivisions()
          .subscribe(res => {
            //////console.log("div" + JSON.stringify(res));
            this.division.push(<Division>res);                
          }, error => {
            this.masterService.resolveError(error, "divisions - getDivisions");
        });
        
        this.cashAccount = [];
        this.masterService.getCashList()
        .subscribe(res => {
            //////console.log("cash" + JSON.stringify(res));
            this.cashAccount =res;
        })
              
    }

    onload()
    {
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("error");
    }

   public DialogClosedResult(res) {

    this.ReportParameters.DIVISION = (this.ReportParameters.DIVISION == null || this.ReportParameters.DIVISION == "")?"%":this.ReportParameters.DIVISION;
    this.ReportParameters.CASH_ACID = (this.ReportParameters.CASH_ACID == null || this.ReportParameters.CASH_ACID =="")?"%":this.ReportParameters.CASH_ACID; 

    //alert(this.ReportParameters.DIVISION + "~~~" + this.ReportParameters.CASH_ACID);
    this.reportdataEmit.emit({ status: res, data: {reportname:'Cash Book Report', reportparam:this.ReportParameters}});
      
    }

    changestartDate(value, format: string) {
        try{
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.ReportParameters.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
                
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);  
                this.ReportParameters.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));          
            }
        }catch(e){}
      
    }
    changeEndDate(value, format: string) {
        try{
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);         
                this.ReportParameters.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);         
                this.ReportParameters.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    
            }
        }
          catch(e){}
      
    }                                                                                                     


    dateString: any = '';
    date1: any = '';
    daysPrior: any = '';
    dateId: any = '';
    finalDate: any= '';
    changeDateByRange(value:any){

        if (value == "1"){
            //alert("week selected!!"); yy-mm-dd
            
            this.dateId = 7;
            this.dateString = ""+ this.getCurrentDate() +"";
            this.date1 = new Date(this.dateString);
            this.daysPrior = parseInt(this.dateId);
            this.date1.setDate(this.date1.getDate() - this.daysPrior);
            this.finalDate =  (this.date1.toISOString().slice(0, 11).replace('T', ' '));

            //alert(this.finalDate);
            this.ReportParameters.DATE1 = (this.finalDate).trim();
            this.changestartDate(this.ReportParameters.DATE1,'AD');
 
        }
         else if (value == "2"){
        //     //alert("month selected!!");
            this.dateId = 30;
            this.dateString = ""+ this.getCurrentDate() +"";
            this.date1 = new Date(this.dateString);
            this.daysPrior = parseInt(this.dateId);
            this.date1.setDate(this.date1.getDate() - this.daysPrior);
            this.finalDate =  (this.date1.toISOString().slice(0, 11).replace('T', ' '));

            //alert(this.finalDate);
            this.ReportParameters.DATE1 = (this.finalDate).trim();
            this.changestartDate(this.ReportParameters.DATE1,'AD');
         }
        else{
        // alert("year selected");
        this.dateId = 365;
        this.dateString = ""+ this.getCurrentDate() +"";
        this.date1 = new Date(this.dateString);
        this.daysPrior = parseInt(this.dateId);
        this.date1.setDate(this.date1.getDate() - this.daysPrior);
        this.finalDate =  (this.date1.toISOString().slice(0, 11).replace('T', ' '));

        //alert(this.finalDate);
        this.ReportParameters.DATE1 = (this.finalDate).trim();
        this.changestartDate(this.ReportParameters.DATE1,'AD');
         }
    }


    dd: any;
    mm: any;
    yyyy: any;
    today: any;
    getCurrentDate(){
        this.today = new Date();
        this.dd = this.today.getDate();
        this.mm = this.today.getMonth() + 1; //January is 0!
    
        this.yyyy = this.today.getFullYear();
        if (this.dd < 10) {
            this.dd = '0' + this.dd;
        }
        if (this.mm < 10) {
            this.mm = '0' + this.mm;
        }
        this.today = this.mm + '/' + this.dd + '/' + this.yyyy;
               
        return this.today;
    }


}