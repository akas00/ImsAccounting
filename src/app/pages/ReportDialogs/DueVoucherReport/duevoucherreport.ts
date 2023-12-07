import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { Subscriber } from 'rxjs';

export interface DialogInfo{
    header: string;
    message: Observable<string>;

}
@Component({
    selector : 'result-duevoucherreport-dialog',
    templateUrl : './duevoucherreport.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class DueVoucherReport{
    ReportParameters:any=<any>{};
    cusSupList: any[]=[];
    
   
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,public dialogref:MdDialogRef<DueVoucherReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
       //-------Default value on page load
        this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
        this.changestartDate(this.ReportParameters.DATE1,'AD');  

        this.ReportParameters.ROPTION = "1";
        // this.masterService.getCusSup().subscribe(res => {
        //     //console.log(res);
        //     //console.log(JSON.stringify(res));
        // });
    }
    
    onload()
    {
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this.ReportParameters.PARTY =  (this.ACID == null || this.ACID == "")?"%":this.ACID;

        //alert("party--"+this.ReportParameters.PARTY + "ptype--" + this.PTYPE);

        if (this.PTYPE == "V"){this.ReportParameters.FLG = "1";}
        else{this.ReportParameters.FLG = "2";}
        this.reportdataEmit.emit({ status: res, data: {reportname:'Due Voucher Report', reportparam:this.ReportParameters}});

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

    //Autocomplete begins
    dropListItem = (keyword: any): Observable<Array<any>> => {

        return new Observable((observer: Subscriber<Array<any>>) => {
            this.masterService.getCusSup().map(data=>{
                return data.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
            }
            ).subscribe(res =>{observer.next(res);})
        }).share();
    }

    ACCNAME : string = '';
    ACCODE : string = '';
    ACID: string = '';
    PTYPE: string = '';

    accodeChanged(value :string){
        var item = this.masterService.accountList.find(x => x.ACCODE == value);
        //console.log({valueType: value,found : item ,items : this.masterService.accountList});
        this.ACCNAME = '';
        if (item){
            value = item.ACNAME;
            //console.log(value + "****");
            this.ACCNAME = value;
        }

    }

    itemChanged(value : any){
        //console.log({itemChangedValue: value});
        if (typeof(value) === "object"){
            this.ACCNAME = value.ACNAME;
            this.ACCODE = value.ACCODE;
            this.ACID = value.ACID;
            this.PTYPE = value.PType;
        }
    }

    //end autocomplete


}

