import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { TAcList } from '../../../common/interfaces/Account.interface';
import { Subscriber } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';



export interface DialogInfo{
    header: string;
    message: Observable<string>;

}

@Component({
    selector : 'result-partyledger-dialog',
    templateUrl : './partyLedger.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class PartyLedger{
    ReportParameters:any=<any>{};
    division: any[]=[];
    accountDetails: any[] = [];
    showAll:Boolean;
   
    @Output() reportdataEmit = new EventEmitter();
       constructor( private masterService: MasterRepo,public dialogref:MdDialogRef<PartyLedger>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
                //------Default values on load
                this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
                this.changestartDate(this.ReportParameters.DATE1,'AD');
                this.ReportParameters.DATE2 = new Date().toJSON().split('T')[0];
                this.changeEndDate(this.ReportParameters.DATE2,'AD'); 

                this.ReportParameters.CostCenter = " ";
                this.ReportParameters.showNdate = "0";
                this.ReportParameters.InSingleLedger = "0";
                this.ReportParameters.IsAccountLedger = "0";
                this.ReportParameters.REPORTBYCOSTCENTER = "0";
                this.ReportParameters.HASMULTILEDGER = "0";
                this.ReportParameters.SHOWPRODUCTDETAIL = "0";
                this.ReportParameters.CheckSummaryReport = "1";
                this.ReportParameters.SELECTEDACIDLIST = " ";
                this.ReportParameters.DIVISION = "%";
                this.ReportParameters.OPT_SHOWSUMMARY_REPORT = "1";
                
                //-----------------------

               this.division=[];
               //let data: Array<IDivision> = [];
               if(this.masterService.userSetting.userwisedivision == 1){
                 this.masterService.getDivisionFromRightPrivelege().subscribe(res=>{
                     if(res.status == 'ok'){
                         this.division = res.result;
                     }
                 })
               }
               else{
                this.masterService.getAllDivisions()
                .subscribe(res => {
                  //////console.log("div" + JSON.stringify(res));
                  this.division.push(<Division>res);                
                }, error => {
                  this.masterService.resolveError(error, "divisions - getDivisions");
                });
               }
            
                             
                /* let dataa: Array<TAcList> = [];
                 this.accountDetails = [];
                 this.masterService.getAcList()
                   .subscribe(res => {
                       
                      this.accountDetails.push(res);                   
                 
                       res = JSON.stringify(res);
                       ////console.log("acaayo"+res);                
                   });*/
                   this.masterService.getAccDivList();
       }

       onload()
       {   
            this.DialogClosedResult("ok");
       }

       closeReportBox(){
           this.dialogref.close();
       }
     
       public DialogClosedResult(res) {
        ////console.log("CheckValuee%",this.ReportParameters)
        this.ReportParameters.DIVISION = (this.ReportParameters.DIVISION == null || this.ReportParameters.DIVISION == "")?"%":this.ReportParameters.DIVISION;

        if (res == "ok"){

            if (this.ACID == "" || this.ACID == null ){
                alert("Please choose Account!!!");            
            }
            else{
                this.ReportParameters.PLEDGER_ACID = this.ACID;
                // ////console.log("Party££££££%%",this.ReportParameters)
                this.reportdataEmit.emit({ status: res, data: {reportname:'Party Ledger', reportparam:this.ReportParameters}});
            }      
        }
        else{
            this.reportdataEmit.emit({ status: res, data: {reportname:'Party Ledger', reportparam:this.ReportParameters}});
        }   
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

    //Autocomplete Functions

    results: Observable<TAcList[]>;
    subscriptions: Subscription[] = [];
    listFilterHolder: any[] = [];

    dropListItem = (keyword: any): Observable<Array<any>> => {
     return new Observable((observer: Subscriber<Array<any>>) => {
            this.masterService.getAccount("from partyreport").map(res=>{ 
                return res.filter(x=>x.ACID.substring(0,2).toUpperCase()=='PA');}).map(data=>{
                return data.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
            }
            ).subscribe(res =>{observer.next(res);})
        }).share();
    }       
    
    ACCNAME : string = '';
    ACCODE : string = '';
    ACID: string = '';

    accodeChanged(value :string){
        var item = this.masterService.accountList.find(x => x.ACCODE == value);
        //console.log({valueType: value,found : item ,items : this.masterService.accountList});
        this.ACCNAME = '';
        if (item){
            value = item.ACNAME;
           
            this.ACCNAME = value;
        }

    }

    itemChanged(value : any){
        //console.log({itemChangedValue: value});
        if (typeof(value) === "object"){
            this.ACCNAME = value.ACNAME;
            this.ACCODE = value.ACCODE;
            this.ACID = value.ACID;
        }
    }

    //autocomplete ends

   
}