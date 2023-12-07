import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'
//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';

import 'style-loader!./smartTables.scss';
import { AccountServices } from './account.service'
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
@Component({
  selector: 'purchaseinvoices',
  templateUrl: './ListAccount.component.html',
  providers: [AccountServices, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class AccountComponent {
  router: Router;
  settings = {
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
      editButtonContent: '<button type="button" class="btn btn-info">Edit</button>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    columns: {
      Id: {
        title: 'ID',
        type: 'number'
      },
      AccountName: {
        title: 'AccountName',
        type: 'string'
      },
      AccountCode: {
        title: 'AccountCode',
        type: 'number'
      },
      AccountType: {
        title: 'AccountType',
        type: 'string'
      },

    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(protected service: AccountServices, router: Router, private _authService: AuthService, public dialog: MdDialog) {
    try {
      this.router = router;
      this.service.getData().then((data) => {
        this.source.load(data);
      });
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  addNewAccount() {
    try {
      this.router.navigate(["./pages/masters/ac-list/add-ac-list", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["./pages/masters/ac-list/add-ac-list", { mode: "edit", returnUrl: this.router.url }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
     this.router.navigate(["./pages/masters/ac-list/add-ac-list", { Id: event.data.ID, mode: "view", returnUrl: this.router.url }]);
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

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
  
}