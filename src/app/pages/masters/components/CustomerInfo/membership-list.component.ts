import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';
import { TMember } from "./membership.interface";
//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';

import 'style-loader!./smartTables.scss';

import { MembershipService } from './membership.service';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
@Component({
  selector: 'membership-list',
  templateUrl: './membership-list.template.html',
  providers: [MembershipService, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class MembershipListComponent {

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
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent:'',
      //deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      MEMID: {
        title: 'Member ID',
        type: 'string'
      },
      FNAME: {
        title: 'Member First Name',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private masterService: MasterRepo, private _authService: AuthService, private _membershipService: MembershipService, private _router: Router, public dialog: MdDialog) {
    let data: Array<TMember> = [];
    //console.log({ salesTerminal: masterService })
    this.masterService.getMembershipList()
      .subscribe(res => {
        data.push(<TMember>res);
        this.source.load(data);
      }, error => {
        this.masterService.resolveError(error, "membership-list - getMembershipList");
      }

      );
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
     this._router.navigate(["pages/masters/customer-info/add-customer-info", { mode: "add", returnUrl: this._router.url }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
     this._router.navigate(["pages/masters/customer-info/add-customer-info", { memberId: event.data.MEMID, mode: "edit", returnUrl: this._router.url }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this._router.navigate(["pages/masters/customer-info/add-customer-info", { memberId: event.data.MEMID, mode: "view", returnUrl: this._router.url }]);
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