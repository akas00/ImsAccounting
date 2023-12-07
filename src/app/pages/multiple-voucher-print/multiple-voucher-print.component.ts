import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../common/popupLists/generic-grid/generic-popup-grid.component';
import { PrintInvoiceComponent } from '../../common/Invoice/print-invoice/print-invoice.component';
import { MasterRepo } from '../../common/repositories';
import { SpinnerService } from '../../common/services/spinner/spinner.service';
import { AlertService } from '../../common/services/alert/alert.service';
declare var jQuery;
import * as moment from 'moment'
import { stringify } from 'querystring';
import { AuthService } from '../../common/services/permission/authService.service';
@Component(
    {
        selector: 'multiple-print',
        templateUrl: './multiple-voucher-print.component.html',
    }
)
export class MultiPrintComponent {


    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    public voucherType: string = "";
    public selectedVoucherList = []
    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    alwaysShowCalendars: boolean = true;
    from: string;
    to: string;
    PhiscalObj: any = <any>{};
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
    constructor(public invoicePrint: PrintInvoiceComponent, public masterService: MasterRepo, public loadingService: SpinnerService, public alertService: AlertService,
        private authService: AuthService) {
        this.selectedDate = {
            startDate: moment(),
            endDate: moment()
        }
        this.PhiscalObj = authService.getPhiscalInfo();
    }

    ngOnInit() {

    }



    dateChanged(date) {
        this.genericGrid.hide()
        this.from = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
        this.to = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
        if (this.voucherType == null || this.voucherType == "" || this.voucherType == undefined) {
            this.alertService.warning("Please Select Voucher Type to proceed");
            return;
        } else {
            let filterObj = {
                from: this.from,
                to: this.to,
                voucherType: this.voucherType
            }
            this.loadingService.show("Please wait! Getting list of invoices.")
            this.masterService.invoiceListByDate(filterObj).subscribe((res) => {
                if (res.status == "ok") {
                    this.selectedVoucherList = res.result;
                    this.loadingService.hide();
                } else {
                    this.loadingService.hide();
                    this.alertService.error(res.result)
                }
            }, error => {
                this.loadingService.hide();
                this.alertService.error(error);
            })
        }
    }

    showList() {
        if (this.voucherType == null || this.voucherType == "" || this.voucherType == undefined) {
            this.alertService.error("Please select voucher type to proceed");
            return;
        } else {
            this.genericGrid.show("", false, "");
        }
    }


    public activeurlpath: string = "";
    voucherChanged(event) {
        let modifiedVoucherType: string = event.target.value;
        if (event.target.value == "DNI") {
            this.activeurlpath = "add-debitnote-itembase";
            modifiedVoucherType = "DN";
        } else if (event.target.value == "CNI") {
            this.activeurlpath = "add-creditnote-itembase";
            modifiedVoucherType = "CN";
        } else {
            this.activeurlpath = ""
        }
        this.selectedVoucherList = []
        if (this.voucherType == "" || this.voucherType == null || this.voucherType == undefined) {
            return;
        }
        else {
            var PID = this.PhiscalObj.PhiscalID;
            PID = PID.replace("/", "ZZ");
            this.gridPopupSettings = {
                title: this.renderTitle(this.voucherType),
                apiEndpoints: `/getTrnMainPagedList/${modifiedVoucherType}/${PID}`,
                defaultFilterIndex: 0,
                columns: [
                    {
                        key: 'VCHRNO',
                        title: 'Invoice Number.',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'TRNDATE',
                        title: 'DATE',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'NETAMNT',
                        title: 'AMOUNT',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'PARAC',
                        title: 'CUSTOMER',
                        hidden: false,
                        noSearch: false
                    }
                ]
            }

            this.genericGrid.show("", false, "");
        }
    }


    onItemDoubleClick(event) {
        let x: any
        x = this.selectedVoucherList.filter(itm => itm.VCHRNO == event.VCHRNO)
        if (x.length > 0) {
            return;
        }
        this.selectedVoucherList.push(event)
    }
    public renderTitle(prefix: string) {
        switch (prefix) {
            case "TI":
                return "Tax Invoice";
            case "PI":
                return "Purchase Invoice";
            case "JV":
                return "Journal Voucher";
            case "CE":
                return "Contra";
            case "PV":
                return "Expense Voucher";
            case "RV":
                return "Receive Voucher";
            case "DN":
                return "Debit Note";
            case "CN":
                return "Credit Note";
            case "CNI":
                return "Sales Return";
            case "DNI":
                return "Purchase Return";
            case "PO":
                return "Purchase Order";
            case "SO":
                return "Sales order"
            default:
                return "";
        }
    }

    removeFromSelectedList(index) {
        this.selectedVoucherList.splice(index, 1);
    }


    print() {
        let htmlString: string = ""
        let index: number = 0;
        this.loadingService.show("Please Wait! Preparing Multiple Voucher for print")
        for (let i in this.selectedVoucherList) {
            try {
                this.masterService.getInvoiceData(this.selectedVoucherList[i].VCHRNO, this.selectedVoucherList[i].DIVISION, this.selectedVoucherList[i].PhiscalID, this.selectedVoucherList[i].PARAC).subscribe((res) => {
                    htmlString = htmlString + this.invoicePrint.getMultiplePrintFormat(res.result, res.result2, this.voucherType, this.activeurlpath)

                    index++;
                }, err => {
                    this.loadingService.hide();
                    this.alertService.error(err);


                }, () => {
                    if (index == this.selectedVoucherList.length) {
                        this.loadingService.hide();
                        let popupWin;
                        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                        popupWin.document.write(`
                    <html> <head>
                    <style>
                        @media print
                        {
                        table { page-break-after:always }
                        tr    { page-break-inside:always; page-break-after:always 
                        td    { page-break-inside:avoid; page-break-after:always }
                        thead { display:table-header-group }
                        tfoot { display:table-footer-group }
                        }
                        </style>
                    </head>
                    <body onload="window.print();window.close()">
                    ${htmlString}
                    </body>
                    </html>`
                        );
                        popupWin.document.close();
                    }
                })
            } catch (ex) {
                this.alertService.error(ex)
            }
        }






    }
}