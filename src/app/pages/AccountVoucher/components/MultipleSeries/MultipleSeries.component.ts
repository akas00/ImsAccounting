import { Component, ViewChild,Input } from "@angular/core";
import { EventEmitter } from "events";
import { ModalDirective } from "ng2-bootstrap";
import { PREFIX, TrnMain, VoucherTypeEnum } from "../../../../common/interfaces";
import { MasterRepo } from "../../../../common/repositories";
import { SettingService } from "../../../../common/services";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";

@Component({
  selector: "multiple-series",
  templateUrl: "./MultipleSeries.component.html",
  styleUrls: ["../../../modal-style.css"]
})
export class MultipleSeriesComponent {
  @ViewChild('childModal') childModal:ModalDirective;
  TrnMainObj: TrnMain = <TrnMain>{};
//   voucherType: VoucherTypeEnum;
    @Input() voucherType = new EventEmitter();

  constructor(
    private _trnMainService: TransactionService,
    private masterService: MasterRepo,
    private setting: SettingService) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    // this.voucherType === VoucherTypeEnum.Journal
    
    
   
  }
 

  ngOnInit() {
   
  }
  ngAfterViewInit() {
    this._trnMainService.prefix = <PREFIX>{}
    if(this.masterService.userSetting.ENABLEVOUCHERSERIES == 1){
      this.childModal.show();
    }
  }
  prefixChanged(pref: any) {
    try {
      this._trnMainService.prefix = pref;
      this._trnMainService.prefix = pref;
      if (this.TrnMainObj.Mode == "NEW") {
        if (
          this.TrnMainObj.DIVISION == "" ||
          this.TrnMainObj.DIVISION == null
        ) {
          this.TrnMainObj.DIVISION = this.setting.appSetting.DefaultDivision;
        }
        this.masterService.getVoucherNo(this.TrnMainObj,this._trnMainService.prefix.VNAME).subscribe(res => {
          if (res.status == "ok") {
            let TMain = <TrnMain>res.result;
            this._trnMainService.TrnMainObj.VCHRNO = res.result.VCHRNO;
            this._trnMainService.TrnMainObj.VoucherAbbName = this._trnMainService.prefix.VNAME;
            this._trnMainService.TrnMainObj.VoucherPrefix =this._trnMainService.prefix.VNAME;
            } else {
            alert("Failed to retrieve VoucherNo");
          }
        });
      }
    } catch (ex) {
    }
    
  }
  ClosePop(){
    this.childModal.hide();
  }
}