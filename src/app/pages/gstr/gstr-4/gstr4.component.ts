import { Component, OnInit } from '@angular/core';
import { GstrService } from '../gstr.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericListSettings } from '../gstr-card/gst-summary-list.component';
import { CacheService } from '../../../common/services/permission';
import * as moment from 'moment'

@Component({
    selector: 'gstr4',
    templateUrl: './gstr4.component.html',
})

export class Gstr4Component implements OnInit {

    public listSetting: GenericListSettings
    public summaryData: any
    public totalRowData: any
    constructor(private _cacheService: CacheService, private alertService: AlertService, private _gstrService: GstrService, private _activateRoute: ActivatedRoute, private spinnerService: SpinnerService) {
        if (this._cacheService.get('startDate') == undefined || this._cacheService.get('startDate') == null || this._cacheService.get('startDate') == "" || this._cacheService.get('endDate') == undefined || this._cacheService.get('endDate') == null || this._cacheService.get('endDate') == "") {
            this._gstrService.gstMain.startDate = moment().startOf('month').format('MM-DD-YYYY')
            this._gstrService.gstMain.endDate = moment().endOf('month').set('month', 2).add(1, 'year').format('MM-DD-YYYY')
        }

    }


    ngOnInit(): void {
        if (this._activateRoute.snapshot.url.length == 1) {
            this._gstrService.gstMain.isGstSubReport = false;
            this._gstrService.gstMain.activeGstType = ((this._activateRoute.snapshot.url[0].path)).toUpperCase()
           if(this._gstrService.gstMain.gstrSubReport){
            this.spinnerService.show("Please Wait while data is loaded");
            this._gstrService.getGstSubTypeById(this._gstrService.gstMain.activeGstType).subscribe((res) => {
                this._gstrService.gstMain.gstrSubReport = res.result;
                this._gstrService.gstMain.isGstReport = true
                this.spinnerService.hide();
            }, error => {
                this.alertService.error(error)
                this.spinnerService.hide()
            })
           }
        }



        if (this._activateRoute.snapshot.url.length == 2) {
            this._gstrService.gstMain.isGstReport = false
            this._gstrService.gstMain.activeGstType = ((this._activateRoute.snapshot.url[0].path)).toUpperCase()
            this._gstrService.gstMain.activeSubGstType = ((this._activateRoute.snapshot.url[1].path)).toUpperCase()
            this.spinnerService.show("Please Wait while data is loaded");
            this._gstrService.getGstSubTypeDetailById((this._activateRoute.snapshot.url[0].path).toUpperCase(), (this._activateRoute.snapshot.url[1].path).toUpperCase()).subscribe((res) => {
                if (res.status == "ok" && res.result != null) {
                    this._gstrService.gstMain.totalRowData = res.result
                } else {
                    this._gstrService.gstMain.totalRowData = []
                    this._gstrService.gstMain.summaryData = []
                }
                this.renderGstSubTypeView(this._activateRoute.snapshot.url[1].path)
                this.spinnerService.hide();
            }, error => {
                this.alertService.error(error)
                this.spinnerService.hide()
            })
        }
    }

   


