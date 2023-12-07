//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { TAcList } from "../../../../common/interfaces/index";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment';
import { TableVehicleRegistrationComponent } from "../../../configuration/components/vehicle-registry/vehicleRegistrationTable.component";

@Component({
  selector: "addpurchaseinvoice",
  templateUrl: "./addpurchaseinvoice.html",
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
export class AddPurchaseInvoiceComponent {
  @ViewChild("genericHOSalesInvoiceGridTI")
  genericHOSalesInvoiceGridTI: GenericPopUpComponent;

  @ViewChild("genericsGridSAPPI")
  genericsGridSAPPI: GenericPopUpComponent;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

  gridHoSalesInvoicePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridSAPPIPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  invoiceType: string;

  prefix: PREFIX = <PREFIX>{};
  argument: any;
  printInvoice: any;
  dataArriveSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  dataArrive$: Observable<boolean> = this.dataArriveSubject.asObservable();
  constructor(
    public masterService: MasterRepo,
    private _trnMainService: TransactionService,
    public dialog: MdDialog,
    private alertService: AlertService,
    private loadingSerive: SpinnerService,
    public route: ActivatedRoute,
  ) {
    this._trnMainService.initialFormLoad(3);
    masterService.Currencies = [];
    masterService.getCurrencies();

    this.masterService.ShowMore == true;




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
              this._trnMainService.TrnMainObj.VoucherType = 3;
              this._trnMainService.pageHeading = "Purchase Invoice";
              this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
              this._trnMainService.TrnMainObj.Mode = "VIEW";
            }
          }, err => {
            this.loadingSerive.hide()
            this.alertService.error(err)
          })
    
        }
      }
    });

    this.gridHoSalesInvoicePopupSettings = {
      title: "Sales Invoices From Supplier",
      apiEndpoints: `/getAllHOTaxInvoicePagedList`,
      defaultFilterIndex : 0,
      columns: [
        {
          key: "CHALANNO",
          title: "Bill No",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNDATE",
          title: "Date",
          hidden: false,
          noSearch: false
        },
        {
          key: "NETAMNT",
          title: "Amount",
          hidden: false,
          noSearch: false
        },
       
      ]
    };

    this.gridSAPPIPopupSettings = {
      title: "Purchase Invoice From SAP",
      apiEndpoints: `/getAllSAPPurchaseInvoicePagedList`,
      defaultFilterIndex : 0,
      columns: [
        {
          key: "VCHRNO",
          title: "VOUCHER NO.",
          hidden: false,
          noSearch: false
        },
        {
          key: "PLANTDESC",
          title: "PLANT",
          hidden: false,
          noSearch: false
        },
        {
          key: "INVDATE",
          title: "INVOICE DATE",
          hidden: false,
          noSearch: false
        }
    ]
    };

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
            this._trnMainService.TrnMainObj.VoucherType = 3;
            this._trnMainService.pageHeading = "Purchase Invoice";
            this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
            this._trnMainService.TrnMainObj.Mode = "VIEW";

            this._trnMainService.TrnMainObj.TRNDATE=(this._trnMainService.TrnMainObj.TRNDATE == null || this._trnMainService.TrnMainObj.TRNDATE == "" || this._trnMainService.TrnMainObj.TRNDATE === undefined)?this._trnMainService.TrnMainObj.TRNDATE:moment(this._trnMainService.TrnMainObj.TRNDATE).format("YYYY-MM-DD");
            this._trnMainService.TrnMainObj.TRN_DATE=(this._trnMainService.TrnMainObj.TRN_DATE == null || this._trnMainService.TrnMainObj.TRN_DATE == "" || this._trnMainService.TrnMainObj.TRN_DATE === undefined)?this._trnMainService.TrnMainObj.TRN_DATE:moment(this._trnMainService.TrnMainObj.TRN_DATE).format("YYYY-MM-DD");

            if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
              this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
            }
          }
        }, err => {
          this.loadingSerive.hide()
          this.alertService.error(err)
        })
  
      }else if (params['mode']=="fromLatepost") {
        this.loadingSerive.show("Loading Invoice")
        let pcl = params['pcl'];
        this.masterService.PCL_VALUE=pcl;
        this.masterService.LoadTransaction(params.voucher, params.DIVISION, params.PHISCALID).subscribe((res) => {
          if (res.status == "ok") {
            this.loadingSerive.hide()
            this._trnMainService.TrnMainObj = res.result;
            this._trnMainService.TrnMainObj.VoucherType = 3;
            this._trnMainService.pageHeading = "Purchase Invoice";
            this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
            this._trnMainService.TrnMainObj.Mode = "VIEW";
            this._trnMainService.TrnMainObj.TRNDATE=(this._trnMainService.TrnMainObj.TRNDATE == null || this._trnMainService.TrnMainObj.TRNDATE == "" || this._trnMainService.TrnMainObj.TRNDATE === undefined)?this._trnMainService.TrnMainObj.TRNDATE:moment(this._trnMainService.TrnMainObj.TRNDATE).format("YYYY-MM-DD");
            this._trnMainService.TrnMainObj.TRN_DATE=(this._trnMainService.TrnMainObj.TRN_DATE == null || this._trnMainService.TrnMainObj.TRN_DATE == "" || this._trnMainService.TrnMainObj.TRN_DATE === undefined)?this._trnMainService.TrnMainObj.TRN_DATE:moment(this._trnMainService.TrnMainObj.TRN_DATE).format("YYYY-MM-DD");

            if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
              this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
            }          }
        }, err => {
          this.loadingSerive.hide()
          this.alertService.error(err)
        })

      }else{
        this.masterService.refreshTransactionList();

        this._trnMainService.TrnMainObj.TRNMODE = "credit";
        this.masterService.getPurchaseAcList().subscribe(
          res => {
            this._trnMainService.PurchaseAcList.push(<TAcList>res);
          },
          error => {
            this.masterService.resolveError(
              error,
              "trnmain-purchase-getPurchaseList"
            );
          },
          () => {
            if (this._trnMainService.AppSettings.MultiplePurchaseAccount == 0) {
              this._trnMainService.TrnMainObj.RETTO = this._trnMainService.AppSettings.PurchaseAc;
            }
            // ////console.log("trnmainpurchaseac",this.TrnMainObj.RETTO,this.AppSettings.PurchaseAc);
          }
        );
    
        this.masterService.getCashList().subscribe(
          res => {
            this._trnMainService.CashList = res;
          },
          error => {
            this.masterService.resolveError(error, "trnmain-purchase-getCashList");
          }
        );
    
        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(), 
        {
          title : "Import Purchase Invoice",
          sampleFileUrl : `/downloadSampleFile/${this._trnMainService.TrnMainObj.VoucherPrefix}`,  
          uploadEndpoints : `/importFileForTransaction/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
          allowMultiple : false,
          acceptFormat : ".xlsx",
         // note: this.note
        }); 
    
      } 
    });
      

  }
  showPurchaseInvoicePopup(){
    this.fileUploadPopup.show();
  }

  fileUploadSuccess(uploadResult){
    if(uploadResult.status == 'ok'){
         ////console.log("purchase invoice"+JSON.stringify(uploadResult.result))
         //////console.log("purchase invoice"+JSON.stringify(uploadResult.result.prodList)) 
        this._trnMainService.initialFormLoad(3);
         this._trnMainService.TrnMainObj.ProdList = uploadResult.result;
         if (
          !this._trnMainService.TrnMainObj ||
          !this._trnMainService.TrnMainObj.ProdList ||
          this._trnMainService.TrnMainObj.ProdList == undefined
        ) 
        return;
        this._trnMainService.TrnMainObj.VoucherType = 3;
        this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
        this._trnMainService.TrnMainObj.VoucherAbbName = "PI";
        this._trnMainService.getVoucherNumber();
        this._trnMainService.getCurrentDate();
        
        
        this._trnMainService.TrnMainObj.Mode = "NEW";
       // this._trnMainService.TrnMainObj.REFBILL = voucherNo;
        this._trnMainService.TrnMainObj.VCHRNO = "";
        this._trnMainService.TrnMainObj.CHALANNO = "";

        for (let i in this._trnMainService.TrnMainObj.ProdList) {
          //////console.log("ProdList Rate"+this._trnMainService.TrnMainObj.ProdList[i].RATE);
          this._trnMainService.setAltunitDropDownForView(i);
          ////console.log("ProdList Rate"+this._trnMainService.TrnMainObj.ProdList[i].RATE);
         // ////console.log("PurchaseInvoice",this._trnMainService.TrnMainObj.ProdList[i].RATE,this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2,i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
          this._trnMainService.AssignSellingPriceAndDiscounts(this._trnMainService.TrnMainObj.ProdList[i].PClist,i,this._trnMainService.TrnMainObj.PARTY_ORG_TYPE);
          this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE,this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2,i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
          this._trnMainService.CalculateNormalNew(i);
         
          this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
          this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));


       
        }
         
        this._trnMainService.ReCalculateBill(); 


    } else{
      this.loadingSerive.show("Error"+uploadResult.error);

    }   

  }


  showSupplierSalesInvoiceFromHOPopup() {
    this.genericHOSalesInvoiceGridTI.show();
  }

  onHoSalesInvoiceSelect(item) {
    ////console.log("checkmmm",item);
    this.getSalesInvoiceFromSupplier(item.VCHRNO,item.FROMCOMPANYID);
  }

  getSalesInvoiceFromSupplier(voucherNo: string,FROMCOMPANYID:string) {
    this.loadingSerive.show("Getting Data. Please Wait...");
    this.masterService.loadSalesInvoiceFromSupplierHO(voucherNo,FROMCOMPANYID).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );

          if (
            !this._trnMainService.TrnMainObj ||
            !this._trnMainService.TrnMainObj.ProdList ||
            this._trnMainService.TrnMainObj.ProdList == undefined
          )
            return;

            this._trnMainService.TrnMainObj.VoucherType = 3;
            this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
            this._trnMainService.TrnMainObj.VoucherAbbName = "PI";
           
           
  
            this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.REFBILL = voucherNo;
          this._trnMainService.TrnMainObj.VCHRNO = "";
          this._trnMainService.TrnMainObj.CHALANNO = "";
        
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.ProdList[i].inputMode=false;
            this._trnMainService.setAltunitDropDownForView(i);
            
            this._trnMainService.AssignSellingPriceAndDiscounts(this._trnMainService.TrnMainObj.ProdList[i].PClist,i,this._trnMainService.TrnMainObj.PARTY_ORG_TYPE);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE,this._trnMainService.TrnMainObj.ProdList[i].SPRICE,i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.CalculateNormalNew(i);
         
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));

          }       
          this._trnMainService.ReCalculateBill(); 
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }

  showSAPPurchaseInvoice(){
    this.genericsGridSAPPI.show();
  }

  onSAPPurchaseInvoiceSelect(item){
    this.loadSAPPurchaseInvoice(item.VCHRNO);
  }

  loadSAPPurchaseInvoice(voucherNo : string){
    this.loadingSerive.show("Getting Data. Please Wait...");
    this.masterService.loadSAPPurchaseInvoiceDetail(voucherNo).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );

       
          if (
            !this._trnMainService.TrnMainObj ||
            !this._trnMainService.TrnMainObj.ProdList ||
            this._trnMainService.TrnMainObj.ProdList == undefined
          )
            return;
            this._trnMainService.TrnMainObj.VoucherType = 3;
            this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
            this._trnMainService.TrnMainObj.VoucherAbbName = "PI";
            
  
            this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.REFBILL = voucherNo;
          this._trnMainService.TrnMainObj.VCHRNO = "";
          this._trnMainService.TrnMainObj.CHALANNO = "";
          this._trnMainService.TrnMainObj.tag="FTP";
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.ProdList[i].inputMode=false;
            this._trnMainService.setAltunitDropDownForView(i);
            
            this._trnMainService.AssignSellingPriceAndDiscounts(this._trnMainService.TrnMainObj.ProdList[i].PClist,i,this._trnMainService.TrnMainObj.PARTY_ORG_TYPE);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE,this._trnMainService.TrnMainObj.ProdList[i].SPRICE,i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.CalculateNormalNew(i);
           
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));

            // this._trnMainService.setAltunitDropDownForView(i);
            // this._trnMainService.getPricingOfItem(i, "", false);

            // this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            // this._trnMainService.TrnMainObj.ProdList[i].VoucherType = 3;

            // this._trnMainService.TrnMainObj.ProdList[i].MFGDATE =
            //   this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null
            //     ? ""
            //     : this._trnMainService.TrnMainObj.ProdList[
            //         i
            //       ].MFGDATE.toString().substring(0, 10);
            // this._trnMainService.TrnMainObj.ProdList[i].EXPDATE =
            //   this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null
            //     ? ""
            //     : this._trnMainService.TrnMainObj.ProdList[
            //         i
            //       ].EXPDATE.toString().substring(0, 10);
          }

        //   var ZeroStockedProduct = this._trnMainService.TrnMainObj.ProdList.filter(
        //     x => x.SELECTEDITEM.STOCK <= 0
        //   );
        //   this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(
        //     x => x.SELECTEDITEM.STOCK > 0
        //   );

        
          this._trnMainService.ReCalculateBill(); 
          this._trnMainService.getVoucherNumber();
            this._trnMainService.getCurrentDate();
        }
        else
        {
          this.loadingSerive.hide();
          this.alertService.error(result.result._body);
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }



  saveTaxInvoice(){
    this._trnMainService.TrnMainObj.Mode = 'NEW';
    this._trnMainService.TrnMainObj.tag="shipto";
    this.alertService.show()
    this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj)
    .subscribe((data)=>{
      if(data.status=="ok"){
        this.alertService.hide()
        this.popupClose()
      }
    },error=>{
      this.alertService.error(error)
    })
  }


  popupClose(){
    this._trnMainService.initialFormLoad(3)
  }
}
