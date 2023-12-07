import { Component } from '@angular/core';
import { AuthDialog } from "./../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import 'style-loader!../../../Purchases/components/purchaseinvoice/smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { IncomeVoucherService } from './incomevoucher.services'
import { MdDialog, MdDialogModule } from "@angular/material";
import { LoginDialog } from "../../../modaldialogs/index";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'incomevoucher',
  templateUrl: './IncomeVouchers.html',
  providers: [IncomeVoucherService, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class IncomeVouchers {
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
      PhiscalId: {
        title: 'Fiscal Year',
        type: 'string'
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(private IVService: IncomeVoucherService, private _authService: AuthService, private router: Router, private masterService: MasterRepo, public dialog: MdDialog) {
    try {
      let data: Array<any> = [];
      this.masterService.getTrnMainList("RV")
        .subscribe(res => {
          data.push(<any>res);
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "IncomeVouchers - getTrnMainList");
        });

    } catch (ex) {
      //alert(ex);
    }
  }
  setMode() { }
  onAddClick() {
    try {
      this.router.navigate(["/pages/masters/acvouchers/voucher/add-incomevoucher", { vt: 18, mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      //alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["/pages/masters/acvouchers/voucher/add-incomevoucher", { vt: 18, vchrNo: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit", returnUrl: this.router.url }]);
    } catch (ex) {
     // alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["/pages/masters/acvouchers/voucher/add-incomevoucher", { vt: 18, vchrNo: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view", returnUrl: this.router.url }]);
    } catch (ex) {
      //alert(ex);
    }
  }

  onDeleteConfirm(event): void { }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
}
