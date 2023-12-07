import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { PrefixService } from './prefix.service';
import { PREFIX } from "../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from '../../common/interfaces/TrnMain';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MasterRepo } from "../repositories/index";
@Component(
  {
    selector: 'SeriesDialog',
    templateUrl: './prefix.component.html',
    styles: [`
            .modal{
                padding-top:0px;
            }
        `],
    providers: [PrefixService],

  }
)
export class PrefixComponent {
  selectedVT: string;
  @Input() voucherType: VoucherTypeEnum = 0;
  @Output() sendPrefix = new EventEmitter();
  @Output() closepopup = new EventEmitter();

  prefix: PREFIX = <PREFIX>{};
  prefixList: PREFIX[] = [];
  prefixes: PREFIX[] = [];
  prefixessubject: BehaviorSubject<PREFIX[]> = new BehaviorSubject([]);
  prefixesObservable$: Observable<PREFIX[]> = this.prefixessubject.asObservable();

  ngOnInit() {
    try {
      this.service.getVoucherType(this.voucherType).subscribe((data) => {
        this.prefixessubject.next(<PREFIX[]>data);
      }, error => { });
      // var vname = this.masterService.getPrefixVname(this.voucherType);
      var vchr: string = VoucherTypeEnum[this.voucherType];
      this.selectedVT = vchr;
      // this.prefix.VOUCHERNAME = this.selectedVT;
      // this.prefix.VNAME = vname;
      /*
      switch (this.voucherType) {
          case VoucherTypeEnum.Journal:
              this.selectedVT = "Journal"; this.prefix.VNAME = "JV";
              break;
          case VoucherTypeEnum.PaymentVoucher:
              this.selectedVT = "Payment"; this.prefix.VNAME = "PV";
              break;
          case VoucherTypeEnum.ReceiveVoucher:
              this.selectedVT = "Receive"; this.prefix.VNAME = "RV";
              break;
          case VoucherTypeEnum.CreditNote:
              this.selectedVT="CreditNote";this.prefix.VNAME='CN';
      }
      */
      // this.sendPrefix.emit(this.prefix);
     
    } catch (ex) {
    }
  }

  constructor(protected service: PrefixService, private masterService: MasterRepo) {

  }
  OK(){
   this.ClosePop();
  }

  getCurSequence() {
    try {
      this.sendPrefix.emit(this.prefix);
    } catch (ex) {
    }
  }

  // voucherTypeChange(selectVoucherType:VoucherTypeEnum, SelectedVoucher: string) {
  //     this.prefixList=this.prefixes.filter(x=>x.voucherType==selectVoucherType)
  //     if (SelectedVoucher != null) {
  //         if (SelectedVoucher == "Journal") {
  //             this.prefixList = this.prefixes.filter(x => x.VOUCHERTYPE == "Journal");


  //         }
  //         else if (SelectedVoucher == "Payment") {
  //             this.prefixList = this.prefixes.filter(x => x.VOUCHERTYPE == "Payment");
  //         }
  //     }
  // }

  prefixChanged() {
    try {
      // alert("A"+this.prefix.VNAME)
      this.sendPrefix.emit(this.prefix);
    } catch (ex) {
      alert(ex);
    }
  }
  ClosePop(){
    this.closepopup.emit();
  }

}
