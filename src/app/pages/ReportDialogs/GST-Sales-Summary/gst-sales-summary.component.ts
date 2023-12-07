import { Component, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { Observable, Subscriber } from "rxjs";
import * as moment from 'moment'
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../common/Transaction Components/transaction.service';


@Component({
  selector: 'gst-sales-summary',
  templateUrl: './gst-sales-summary.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
providers:[TransactionService]

})
export class GstSalesSummary {
 
  
  public isActive: boolean = false;
  ACCNAME : string;
  accountpayableObj={
    reportname:"",
    reportparam:{
      DATE1:"",
      DATE2:""
    }

    
  };
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
  showopeningBl: string
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType:string;
  constructor(public masterService: MasterRepo,  public _trnMainService: TransactionService) {
   
  }
  alwaysShowCalendars: boolean = true;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Financial Year': [moment().set('date', 1).set('month', 3), moment().endOf('month').set('month', 2).add(1, 'year')],

  }
  locale = {
    format: 'DD/MM/YYYY',
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' - ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom Range',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: 0 // first day is monday
  }
  
  onload() {
    this. accountpayableObj.reportname='GST SALES SUMMARY';
    
    this.reportdataEmit.emit({status:"ok",data:this. accountpayableObj});

  }

  closeReportBox(){
    this.reportdataEmit.emit({status:"Error!",data:this. accountpayableObj});
}
  
 
  dateChanged(date) {
    this. accountpayableObj.reportparam.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this. accountpayableObj.reportparam.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
   
  }

 
  preventInput($event){
    $event.preventDefault();
    return false;
}
}