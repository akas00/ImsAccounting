import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { EnableLatePost} from "../../../../common/interfaces";
import { AuthService } from "../../../../common/services/permission/authService.service";
import * as moment from 'moment';

@Component({
  selector: "addsales-invoice",
  templateUrl: "./AddSalesInvoice.html",
  providers: [TransactionService],
  styles: [
    `
      .GRNPopUp tbody tr:hover {
        background-color: #e0e0e0;
      }
      .GRNPopUp tr.active td {
        background-color: #123456 !important;
        color: white;
      }
      .modal-dialog.modal-md {
        top: 45%;
        margin-top: 0px;
      }

      .modal-dialog.modal-sm {
        top: 45%;
        margin-top: 0px;
      } 
    `
  ]
})
export class AddSalesInvoiceComponent {
  TrnMainObj: TrnMain = <TrnMain>{};
  VoucherLatePostList: EnableLatePost[] = [];

  public hideShow: boolean = false
  @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;

  @ViewChild("genericPerformaInvoiceGridSO") genericPerformaInvoiceGridSO: GenericPopUpComponent;
  @ViewChild("genericCancelSales") genericCancelSales: GenericPopUpComponent

  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridPerformaInvoicePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridcancelSalesPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  PhiscalObj: any = <any>{};

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private loadingSerive: SpinnerService,
    private authService: AuthService
  ) {
    this._trnMainService.initialFormLoad(14);
    this.PhiscalObj = authService.getPhiscalInfo();
    var PID = this.PhiscalObj.PhiscalID;
    PID = PID.replace("/", "ZZ");
    this.gridPopupSettings = {
      title: "Sales Vouchers",
      apiEndpoints: `/getTrnMainPagedList/SO/${PID}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "VCHRNO",
          title: "Voucher No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "DIVISION",
          title: "Division",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNAC",
          title: "Trn. A/c",
          hidden: false,
          noSearch: false
        },
        {
          key: "PhiscalId",
          title: "Fiscal Year",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.gridPerformaInvoicePopupSettings = {
      title: "Approved Performa Vouchers",
      apiEndpoints: `/getApprovedHOPerformaInvoicePagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "VCHRNO",
          title: "Voucher No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "DIVISION",
          title: "Division",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNAC",
          title: "Trn. A/c",
          hidden: false,
          noSearch: false
        },
        {
          key: "PhiscalId",
          title: "Fiscal Year",
          hidden: false,
          noSearch: false
        }
      ]
    };


    this.gridcancelSalesPopupSettings = {
      title: "Sales Invoice ",
      apiEndpoints: `/getTrnMainDateWisePagedList/TI`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'CHALANNO',
          title: 'BILL NO',
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
          key: 'TRNMODE',
          title: 'TYPE',
          hidden: false,
          noSearch: false
        },

        {
          key: 'NETAMNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.route.queryParams.subscribe(params => {
      if (params['mode']=="DRILL") {
      }else{
        if (params.voucher) {
          let voucherNo = params.voucher;
          this.getSelectedPerformaInvoice(voucherNo);
        }
        if (params.status) {
          let status = params.status;
        }
        if (params.downloaded) {
          let downloadedState = params.downloaded;
          if (downloadedState == 1) {
          } // this._trnMainService.showPerformaApproveReject = false;
        }
      }
      
    });
    this.route.queryParams
    .subscribe(params => {
      if (params.from == "Ledger") {
        if (params.voucherNumber) {
          let VCHR = params.voucherNumber;
          let divphiscal = []
          divphiscal = VCHR.split('-')
          this.loadingSerive.show("Loading Invoice")
          this.masterService.LoadTransaction(VCHR, divphiscal[1], divphiscal[2]).subscribe((res) => {
            if (res.status == "ok") {
              this.loadingSerive.hide()
              this._trnMainService.TrnMainObj = res.result;
              this._trnMainService.TrnMainObj.VoucherType = 14;
              this._trnMainService.pageHeading = "Tax Invoice";
              this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
              this._trnMainService.TrnMainObj.Mode = "VIEW";
            }
          }, err => {
            this.loadingSerive.hide()
            this.alertService.error(err)
          })
    
        }
      }
    });


  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mode']=="DRILL") {
        let VCHR = params['voucher']
        let vparams = []
        vparams = VCHR.split('-');
        let pcl = params['pcl'];
        this.masterService.PCL_VALUE=pcl;
        this.loadingSerive.show("Loading Invoice")
        this.masterService.LoadTransaction(VCHR, vparams[1], vparams[2]).subscribe((res) => {
          if (res.status == "ok") {
            this.loadingSerive.hide()
            this._trnMainService.TrnMainObj = res.result;
            this._trnMainService.TrnMainObj.VoucherType = 14;
            this._trnMainService.pageHeading = "Tax Invoice";
            this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
            this._trnMainService.TrnMainObj.Mode = "VIEW";

            this._trnMainService.TrnMainObj.TRNDATE=(this._trnMainService.TrnMainObj.TRNDATE == null || this._trnMainService.TrnMainObj.TRNDATE == "" || this._trnMainService.TrnMainObj.TRNDATE === undefined)?this._trnMainService.TrnMainObj.TRNDATE:moment(this._trnMainService.TrnMainObj.TRNDATE).format("YYYY-MM-DD");
            this._trnMainService.TrnMainObj.TRN_DATE=(this._trnMainService.TrnMainObj.TRN_DATE == null || this._trnMainService.TrnMainObj.TRN_DATE == "" || this._trnMainService.TrnMainObj.TRN_DATE === undefined)?this._trnMainService.TrnMainObj.TRN_DATE:moment(this._trnMainService.TrnMainObj.TRN_DATE).format("YYYY-MM-DD");

            this._trnMainService.TrnMainObj.ProdList.forEach(x=>{
              x.ALTERNATEQUANTIY == 0 ?x.ALTERNATEQUANTIY=x.AltQty:x.ALTERNATEQUANTIY})
              
            if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
              this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
            }
          }
        }, err => {
          this.loadingSerive.hide()
          this.alertService.error(err)
        })
  
      } else {
        this.TrnMainObj.Mode = "NEW";
        this.masterService.ShowMore = false;
        this.masterService.getEnableLatePost().subscribe(res => {
          if (res.status == "ok") {
            this.VoucherLatePostList = res.result
            for (let i of this.VoucherLatePostList) {
  
              if (i.VoucherName == 'TaxInvoice') {
  
                if (i.Status == 1) {
  
                  this._trnMainService.TrnMainObj.isVoucherLatePostEnable = 1;
                }
  
              }
            }
          }
  
        })
      }
    });
  }

  showLoadFromSOPopup($event) {
    this.genericGridSO.show();
  }

  showApprovedPreformaInvoicePopup($event) {
    this.genericPerformaInvoiceGridSO.show();
  }


  showSalesDayWise($event) {
    this.genericCancelSales.show()
  }

  onPerformaInvoiceSelect(performaInvoice) {
    this.getSelectedPerformaInvoice(performaInvoice.VCHRNO);
  }

  oncancelSalesSelect(salesCancel) {
    //console.log(salesCancel)
  }

  getSelectedPerformaInvoice(voucherNo) {
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.loadHoPerformaInvoice(voucherNo).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.Mode = "NEW";
          for (
            let i = 0;
            i < this._trnMainService.TrnMainObj.ProdList.length;
            i++
          ) {
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            // this._trnMainService.TrnMainObj.ProdList[i].Quantity = result.result.ProdList[i].Quantity;
          }

          this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
          this._trnMainService.TrnMainObj.VoucherType = 14;
          this._trnMainService.pageHeading = "Tax Invoice";

          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          this._trnMainService.ReCalculateBill();
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }

  onSalesOrderSelect(item) {
    this.masterService.loadSalesInvoiceFromSalesOrder(item.VCHRNO).subscribe(
      result => {
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );

          this._trnMainService.TrnMainObj.Mode = "NEW";
          if (
            !this._trnMainService.TrnMainObj ||
            !this._trnMainService.TrnMainObj.ProdList ||
            this._trnMainService.TrnMainObj.ProdList == undefined
          )
            return;
          this._trnMainService.TrnMainObj.REFBILL = item.VCHRNO;
          this._trnMainService.TrnMainObj.VoucherType = 14;
          this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
          this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts(this._trnMainService.TrnMainObj.ProdList[i].PClist, i, "");
            let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
            this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;

            this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.CalculateNormalNew(i);

          }

          var ZeroStockedProduct = this._trnMainService.TrnMainObj.ProdList.filter(
            x => x.SELECTEDITEM.STOCK <= 0
          );
          this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(
            x => x.SELECTEDITEM.STOCK > 0
          );

          this._trnMainService.ReCalculateBill();

          if (ZeroStockedProduct != null && ZeroStockedProduct.length > 0) {
            this.alertService.error(
              "Some Of the item have been excluded because of unavailable Stock"
            );
          }
        }
      },
      error => { }
    );
  }

  onItemDoubleClick(event) {
    this._trnMainService.TrnMainObj.REFORDBILL = event.VCHRNO;
    this._trnMainService.loadSODataToSales(event.VCHRNO);
  }




  onSalesCancelSelect(selectedItem) {
    this.loadTaxInvoiceForCancel(selectedItem.VCHRNO, selectedItem.DIVISION, selectedItem.PhiscalId)
  }




  loadTaxInvoiceForCancel(VCHR, division, phiscalid) {
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe(
      result => {
        //console.log(result)
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result;
          this._trnMainService.TrnMainObj.REFBILL = VCHR;
          this._trnMainService.TrnMainObj.VoucherType = 61;
          this._trnMainService.pageHeading = "Tax Invoice [Cancel]";
          this._trnMainService.TrnMainObj.VoucherPrefix = "SC";
          this._trnMainService.TrnMainObj.Mode = "VIEW";
          this._trnMainService.ReCalculateBill();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.setAltunitDropDownForViewStock(i)
            this._trnMainService.getPricingOfItem(i, "", true);
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          }
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }
}
