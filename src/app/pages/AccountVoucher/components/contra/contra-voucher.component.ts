import { Component } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../common/services/setting.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "contra-voucher",
  templateUrl: "./contra-voucher.component.html",
  providers: [TransactionService]
})
export class ContraVoucherComponent {
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherType: VoucherTypeEnum = VoucherTypeEnum.ContraVoucher;
  prefix: PREFIX = <PREFIX>{};

  constructor(
    private _trnMainService: TransactionService,
    private masterService: MasterRepo,
    private _loadingSerive:SpinnerService,
    private _alertService:AlertService,
    private _activatedRoute:ActivatedRoute,
    private setting: SettingService ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this._trnMainService.initialFormLoad(62)
    this.voucherType = VoucherTypeEnum.ContraVoucher;
    this._trnMainService.DrillMode = "New";
  }

  ngOnInit() {

    this._activatedRoute.queryParams.subscribe(params => {
      if (params['mode']=="DRILL") {
        let VCHR = params['voucher']
        let vparams = []
        vparams = VCHR.split('-')
        this._loadingSerive.show("Loading Invoice")
        this.masterService.LoadTransaction(VCHR, vparams[1], vparams[2]).subscribe((res) => {
          if (res.status == "ok") {
            this._loadingSerive.hide()
            this._trnMainService.TrnMainObj = res.result;
            this._trnMainService.TrnMainObj.VoucherType = 62;
              this._trnMainService.pageHeading = "Contra Voucher";
              this._trnMainService.TrnMainObj.VoucherPrefix = "CV";
              this._trnMainService.TrnMainObj.Mode = "VIEW";
          }
        }, err => {
          this._loadingSerive.hide()
          this._alertService.error(err)
        })
  
      } else if (params['mode']=="fromLatepost"){
        //console.log("inside the fromlatepost drill")
        // alert("params['mode']==Contra voucher ")
        this._loadingSerive.show("Loading Invoice")
        this.masterService.LoadTransaction(params.voucher, params.DIVISION, params.PHISCALID).subscribe((res) => {
          if (res.status == "ok") {
            this._loadingSerive.hide()
            this._trnMainService.TrnMainObj = res.result;
            this._trnMainService.TrnMainObj.VoucherType = 62;
              this._trnMainService.pageHeading = "Contra Voucher";
              this._trnMainService.TrnMainObj.VoucherPrefix = "CE";
              this._trnMainService.TrnMainObj.Mode = "VIEW";
          }
        }, err => {
          this._loadingSerive.hide()
          this._alertService.error(err)
        })

      }
      
      else{
        if (this._activatedRoute.snapshot.params['from']) {
          let VCHR = this._activatedRoute.snapshot.params['voucherNumber']
          let params = []
          params = VCHR.split('-')
          this._loadingSerive.show("Loading Invoice")
          this.masterService.LoadTransaction(VCHR, params[1], params[2]).subscribe((res) => {
            if (res.status == "ok") {
              this._loadingSerive.hide()
              this._trnMainService.TrnMainObj = res.result;
              this._trnMainService.TrnMainObj.VoucherType = 62;
              this._trnMainService.pageHeading = "Contra Voucher";
              this._trnMainService.TrnMainObj.VoucherPrefix = "CE";
              this._trnMainService.TrnMainObj.Mode = "VIEW";
            }
          }, err => {
            this._loadingSerive.hide()
            this._alertService.error(err)
          })
    
        }else{
        this.TrnMainObj.Mode = "NEW";
        this.masterService.ShowMore = false;
        }
      }
    });
   
  }
  ngAfterViewInit(){
    ////console.log("voucherTypeInit",this._trnMainService.TrnMainObj.VoucherType)
  }

  prefixChanged(pref: any) {
    try {
      this._trnMainService.prefix = pref;
      this.prefix = pref;
      if (this.TrnMainObj.Mode == "NEW") {
        if (
          this.TrnMainObj.DIVISION == "" ||
          this.TrnMainObj.DIVISION == null
        ) {
          this.TrnMainObj.DIVISION = this.setting.appSetting.DefaultDivision;
        }
        this.masterService.getVoucherNo(this.TrnMainObj).subscribe(res => {
          if (res.status == "ok") {
            let TMain = <TrnMain>res.result;
            this.TrnMainObj.VCHRNO = TMain.VCHRNO.substr(
              2,
              TMain.VCHRNO.length - 2
            );
            this.TrnMainObj.CHALANNO = TMain.CHALANNO;
          } else {
            alert("Failed to retrieve VoucherNo");
          }
        });
      }
    } catch (ex) {
    }
  }
}
