import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { TransactionService } from "./transaction.service";
import * as moment from 'moment'

@Component({
    selector: "delivery-order",
    templateUrl: "./delivery-order.component.html",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class DeliveryOrderComponent {
    @Input() title: string = ""
    @Output() advanceSearchEmiter: EventEmitter<any> = new EventEmitter<any>();
    @Output() dateRangeChange:EventEmitter<any>= new EventEmitter<any>();
    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
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
    
    constructor(public _transactionService: TransactionService) {
        this.selectedDate = {
            startDate: moment(),
            endDate: moment()
        }
    }

    advanceSearch() {
        this.advanceSearchEmiter.emit(true)
    }

    dateChanged(date) {
        this._transactionService.FilterObj.from = moment(this.selectedDate.startDate).format('YYYY-MM-DD HH:mm:ss')
        this._transactionService.FilterObj.to = moment(this.selectedDate.endDate).format('YYYY-MM-DD HH:mm:ss')
        this.dateRangeChange.emit(this.selectedDate)
    }


}
