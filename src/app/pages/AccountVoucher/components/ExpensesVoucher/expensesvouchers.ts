import { Component, ViewChild } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import 'style-loader!../../../Purchases/components/purchaseinvoice/smartTables.scss';
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
//import {IncomeVoucherService} from './incomevoucher.services'
@Component({
  selector: 'expensesvoucher',
  templateUrl: './expensesvouchers.html',
  providers: [MockMasterRepo, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class ExpensesVouchers {
  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    view: {
      viewButtonContent: 'View',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '',
      confirmDelete: true
    },
    columns: {
      VCHRNO: {
        title: 'Voucher No.',
        type: 'string'
      },
      DIVISION: {
        title: 'Division',
        type: 'string'
      },
      TRNAC: {
        title: 'Trn. A/c',
        type: 'string'
      },
      PhiscalID: {
        title: 'Fiscal Year',
        type: 'string'
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(private masterService: MasterRepo, private _authService: AuthService, private router: Router, public dialog: MdDialog) {
    try {
      let data: Array<TrnMain> = [];
      //this.service.getJournalList()
      this.masterService.getTrnMainList('PV')
        .subscribe(res => {
          data.push(<TrnMain>res);
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "expensesvouchers - getTrnMainList");
        }

        );
    } catch (ex) {
    }
  }
  setMode() { }
  onAddClick() {
    try {
      this.router.navigate(["/pages/masters/acvouchers/voucher/add-expensevoucher", { vt: 17, mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["/pages/masters/acvouchers/voucher/add-expensevoucher", { vt: 17, vchrNo: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit", returnUrl: this.router.url }]);
    } catch (ex) {
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["/pages/masters/acvouchers/voucher/add-expensevoucher", { vt: 17, vchrNo: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view", returnUrl: this.router.url }]);
    } catch (ex) {
    }
  }

  onDeleteConfirm(event): void { }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

}
