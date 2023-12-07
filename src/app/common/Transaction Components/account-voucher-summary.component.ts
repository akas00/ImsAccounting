import { TransactionService } from "./transaction.service";
import {
  Component,
  OnInit} from "@angular/core";
//import {TAcList} from '../../../../common/interfaces';
import { VoucherTypeEnum } from "../interfaces/TrnMain";
import { MasterRepo } from "../repositories/masterRepo.service";

@Component({
  selector: "account-voucher-summary",
  templateUrl: "./account-voucher-summary.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class AccountVoucherSummaryComponent implements OnInit {
  voucherType: VoucherTypeEnum;
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService 
  ) { 
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType;
  }
  
  ngOnInit() {
   
  } 
}
