import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';

import 'style-loader!./smartTables.scss';

import { JournalVoucherService } from './journal-voucher.service'
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
@Component({
  selector: 'journal-list',
  templateUrl: './journal-list.template.html',
  providers: [JournalVoucherService, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class JournalListComponent {

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
      CHALANNO: {
        title: 'Chalan No.',
        type: 'string'
      },
      DIVISION: {
        title: 'Division',
        type: 'string'
      },
      PhiscalID: {
        title: 'Fiscal Year',
        type: 'string'
      },
      TRNDATE: {
        title: 'Date',
        type: 'text'
      },
      BSDATE: {
        title: 'Miti',
        type: 'text'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private masterService: MasterRepo, private _authService: AuthService, private _journalVoucherService: JournalVoucherService, private _router: Router, public dialog: MdDialog) {
    try {
      let data: Array<TrnMain> = [];

      //this.service.getJournalList()
      this.masterService.getTrnMainList('JV')
        .subscribe(res => {
          data.push(<TrnMain>res);

        }, error => {
          this.masterService.resolveError(error, "journal-list - getTrnMainList");
        },
          () => {
            this.source.load(data);

          }

        );
    } catch (ex) {
      //alert(ex);
    }
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onAddClick() {
    try {


      //if (this._authService.checkMenuRight("journalvoucher", "add") == true) {
      this._router.navigate(["pages/masters/acvouchers/journalvoucher/add-journal-voucher", { mode: "add", returnUrl: this._router.url }])
      //  } else {
      this.messageSubject.next("You are not authorized to add journal voucher.");
      //  this.openAuthDialog();
      // }
    } catch (ex) {
      //alert(ex);
    }
  }

  onEditClick(event): void {
    try {
      this._router.navigate(["/pages/masters/acvouchers/journalvoucher/add-journal-voucher", {
        vchrNo: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit", returnUrl: this._router.url
      }])
      // if (this._authService.checkMenuRight("journalvoucher", "edit") == true) {
      //   this._router.navigate(["/pages/acvouchers/journalvoucher/add-journal-voucher", {
      //     vchrNo: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit", returnUrl: this._router.url
      //   }])
      // } else {
      //   this.messageSubject.next("You are not authorized to edit journal voucher.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this._router.navigate(["/pages/masters/acvouchers/journalvoucher/add-journal-voucher", { vchrNo: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view", returnUrl: this._router.url }])
      // if (this._authService.checkMenuRight("journalvoucher", "view") == true) {
      //   this._router.navigate(["/pages/acvouchers/journalvoucher/add-journal-voucher", { vchrNo: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view", returnUrl: this._router.url }])
      // } else {
      //   this.messageSubject.next("You are not authorized to view journal voucher.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      // alert(ex);
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

}


