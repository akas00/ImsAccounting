import { Component, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { Observable, Subscriber } from "rxjs";
import * as moment from 'moment'
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { AlertService } from '../../../common/services/alert/alert.service';


@Component({
  selector: 'aging-payable-report',
  templateUrl: './aging-payable.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
  providers: [TransactionService]

})
export class AgingPayableReport {
  @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  public ACNAME
  agingpayable = {
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
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;
  constructor(public masterService: MasterRepo, public _trnMainService: TransactionService, public alertService: AlertService) {
    var voucherprefix="voucherprefix";
    this.gridPopupSettingsForCustomer = {
      title: "Suppliers",
      apiEndpoints: `/getAccountPagedListByPType/PA/V/${voucherprefix}`,
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
  alwaysShowCalendars: boolean = true;
  onload() {
    // if (!this.agingpayable.reportparam.summaryreport && (this.ACNAME == "" || this.ACNAME == null || this.ACNAME == undefined)) {
    //   this.alertService.error("Please Choose Supplier for Detail Report");
    //   return;
    // }
    this.agingpayable.reportparam.summaryreport = this.agingpayable.reportparam.summaryreport ? 1 : 0
    this.agingpayable.reportname = 'AGING PAYABLE';
    this.agingpayable.reportparam.acid = this.acidList.length ? this.acidList.join(",") : '%';
    this.reportdataEmit.emit({ status: "ok", data: this.agingpayable });

  }

  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.agingpayable });
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

  dateChanged(date) {
    this.agingpayable.reportparam.from = moment(this.selectedDate.startDate).format('MM-DD-YYYY')

  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }


  customerEnterCommand(e) {
    this.genericGridSupplier.show();
  }
}