import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'dispatchIn-list',
  templateUrl: './dispatch-in-list.component.html',
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class DispatchInListComponent {
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
      },
      TRNDATE: {
        title: 'Date',
        type: 'string'
      },
      BSDATE: {
        title: 'Miti',
        type: 'string'
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  busy:Subscription
  constructor(private _authService: AuthService, private router: Router, private masterService: MasterRepo, public dialog: MdDialog) {
    try {
      let data: Array<any> = [];
      ////console.log("calling service")
      this.busy= this.masterService.getTrnMainList("DR")
        .subscribe(res => {
         // //console.log({ purchaseData: res })
          data.push(<any>res);

          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "dispatch-list - getTrnMainList");
        });
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  setMode() { }
  onAddClick() {
    try {
      this.router.navigate(["/pages/inventory/dispatch/add-dispatchIn", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
      this.router.navigate(["/pages/inventory/dispatch/add-dispatchIn", { vchr: event.data.VCHRNO, returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit" }]);
      
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["/pages/inventory/dispatch/add-dispatchIn", { vchr: event.data.VCHRNO, mode: "view", returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID }])
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

  onDeleteConfirm(event): void { }
}