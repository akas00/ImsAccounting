import {
  Component,
  OnChanges,
  EventEmitter,
  Output,
  Input,
  OnInit
} from "@angular/core";
import * as moment from 'moment';


@Component({
  selector: "ims-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["../../pages/Style.css"]

})
export class IMSDatePickerComponent implements OnInit, OnChanges {

  @Output() onDateChange = new EventEmitter();
  @Input() index: string = "";
  @Input() date: string = "";
  @Input() ID: string = "";
  selectedDate: { startDate: moment.Moment };
  alwaysShowCalendars: boolean = true;
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
  constructor() {
    this.selectedDate = {
      startDate: moment(),
    }
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.date) {
      this.selectedDate.startDate = changes.date.currentValue
    }
  }
  IsNumeric(event) {
    var isShift = false
    if (event.keyCode == 16) {
      isShift = true;
    }
    //Allow only Numeric Keys.
    if (((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 8 || event.keyCode <= 37 || event.keyCode <= 39 || (event.keyCode >= 96 && event.keyCode <= 105)) && isShift == false) {
      if ((event.target.value.length == 2 || event.target.value.length == 5) && event.keyCode != 8) {
        event.target.value += '/';

      }

      return true;
    }
    else {
      return false;
    }
  };

  onDateEnterTab(event) {
    try {
      this.onDateChange.emit(event.target.value)
    } catch (e) {
    }
  }

  onvalueChange(event) {
    try {
      if (event.startDate == null) return;
      var date = new Date(event.startDate);
      if (date.toDateString() == "Invalid Date") {
        return;
      }
      var year = date.getFullYear();
      if (year != 1970) {
        if (moment.isMoment(event.startDate)) {
          var datestr = moment(date).format("DD/MM/YYYY");
          this.onDateChange.emit(datestr);
        }
      }

    } catch (e) { }
  }

  show() {
    var element = document.getElementById("date" + this.ID + this.index) as HTMLElement;
    setTimeout(() => {
      element.click();
      element.focus();
    }, 0);
  }
}
