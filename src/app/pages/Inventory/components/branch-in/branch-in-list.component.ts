import { Component } from '@angular/core';
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';
// import { SalesTerminal } from "./stock-issue.interface";

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';

import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
@Component({
  selector: 'branch-in-list',
  templateUrl: './branch-in-list.template.html',
  providers: [AuthService],
  styleUrls: ["../../../Style.css", "../../../modal-style.css"],
})
export class BranchInListComponent {
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
        title: 'Voucher No',
        type: 'string'
      },
      TRNDATE: {
        title: 'Entry Date',
        type: 'Date'
      },
      TRN_DATE: {
        title: 'Transaction Date',
        type: 'Date'
      },
      DIVISION: {
        title: 'Division',
        type: 'string'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private masterService: MasterRepo, private _authService: AuthService, private _router: Router, public dialog: MdDialog) {
    try {
      let data: Array<TrnMain> = [];
      this.masterService.getTrnMainList('TR')
        .subscribe(res => {
          data.push(<TrnMain>res);
          //console.log({ getTrnmain: res });
        }, error => {
          this.masterService.resolveError(error, "branch-in-list - getTrnMainList");

        },
        () => {
          this.source.load(data);
          //console.log({ getTrnMainList: 'comlete', data: data })
        }

        );
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onDeleteConfirm(event): void {
    try {
      if (window.confirm('Are you sure you want to delete?')) {
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onAddClick() {
    try {
      this._router.navigate(["/pages/inventory/branch-in/add-branch-in", { vt: 5, mode: "add", returnUrl: this._router.url }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
      this._router.navigate(["/pages/inventory/branch-in/add-branch-in", { vt: 5, vchr: event.data.VCHRNO, returnUrl: this._router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit" }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this._router.navigate(["/pages/inventory/branch-in/add-branch-in", { vt: 5, vchr: event.data.VCHRNO, returnUrl: this._router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view" }])
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

}