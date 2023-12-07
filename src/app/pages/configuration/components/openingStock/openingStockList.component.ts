import { Component } from '@angular/core';
import { AuthDialog } from "./../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { MdDialog, MdDialogModule } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'op',
  template: `<div class="widgets">
 <div class ="row">

      <button type="button" class="btn btn-info" (click)="onAddClick()" style="margin-bottom:10px;margin-left:18px">Add Opening Stock</button>

  </div>
  <div class="row">
    <ba-card title="Opening Stock" baCardClass="with-scroll">
      <ng2-smart-table [settings]="settings" [source]="source"  (edit)="onEditClick($event)" (view)="onViewClick($event)" (deleteConfirm)="onDeleteConfirm($event)"></ng2-smart-table>
    </ba-card>
  </div>


</div>

`,
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class openingstocklistComponent {
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
      PhiscalID: {
        title: 'Fiscal Year',
        type: 'string'
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(private _authService: AuthService, private router: Router, private masterService: MasterRepo, public dialog: MdDialog) {
    try {
      let data: Array<any> = [];
      this.masterService.getList({}, '/getopeningstock')
        .subscribe(res => {
          data = res;
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "openingstocklist - getopeningstockList");
        });

    } catch (ex) {
      alert(ex);
    }
  }
  setMode() { }
  onAddClick() {
    try {
      this.router.navigate(["/pages/configuration/openingStock/add-openingstock", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["/pages/configuration/openingStock/add-openingstock", { c: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }

  onDeleteConfirm(event): void { }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
}