    renderGstSubTypeView(path: string) {
        switch (path) {
            case 'b2b':
                this.listSetting = {
                    title: "B2B",
                    columns: [
                        {
                            key: 'GSTNO',
                            title: 'GSTIN of Supplier'
                        },

                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice Date'
                        },
                        {
                            key: 'INVOICE_VALUE',
                            title: 'Invoice Value'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },
                        {
                            key: 'REVERSE_CHARGE',
                            title: 'Reverse Charge'
                        },
                        {
                            key: 'INVOICE_TYPE',
                            title: 'Invoice Type'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'b2ba':
                this.listSetting = {
                    title: "B2BA",
                    columns: [
                        {
                            key: 'ORIGINAL_GSTNO',
                            title: 'Origninal GSTIN of Supplier'
                        },
                        {
                            key: 'ORIGINAL_INVOICE_NUMBER',
                            title: 'Original Invoice Number'
                        },
                        {
                            key: 'ORIGINAL_INVOICE_DATE',
                            title: 'Original Invoice Date'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice Date'
                        },
                        {
                            key: 'INVOICE_VALUE',
                            title: 'Invoice Value'
                        },
                        {
                            key: 'PLACE_OF_SUPPLY',
                            title: 'Place of Supply'
                        },
                        {
                            key: 'REVERSE_CHARGE',
                            title: 'Reverse Charge'
                        },
                        {
                            key: 'INVOICE_TYPE',
                            title: 'Invoice Type'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATD_TAX',
                            title: 'Integrated Tax'
                        },
                        {
                            key: 'CENTRAL_TAX',
                            title: 'Cemtral Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State Tax'
                        },

                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'b2bur':
                this.listSetting = {
                    title: "B2BUR",
                    columns: [
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice Date'
                        },
                        {
                            key: 'INVOICE_VALUE',
                            title: 'Invoice Value'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },
                        {
                            key: 'SUPPLY_TYPE',
                            title: 'Supply Type'
                        },

                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'b2bura':
                this.listSetting = {
                    title: "B2BURA",
                    columns: [
                        {
                            key: 'ORIGINAL_INVOICE_NUMBER',
                            title: 'Original Invoice Number'
                        },
                        {
                            key: 'ORIGINAL_INVOICE_DATE',
                            title: 'Original Invoice Date'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice Date'
                        },
                        {
                            key: 'INVOICE_VALUE',
                            title: 'Invoice Value'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },
                        {
                            key: 'SUPPLY_TYPE',
                            title: 'Supply Type'
                        },

                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;


            case 'imps':
                this.listSetting = {
                    title: "IMPS",
                    columns: [
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice Number '
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice Date'
                        },
                        {
                            key: 'INVOICE_VALUE',
                            title: 'Invoice Value'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'impsa':
                this.listSetting = {
                    title: "IMPSA",
                    columns: [
                        {
                            key: 'ORIGINAL_INVOICE_NUMBER',
                            title: 'Original Invoice Number '
                        },
                        {
                            key: 'ORIGINAL_INVOICE_DATE',
                            title: 'Original Invoice Date'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice Number '
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice Date'
                        },
                        {
                            key: 'INVOICE_VALUE',
                            title: 'Invoice Value'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;


            case 'cdnr':
                this.listSetting = {
                    title: "CDNR",
                    columns: [
                        {
                            key: 'GSTNO',
                            title: 'GSTIN Of Supplier'
                        },

                        {
                            key: 'REFUND_VOUCHER_NO',
                            title: 'Note/Refund Voucher Number'
                        },
                        {
                            key: 'REFUND_VOUCHER_DATE',
                            title: 'Note/Refund Voucher Date'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice/Payment Voucher Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice/Payment Voucher Date'
                        },
                        {
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'SUPPLY_TYPE',
                            title: 'Supply Type'
                        },
                        {
                            key: 'REVERSE_CHARGE',
                            title: 'Reverse Charge'
                        },
                        {
                            key: 'REFUND_VALUE',
                            title: 'Note/Refund Voucher Value'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'cdnra':
                this.listSetting = {
                    title: "CDNRA",
                    columns: [
                        {
                            key: 'ORIGINAL_GSTNO',
                            title: 'GSTIN Of Supplier'
                        },

                        {
                            key: 'ORIGINAL_REFUND_VOUCHER_NO',
                            title: 'Original Note/Refund Voucher Number'
                        },
                        {
                            key: 'ORIGINAL_REFUND_VOUCHER_DATE',
                            title: 'Original Note/Refund Voucher Date'
                        },
                        {
                            key: 'REFUND_VOUCHER_NO',
                            title: 'Note/Refund Voucher Number'
                        },
                        {
                            key: 'REFUND_VOUCHER_DATE',
                            title: 'Note/Refund Voucher Date'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice/Payment Voucher Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice/Payment Voucher Date'
                        },
                        {
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'SUPPLY_TYPE',
                            title: 'Supply Type'
                        },
                        {
                            key: 'REVERSE_CHARGE',
                            title: 'Reverse Charge'
                        },
                        {
                            key: 'REFUND_VOUCHER_VALUE',
                            title: 'Note/Refund Voucher Value'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'cdnur':
                this.listSetting = {
                    title: "CDNUR",
                    columns: [
                        {
                            key: 'REFUND_VOUCHER_NO',
                            title: 'Note/Refund Voucher Number'
                        },
                        {
                            key: 'REFUND_VOUCHER_DATE',
                            title: 'Note/Refund Voucher Date'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice/Advance Payment Voucher Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice/Advance Payment Voucher Date'
                        },
                        {
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'SUPPLY_TYPE',
                            title: 'Supply Type'
                        },
                        {
                            key: 'INWARD_SUPPLY_TYPE',
                            title: 'Inward Supply Type'
                        },
                        {
                            key: 'REFUND_VOUCHER_VALUE',
                            title: 'Note/Refund Voucher Value'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'cdnura':
                this.listSetting = {
                    title: "CDNURA",
                    columns: [
                        {
                            key: 'ORIGINAL_INWARD_SUPPLY_TYPE',
                            title: 'Original Inward Supply Type'
                        },
                        {
                            key: 'ORIGINAL_REFUND_VOUCHER_NO',
                            title: 'Original Note/Refund Voucher Number'
                        },
                        {
                            key: 'ORIGINAL_REFUND_VOUCHER_DATE',
                            title: 'Original Note/Refund Voucher Date'
                        },
                        {
                            key: 'REFUND_VOUCHER_NO',
                            title: 'Note/Refund Voucher Number'
                        },
                        {
                            key: 'REFUND_VOUCHER_DATE',
                            title: 'Note/Refund Voucher Date'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice/Advance Payment Voucher Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice/Advance Payment Voucher Date'
                        },
                        {
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'SUPPLY_TYPE',
                            title: 'Supply Type'
                        },
                        {
                            key: 'REFUND_VOUCHER_VALUE',
                            title: 'Note/Refund Voucher Value'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'at':
                this.listSetting = {
                    title: 'AT',
                    columns: [
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place of Supply'
                        },
                        {
                            key: 'SUPPLY_TYpE',
                            title: 'Supply Type'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'GROSS_ADVANCE_PAID',
                            title: 'Gross Advance Paid'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'ata':
                this.listSetting = {
                    title: 'ATA',
                    columns: [
                        {
                            key: 'ORIGINAL_TAX_PERIOD',
                            title: 'Original Tax Period'
                        },
                        {
                            key: 'FINANCIAL_YEAR',
                            title: 'Financial Year'
                        },
                        {
                            key: 'ORIGINAL_PLACEOFSUPPLY',
                            title: 'Original Place of Supply'
                        },
                        {
                            key: 'ORIGINAL_SUPPLY_TYpE',
                            title: 'Original Supply Type'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'GROSS_ADVANCE_PAID',
                            title: 'Gross Advance Paid'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'atadj':
                this.listSetting = {
                    title: 'ATADJ',
                    columns: [
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place of Supply'
                        },
                        {
                            key: 'SUPPLY_TYpE',
                            title: 'Supply Type'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'GROSS_ADVANCE_PAID',
                            title: 'Gross Advance Paid'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'atadja':
                this.listSetting = {
                    title: 'ATADJA',
                    columns: [
                        {
                            key: 'ORIGINAL_TAX_PERIOD',
                            title: 'Original Tax Period'
                        },
                        {
                            key: 'FINANCIAL_YEAR',
                            title: 'Financial Year'
                        },
                        {
                            key: 'ORIGINAL_PLACEOFSUPPLY',
                            title: 'Original Place of Supply'
                        },
                        {
                            key: 'ORIGINAL_SUPPLY_TYpE',
                            title: 'Original Supply Type'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'GROSS_ADVANCE_PAID',
                            title: 'Gross Advance Paid'
                        },
                        {
                            key: 'INTEGRATED_TAX',
                            title: 'Integrated Tax'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess'
                        },
                        {
                            key: 'ACTION',
                            title: 'Action'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'SHEET_VALIDATION_ERRORS',
                            title: 'Sheet Validation Errors'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'txos':
                this.listSetting = {
                    title: 'TXOS',
                    columns: [
                        {
                            key: 'RATEOFTAX',
                            title: 'Rate of Tax'
                        },
                        {
                            key: 'TURNOVER',
                            title: 'Turn OVer'
                        },
                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'txosa':
                this.listSetting = {
                    title: 'TXOSA',
                    columns: [
                        {
                            key: 'ORIGINAL_TAX_PERIOD',
                            title: 'Original Tax Period'
                        },
                        {
                            key: 'FINANCIAL_YEAR',
                            title: 'Financial Year'
                        },
                        {
                            key: 'ORIGINAL_RATE_OF_TAX',
                            title: 'Original Rate of Tax'
                        },
                        {
                            key: 'TURN_OVER',
                            title: 'Turn OVer'
                        },
                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax'
                        },
                        {
                            key: 'ACTION_STATUS',
                            title: 'Action Status'
                        },
                        {
                            key: 'GST_PORTAL_VALIDATION_ERRORS',
                            title: 'GST Portal Validation Errors'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            default:
                break;
        }
    }
}