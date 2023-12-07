import { Component, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';


@Component({
  selector: 'account-receivable-report',
  templateUrl: './account-receivable.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class AccountReceivableReport {
  @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
  gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
  ACNAME: string;
  accountreceivable = {
    reportname: "",
    reportparam: {
      DATE1: "",
      DATE2: "",
      ACID: "%",
      DIV: "",
      COMPANYID: "",
      PHISCALID: "",
      SHOWZEROBL: 1
    }


  };
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
  showopeningBl: string
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;
  constructor(public masterService: MasterRepo) {
    var voucherprefix="voucherprefix";
    this.gridPopupSettingsForSupplier = {
      title: "Customers",
      apiEndpoints: `/getAccountPagedListByPType/PA/C/${voucherprefix}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACCODE",
          title: "CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ADDRESS",
          title: "ADDRESS",
          hidden: false,
          noSearch: false
        },
        {
          key: "EMAIL",
          title: "EMAIL",
          hidden: false,
          noSearch: false
        }
      ]
    };
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
    this.accountreceivable.reportname = 'AccountReceivable Report';
    this.accountreceivable.reportparam.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
    this.accountreceivable.reportparam.DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
    this.accountreceivable.reportparam.PHISCALID = this.masterService.PhiscalObj.PhiscalID;
    this.accountreceivable.reportparam.SHOWZEROBL = this.accountreceivable.reportparam.SHOWZEROBL ? 1 : 0;
    this.reportdataEmit.emit({ status: "ok", data: this.accountreceivable });

  }

  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.accountreceivable });
  }

  onCustomerSelected(customer) {

    this.accountreceivable.reportparam.ACID = customer.ACID;
    this.ACNAME = customer.ACNAME;
  }

  dateChanged() {
    this.accountreceivable.reportparam.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.accountreceivable.reportparam.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')

  }

  customerEnterCommand() {
    this.genericGridCustomer.show();

  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }
}