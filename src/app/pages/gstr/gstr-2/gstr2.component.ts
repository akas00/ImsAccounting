import { Component, OnInit } from '@angular/core';
import { GstrService } from '../gstr.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericListSettings } from '../gstr-card/gst-summary-list.component';
import { CacheService } from '../../../common/services/permission';
import * as moment from 'moment'

@Component({
    selector: 'gstr2',
    templateUrl: './gstr2.component.html',
})

export class Gstr2Component implements OnInit {

    public listSetting: GenericListSettings
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
            this._gstrService.gstMain.isGstReport = true
           
                this.spinnerService.show("Please Wait while data is loaded");
                this._gstrService.getGstSubTypeById(this._gstrService.gstMain.activeGstType).subscribe((res) => {
                    this._gstrService.gstMain.gstrSubReport = res.result;
                    this.spinnerService.hide();
                }, error => {
                    this.alertService.error(error)
                    this.spinnerService.hide()
                })
            
        }



        if (this._activateRoute.snapshot.url.length == 2) {
            this._gstrService.gstMain.isGstReport = false
            this._gstrService.gstMain.activeGstType = ((this._activateRoute.snapshot.url[0].path)).toUpperCase()
            this._gstrService.gstMain.activeSubGstType = ((this._activateRoute.snapshot.url[1].path)).toUpperCase()
            this.spinnerService.show("Please Wait while data is loaded");
            this._gstrService.getGstSubTypeDetailById((this._activateRoute.snapshot.url[0].path).toUpperCase(), (this._activateRoute.snapshot.url[1].path).toUpperCase()).subscribe((res) => {
                if (res.status == "ok" && res.result != null) {
                    this._gstrService.gstMain.totalRowData = res.result2
                    this._gstrService.gstMain.summaryData = res.result
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
                    title: "Summary Of Supplies From Registered Suppliers B2B(3)",
                    columns: [
                        {
                            key: 'GSTNO',
                            title: 'GST In/UIN of Recipient'
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
                            title: 'Integrated Tax Paid'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax Paid'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax Paid'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Paid'
                        },
                        {
                            key: 'ITC_ELIGIBILITY',
                            title: 'Eligibility For ITC'
                        },
                        {
                            key: 'AVAILED_ITC_INTEGRATED',
                            title: 'Availed ITC Integrated Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CENTRAL',
                            title: 'Availed ITC Central Tax'
                        },
                        {
                            key: 'AVAILED_ITC_STATE',
                            title: 'Availed ITC State/UT Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CESS',
                            title: 'Availed ITC Cess'
                        },

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'b2bur':
                this.listSetting = {
                    title: "Summary Of Supplies From Unregistered Suppliers B2BUR(4B)",
                    columns: [
                        {
                            key: 'RECEIVER_NAME',
                            title: 'Supplier Name'
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
                            title: 'Integrated Tax Paid'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax Paid'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax Paid'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Paid'
                        },
                        {
                            key: 'ITC_ELIGIBILITY',
                            title: 'Eligibility For ITC'
                        },
                        {
                            key: 'AVAILED_ITC_INTEGRATED',
                            title: 'Availed ITC Integrated Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CENTRAL',
                            title: 'Availed ITC Central Tax'
                        },
                        {
                            key: 'AVAILED_ITC_STATE',
                            title: 'Availed ITC State/UT Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CESS',
                            title: 'Availed ITC Cess'
                        },

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;


            case 'imps':
                this.listSetting = {
                    title: "SummaryFor IMPS (4C)",
                    columns: [
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice Number of Reg Recipient'
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
                            title: 'Integrated Tax Paid'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Paid'
                        },

                        {
                            key: 'ITC_ELIGIBILITY',
                            title: 'Eligibility For ITC'
                        },
                        {
                            key: 'AVAILED_ITC_INTEGRATED',
                            title: 'Availed ITC Integrated Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CESS',
                            title: 'Availed ITC Cess'
                        },
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'impg':
                this.listSetting = {
                    title: "SummaryFor IMPG (5)",
                    columns: [
                        {
                            key: 'PORT_CODE',
                            title: 'Port Code'
                        },
                        {
                            key: 'BILL_OF_ENTRY_NUMBER',
                            title: 'Bill Of Entry Number'
                        },
                        {
                            key: 'BILL_OF_ENTRY_DATE',
                            title: 'Bill of Entry Date'
                        },
                        {
                            key: 'BILL_OF_ENTRY_VALUE',
                            title: 'Bill of Entry Value'
                        },
                        {
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'GSTIN_OF_SE_SUPPLIER',
                            title: 'GSTIN of SEZ Supplier'
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
                            title: 'Integrated Tax Paid'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Paid'
                        },

                        {
                            key: 'ITC_ELIGIBILITY',
                            title: 'Eligibility For ITC'
                        },
                        {
                            key: 'AVAILED_ITC_INTEGRATED',
                            title: 'Availed ITC Integrated Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CESS',
                            title: 'Availed ITC Cess'
                        },
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'cdnr':
                this.listSetting = {
                    title: "Summary For CDNR (6C)",
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
                            title: 'Invoice/Advance Payment Voucher Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice/Advance Payment Voucher Date'
                        },
                        {
                            key: 'PREGST',
                            title: 'Pre GST'
                        },
                        {
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'REASON_FOR_ISSUING_DOCUMENT',
                            title: 'Reason For Issuing Document'
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
                            title: 'Integrated Tax Paid'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax Paid'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax Paid'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Paid'
                        },
                        {
                            key: 'ITC_ELIGIBILITY',
                            title: 'Eligibility For ITC'
                        },
                        {
                            key: 'AVAILED_ITC_INTEGRATED',
                            title: 'Availed ITC Integrated Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CENTRAL',
                            title: 'Availed ITC Central Tax'
                        },
                        {
                            key: 'AVAILED_ITC_STATE',
                            title: 'Availed ITC State/UT Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CESS',
                            title: 'Availed ITC Cess'
                        },

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'cdnur':
                this.listSetting = {
                    title: "Summary For CDNUR (6C)",
                    columns: [
                        {
                            key: 'REFUND_VOUCHER_NO',
                            title: 'Note/Voucher Number'
                        },
                        {
                            key: 'REFUND_VOUCHER_DATE',
                            title: 'Note/Voucher Date'
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
                            key: 'PREGST',
                            title: 'Pre GST'
                        },
                        {
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'REASON_FOR_ISSUING_DOCUMENT',
                            title: 'Reason For Issuing Document'
                        },
                        {
                            key: 'SUPPLY_TYPE',
                            title: 'Supply Type'
                        },
                        {
                            key: 'INVOICE_TYPE',
                            title: 'Invoice Type'
                        },
                        {
                            key: 'REFUND_VOUCHER_VALUE',
                            title: 'Note/Voucher Value'
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
                            title: 'Integrated Tax Paid'
                        },

                        {
                            key: 'CENTRAL_TAX',
                            title: 'Central Tax Paid'
                        },
                        {
                            key: 'STATE_TAX',
                            title: 'State/UT Tax Paid'
                        },

                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Paid'
                        },
                        {
                            key: 'ITC_ELIGIBILITY',
                            title: 'Eligibility For ITC'
                        },
                        {
                            key: 'AVAILED_ITC_INTEGRATED',
                            title: 'Availed ITC Integrated Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CENTRAL',
                            title: 'Availed ITC Central Tax'
                        },
                        {
                            key: 'AVAILED_ITC_STATE',
                            title: 'Availed ITC State/UT Tax'
                        },
                        {
                            key: 'AVAILED_ITC_CESS',
                            title: 'Availed ITC Cess'
                        },

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'itcr':
                this.listSetting = {
                    title: "Summary For Input Tax Credit Reversal/Reclaim(11)",
                    columns: [
                        {
                            key: 'DESCRIPTION_FOR_REVERSAL',
                            title: 'Description for reversal of ITC'
                        },
                        {
                            key: 'TO_BE_ADDED_REDUCED',
                            title: 'To be added or reduced from output liability'
                        },
                        {
                            key: 'ITC_INTEGRATED_TAX_AMOUNT',
                            title: 'ITC Integrated Tax Amount'
                        },
                        {
                            key: 'ITC_CENTRAL_TAX_AMOUNT',
                            title: 'ITC Central Tax Amount'
                        },
                        {
                            key: 'ITC_STATE_TAX_AMOUNT',
                            title: 'ITC STATE/UT Tax Amount'
                        },
                        {
                            key: 'ITC_CESS',
                            title: 'IT Cess Amount'
                        },

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'at':
                this.listSetting = {
                    title: 'Summary For Adjustment of Advance Paid under Reverse Charge(10 A)',
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
                            key: 'GROSS_ADVANCE_PAID',
                            title: 'Gross Advance Paid'
                        },
                        {
                            key: 'CESSAMOUNT',
                            title: 'Cess Amount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'atadj':
                this.listSetting = {
                    title: 'Summary For Adjustment of Advance tax Paid under Reverse Charge supplies(10 B)',
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
                            key: 'GROSS_ADVANCE_PAID',
                            title: 'Gross Advance Paid to be Adjusted'
                        },
                        {
                            key: 'CESSAMOUNT',
                            title: 'Cess Adjusted'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'exemp':
                this.listSetting = {
                    title: 'Summary For Composition, Nil Rated,exempted and non GST inward supplies',
                    columns: [
                        {
                            key: 'DESCRIPTION',
                            title: 'Description'
                        },
                        {
                            key: 'COMPOSITION_TAXABLE_PERSON',
                            title: 'Composition Taxable Person'
                        },
                        {
                            key: 'NIL_RATED_SUPPLIES',
                            title: 'Nil Rated Supplies'
                        },
                        {
                            key: 'EXEMPTED_SUPPLIES',
                            title: 'Exempted (other than nil rated/non GST Supply)'
                        },
                        {
                            key: 'NONGST_SUPPLIES',
                            title: 'Non-GST Supplies'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'hsnsum':
                this.listSetting = {
                    title: 'Summary For HSN',
                    columns: [
                        {
                            key: 'HSNCODE',
                            title: 'HSN'
                        },
                        {
                            key: 'DESCRIPTION',
                            title: 'Description'
                        },
                        {
                            key: 'UQC',
                            title: 'UQC'
                        },
                        {
                            key: 'QTY',
                            title: 'Total Quantity'
                        },
                        {
                            key: 'TOTVALUE',
                            title: 'Total Value'
                        },
                        {
                            key: 'TAXABLE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX_AMOUNT',
                            title: 'Integrated Tax Value'
                        },
                        {
                            key: 'CENTRAL_TAX_AMOUNT',
                            title: 'Central Tax'
                        },
                        {
                            key: 'STATE_TAX_AMOUNT',
                            title: 'State Tax'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Amount'
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