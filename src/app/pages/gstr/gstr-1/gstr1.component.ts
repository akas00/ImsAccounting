import { Component, OnInit } from '@angular/core';
import { GstrService } from '../gstr.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericListSettings } from '../gstr-card/gst-summary-list.component';
import { CacheService } from '../../../common/services/permission';
import * as moment from 'moment'

@Component({
    selector: 'gstr1',
    templateUrl: './gstr1.component.html',
})

export class Gstr1Component implements OnInit {

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
                    title: "Summary For B2B(4)",
                    columns: [
                        {
                            key: 'GSTNO',
                            title: 'GST In/UIN of Recipient'
                        },
                        {
                            key: 'RECEIVER_NAME',
                            title: 'Receiver Name'
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
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
                        },
                        {
                            key: 'INVOICE_TYPE',
                            title: 'Invoice Type'
                        },
                        {
                            key: 'ECOMMERCE_GSTIN',
                            title: 'E-commere GSTN'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'b2ba':
                this.listSetting = {
                    title: "Summary For B2BA",
                    columns: [
                        {
                            key: 'GSTNO',
                            title: 'GST In/UIN of Recipient'
                        },
                        {
                            key: 'RECEIVER_NAME',
                            title: 'Receiver Name'
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
                            key: 'REVISED_INVOICE_NUMBER',
                            title: 'Revised Invoice Number'
                        },
                        {
                            key: 'REVISED_INVOICE_DATE',
                            title: 'Revised Invoice Date'
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
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
                        },
                        {
                            key: 'INVOICE_TYPE',
                            title: 'Invoice Type'
                        },
                        {
                            key: 'ECOMMERCE_GSTIN',
                            title: 'E-commere GSTN'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'b2cl':
                this.listSetting = {
                    title: "Summary For B2CL(5)",
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
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        },
                        {
                            key: 'ECOMMERCE_GSTIN',
                            title: 'E-commere GSTN'
                        },
                        {
                            key: 'SALESFROMBONDEDWH',
                            title: 'Sale from Bonded WH'
                        }

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'b2cla':
                this.listSetting = {
                    title: "Summary For B2CLA",
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
                            key: 'ORIGINAL_PLACEOFSUPPLY',
                            title: 'Original Place Of Supply'
                        },
                        {
                            key: 'REVISED_INVOICE_NUMBER',
                            title: 'Revised Invoice Number'
                        },
                        {
                            key: 'REVISED_INVOICE_Date',
                            title: 'Revised Invoice Date'
                        },
                        {
                            key: 'INVOICE_VALUE',
                            title: 'Invoice Value'
                        },
                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        },
                        {
                            key: 'ECOMMERCE_GSTIN',
                            title: 'E-commere GSTN'
                        },
                        {
                            key: 'SALESFROMBONDEDWH',
                            title: 'Sale from Bonded WH'
                        }

                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'b2cs':
                this.listSetting = {
                    title: "Summary For B2CS(7)",
                    columns: [

                        {
                            key: 'TYPE',
                            title: 'Type'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },

                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        },
                        {
                            key: 'ECOMMERCE_GSTIN',
                            title: 'E-commere GSTN'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'b2csa':
                this.listSetting = {
                    title: "Summary For B2CSA",
                    columns: [


                        {
                            key: 'FINANCIAL_YEAR',
                            title: 'Financial Year'
                        },
                        {
                            key: 'ORIGINAL_MONTH',
                            title: 'Original Month'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },
                        {
                            key: 'TYPE',
                            title: 'Type'
                        },
                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        },
                        {
                            key: 'ECOMMERCE_GSTIN',
                            title: 'E-commere GSTN'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'cdnr':
                this.listSetting = {
                    title: "Summary For CDNR(9B)",
                    columns: [
                        {
                            key: 'GSTNO',
                            title: 'GST In/UIN of Recipient'
                        },
                        {
                            key: 'RECEIVER_NAME',
                            title: 'Receiver Name'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice/Advance Receipt Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice/Advance Receipt Date'
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
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },
                        {
                            key: 'REFUND_VALUE',
                            title: 'Note/Refund Voucher Value'
                        },
                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        },
                        {
                            key: 'PREGST',
                            title: 'Pre GST'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'cdnra':
                this.listSetting = {
                    title: "Summary For CDNRA",
                    columns: [
                        {
                            key: 'GSTNO',
                            title: 'GST In/UIN of Recipient'
                        },
                        {
                            key: 'RECEIVER_NAME',
                            title: 'Receiver Name'
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
                            key: 'ORIGINAL_INVOICE_NUMBER',
                            title: 'Original Invoice/Advance Receipt Number'
                        },
                        {
                            key: 'ORIGINAL_INVOICE_DATE',
                            title: 'Original Invoice/Advance Receipt Date'
                        },

                        {
                            key: 'REVISED_REFUND_VOUCHER_NO',
                            title: 'Revised Note/Refund Voucher Number'
                        },
                        {
                            key: 'REVISED_REFUND_VOUCHER_DATE',
                            title: 'Revised Note/Refund Voucher Date'
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
                            key: 'REFUND_VALUE',
                            title: 'Note/Refund Voucher Value'
                        },
                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        },
                        {
                            key: 'PREGST',
                            title: 'Pre GST'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'cdnur':
                this.listSetting = {
                    title: "Summary For CDNUR (9B)",
                    columns: [
                        {
                            key: 'UR_TYPE',
                            title: 'UR TYPE'
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
                            key: 'DOCUMENT_TYPE',
                            title: 'Document Type'
                        },
                        {
                            key: 'INVOICE_NUMBER',
                            title: 'Invoice/Advance Receipt Number'
                        },
                        {
                            key: 'INVOICE_DATE',
                            title: 'Invoice/Advance Receipt Date'
                        },
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place Of Supply'
                        },
                        {
                            key: 'REFUND_VALUE',
                            title: 'Note/Refund Voucher Value'
                        },
                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        },
                        {
                            key: 'PREGST',
                            title: 'Pre GST'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'cdnura':
                this.listSetting = {
                    title: "Summary For CDNURA",
                    columns: [
                        {
                            key: 'UR_TYPE',
                            title: 'UR TYPE'
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
                            key: 'ORIGINAL_INVOICE_NUMBER',
                            title: 'Original Invoice/Advance Receipt Number'
                        },
                        {
                            key: 'ORIGINAL_INVOICE_DATE',
                            title: 'Original Invoice/Advance Receipt Date'
                        },
                        {
                            key: 'REVISED_REFUND_NUMBER',
                            title: 'Revised Note/Refund Voucher Number'
                        },
                        {
                            key: 'REVISED_REFUND_DATE',
                            title: 'Revised Note/Refund Voucher Date'
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
                            key: 'REFUND_VALUE',
                            title: 'Note/Refund Voucher Value'
                        },
                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
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
                            key: 'CESS_AMOUNT',
                            title: 'Cess AMount'
                        },
                        {
                            key: 'PREGST',
                            title: 'Pre GST'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'exemp':
                this.listSetting = {
                    title: "Summary For Nil Rated, Exempted and non GST outward supplies (8)",
                    columns: [
                        {
                            key: 'Description',
                            title: 'Description'
                        },

                        {
                            key: 'NIL_RATED_SUPPLIES',
                            title: 'Nill Rated Supplies'
                        },
                        {
                            key: 'EXEMPTED_SUPPLIES',
                            title: 'Exempted (other than Nill rated/non GST Supply)'
                        },
                        {
                            key: 'NONGST_SUPPLIES',
                            title: 'Non-GST Supplies'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'hsn':
                this.listSetting = {

                    title: "Summary For HSN(12)",
                    columns: [
                        {
                            key: 'HSN',
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
                            key: 'QUANTITY',
                            title: 'Total Quantity'
                        },
                        {
                            key: 'TOTAL_VALUE',
                            title: 'Total Values'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable Value'
                        },
                        {
                            key: 'INTEGRATED_TAX_AMOUNT',
                            title: 'Integrated Tax Amount'
                        },
                        {
                            key: 'CENTRAL_TAX_AMOUNT',
                            title: 'Central Tax Amount'
                        },
                        {
                            key: 'STATE_TAX_AMOUNT',
                            title: 'State/UT Tax Amount'
                        },
                        {
                            key: 'CESSAMOUNT',
                            title: 'Cess Amount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'exp':
                this.listSetting = {

                    title: "Summary For EXP(6)",
                    columns: [
                        {
                            key: 'EXPORT_TYPE',
                            title: 'Export Type'
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
                            key: 'PORT_CODE',
                            title: 'Port Code'
                        },
                        {
                            key: 'SHIPPING_BILLING_NUMBER',
                            title: 'Shipping Billing Number'
                        },
                        {
                            key: 'SHIPPING_BILLING_DATE',
                            title: 'Shipping Billing Date'
                        },
                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable value'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Amount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'expa':
                this.listSetting = {

                    title: "Summary For EXPA",
                    columns: [
                        {
                            key: 'EXPORT_TYPE',
                            title: 'Export Type'
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
                            key: 'REVISED_INVOICE_NUMBER',
                            title: 'Revised Invoice Number'
                        },

                        {
                            key: 'REVISED_INVOICE_DATE',
                            title: 'Revised Invoice Date'
                        },
                        {
                            key: 'INVOICE_VALUE',
                            title: 'Invoice Value'
                        },
                        {
                            key: 'PORT_CODE',
                            title: 'Port Code'
                        },
                        {
                            key: 'SHIPPING_BILLING_NUMBER',
                            title: 'Shipping Billing Number'
                        },
                        {
                            key: 'SHIPPING_BILLING_DATE',
                            title: 'Shipping Billing Date'
                        },
                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'TAXABLE_VALUE',
                            title: 'Taxable value'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Amount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;


            case 'at':
                this.listSetting = {

                    title: "Summary For Advance Received (11B)",
                    columns: [
                        {
                            key: 'PLACEOFSUPPLY',
                            title: 'Place of Supply'
                        },

                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'GROSS_ADVANCE_RECEIVED',
                            title: 'Gross Advance Received'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Amount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'ata':
                this.listSetting = {

                    title: "Summary For Amended Tax Liability (Advance Received)",
                    columns: [
                        {
                            key: 'FINANCIALYEAR',
                            title: 'Financial Year'
                        },
                        {
                            key: 'ORIGINALMONTH',
                            title: 'Original Month'
                        },

                        {
                            key: 'ORIGNALPLACEOFSUPPLY',
                            title: 'Original Place of Supply'
                        },

                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'GROSS_ADVANCE_RECEIVED',
                            title: 'Gross Advance Received'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Amount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'atadj':
                this.listSetting = {

                    title: "Summary For Advance Adjusted (11B)",
                    columns: [
                        {
                            key: 'PLACEOFSUPPLY',
                            title: ' Place of Supply'
                        },

                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'GROSS_ADVANCE_RECEIVED',
                            title: 'Gross Advance Received'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Amount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;

            case 'atadja':
                this.listSetting = {

                    title: "Summary For Amendment of Adjustment Advances",
                    columns: [
                        {
                            key: 'FINANCIALYEAR',
                            title: 'Financial Year'
                        },
                        {
                            key: 'ORIGINALMONTH',
                            title: 'Original Month'
                        },

                        {
                            key: 'ORIGINALPLACEOFSUPPLY',
                            title: 'Original Place of Supply'
                        },

                        {
                            key: 'APPLICABLE_TAXRATE',
                            title: 'Applicable % of Tax Rate'
                        },
                        {
                            key: 'RATE',
                            title: 'Rate'
                        },
                        {
                            key: 'GROSS_ADVANCE_RECEIVED',
                            title: 'Gross Advance Received'
                        },
                        {
                            key: 'CESS_AMOUNT',
                            title: 'Cess Amount'
                        }
                    ]
                }
                this._gstrService.gstMain.isGstSubReport = true;
                break;
            case 'docs':
                this.listSetting = {

                    title: "Summary of documents issued during the tax period(13)",
                    columns: [
                        {
                            key: 'NATURE_OF_DOCUMENT',
                            title: 'Nature of Document'
                        },
                        {
                            key: 'MIN_SR_NO',
                            title: 'Sr. No. From'
                        },

                        {
                            key: 'MAX_SR_NO',
                            title: 'Sr. No. To'
                        },

                        {
                            key: 'TOTAL_NUMBER',
                            title: 'Total Number'
                        },
                        {
                            key: 'CANCELLED',
                            title: 'Cancelled'
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