import { Component, EventEmitter, Output } from '@angular/core';
import { GenericListSettings } from '../../../../common/Transaction Components/invoice-list.component';
import * as moment from 'moment'
import { MasterRepo } from '../../../../common/repositories';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { AlertService } from '../../../../common/services/alert/alert.service';

@Component({
  selector: 'voucher-posting',
  templateUrl: './voucher-posting.component.html'
})

export class VoucherPosting {
  listSetting: GenericListSettings = new GenericListSettings()
  public divisionList = [];
  public pageNumber: number
  public itemList = []
  constructor(private alertService: AlertService, private _masterService: MasterRepo, private _transactionService: TransactionService) {
    this._masterService.getAllDivisions().subscribe((res) => {
      this.divisionList.push(res)

    })
    this.itemList = [
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      },
      {
        VCHRNO: '10121211',
        ACNAME: 'IMS POS',
        TRNDATE: '2019-07-21',
        DRAMNT: '2000000',
        CRAMNT: '2000000',
        ChequeNo: "0023556526550",
        ChequeDate: '2019-07-20',
        CostCenter: "I Dont Know",
        NARATION: 'NARATION'
      }
    ]
    this.selectedDate = {
      startDate: moment(),
      endDate: moment()
    }
    this.listSetting = {
      title: "Voucher Posting",
      apiEndpoints: "",
      columns: [
        {
          key: "VCHRNO",
          title: "Voucher No"
        },
        {
          key: "ACNAME",
          title: "Account Description"
        },
        {
          key: "TRNDATE",
          title: "Date"
        },
        {
          key: "DRAMNT",
          title: "Dr Amount"
        },
        {
          key: "CRAMNT",
          title: "Cr Amnt"
        },
        {
          key: "ChequeNo",
          title: "Cheque Number"
        },
        {
          key: "ChequeDate",
          title: "Cheque Date"
        },
        {
          key: "CostCenter",
          title: "Cost Center"
        },
        {
          key: "NARATION",
          title: "Naration"
        }

      ]

    }
  }



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

  dateChanged(date) {
    this._transactionService.voucherPostingObj.from = moment(this.selectedDate.startDate).format('YYYY-MM-DD HH:mm:ss')
    this._transactionService.voucherPostingObj.to = moment(this.selectedDate.endDate).format('YYYY-MM-DD HH:mm:ss')
  }

  divisionChange(division) {
  }
  voucherChange(voucher) {
    console.group(voucher)
  }

  pageValueChanged(pageNumber) {

    this.pageNumber = pageNumber

  }


  loadVoucher() {
  }

  postInvoice() {
    let voucherList = []
    let isChecked = this._transactionService.voucherPostingObj.invoiceList.find(x => x.checked == true)

    if (isChecked == undefined || isChecked == null || isChecked == "") {
      this.alertService.error("No Invoice Selected")
      return;
    }

    this._transactionService.voucherPostingObj.invoiceList.find(x => {
      if (x.checked == true) {
        voucherList.push(x.VCHRNO)
      }
    })
  }
}
