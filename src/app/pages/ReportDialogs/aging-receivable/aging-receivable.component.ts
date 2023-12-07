import { Component, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { AlertService } from '../../../common/services/alert/alert.service';


@Component({
  selector: 'aging-receivable-report',
  templateUrl: './aging-receivable.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
  providers: [TransactionService]

})
export class AgingReceivableReport {
  @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  public ACNAME: string = "";
  agingreceivable = {
    reportname: "",
    reportparam: {
      from: "",
      acid: "%",
      summaryreport: 1,
      phiscalid: this.masterService.PhiscalObj.PhiscalID,
      companyid: this.masterService.userProfile.CompanyInfo.COMPANYID,
      div: this.masterService.userProfile.userDivision,
    }
  };
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
  alwaysShowCalendars: boolean = true;
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;
  constructor(public masterService: MasterRepo, public _trnMainService: TransactionService, public alertService: AlertService) {
    var voucherprefix="voucherprefix";
    this.gridPopupSettingsForCustomer = {
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
        }
      ]
    };
  }
  onload() {
    // if (!this.agingreceivable.reportparam.summaryreport && (this.ACNAME == "" || this.ACNAME == null || this.ACNAME == undefined)) {
    //   this.alertService.error("Please Choose Customer for Detail Report");
    //   return;
    // }
    this.agingreceivable.reportparam.summaryreport = this.agingreceivable.reportparam.summaryreport ? 1 : 0
    this.agingreceivable.reportname = 'AGING RECEIVABLE';
    this.agingreceivable.reportparam.acid = this.acidList.length ? this.acidList.join(",") : '%';

    this.reportdataEmit.emit({ status: "ok", data: this.agingreceivable });
  }

  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.agingreceivable });
  }

  public selectedVoucherList = []
  public acidList = []
  onCustomerSelected(customer) {
    let x: any
    x = this.selectedVoucherList.filter(itm => itm.ACID == customer.ACID)
    if (x.length > 0) {
      return;
    }
    this.selectedVoucherList.push(customer)
    this.acidList.push(customer.ACID)
  }


  removeFromSelectedList(index) {
    this.selectedVoucherList.splice(index, 1)
    this.acidList.splice(index, 1)
  }

  dateChanged() {
    this.agingreceivable.reportparam.from = moment(this.selectedDate.startDate).format('MM-DD-YYYY')

  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }


  customerEnterCommand() {
    this.genericGridCustomer.show();
  }
}