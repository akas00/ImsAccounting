import {
  AdditionalCostService
} from "./../../pages/Purchases/components/AdditionalCost/addtionalCost.service";
import { TransactionService } from "./transaction.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
//import {TAcList} from '../../../../common/interfaces';
import {
  TrnMain,
  VoucherTypeEnum
} from "./../interfaces/TrnMain";
import {
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { MasterRepo } from "./../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "./../services";
import { AuthService } from "../services/permission/authService.service";
import { MdDialog } from "@angular/material";

@Component({
  selector: "voucher-total-area",
  templateUrl: "./voucher-total-area.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class VoucherTotalAreaComponent implements OnInit {

  @Input() isSales;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  modeTitle: string = "";

  TrnMainObj: TrnMain = <TrnMain>{};

  form: FormGroup;
  AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};
  // additonalCost is 99 sends from AdditionalCost component
  @Input() additionCost: number;
  @Output() additionalcostEmit = new EventEmitter();

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService

  ) {

  }

  ngOnInit() {
  }


  ngOnDestroy() {
    try {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    } catch (ex) {
    }
  }
  onKeydownPreventEdit(event) {

    event.preventDefault();


  }
}
