import { Component } from '@angular/core';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { AuthService } from "../../../../common/services/permission/authService.service";

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from "@angular/router";
import 'style-loader!../../../Purchases/components/purchaseinvoice/smartTables.scss';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
//import {IncomeVoucherService} from './incomevoucher.services'
@Component({
  selector: 'credit-note-list',
  templateUrl: './credit-note-list.component.html',
  // providers:[IncomeVoucherService]
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class CreditNoteListComponent {
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
  constructor(private masterService: MasterRepo, private router: Router, public dialog: MdDialog) {
    try {
      let data: Array<any> = [];
      this.masterService.getTrnMainList("CN")
        .subscribe(res => {
          data.push(<any>res);
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "CreditNotes - getTrnMainList");
        });

    } catch (ex) {
    }
  }
  setMode() { }
  onAddClick() {
    try {
      // if (this._authService.checkMenuRight("creditnote", "add") == true) {
        this.router.navigate(["/pages/masters/acvouchers/creditnote/add-creditnote", { vt: 15, mode: "add", returnUrl: this.router.url }]);
      // } else {
      //   this.messageSubject.next("You are not authorized to add credit note.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
    }
  }
  onEditClick(event): void {
    try {
      // if (this._authService.checkMenuRight("creditnote", "edit") == true) {
        this.router.navigate(["/pages/masters/acvouchers/creditnote/add-creditnote", { vt: 15, id: event.data.VCHRNO, mode: "edit", returnUrl: this.router.url }]);
      // } else {
      //   this.messageSubject.next("You are not authorized to edit credit note.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
    }
  }

  onViewClick(event): void {
    try {
      // if (this._authService.checkMenuRight("creditnote", "view") == true) {
        this.router.navigate(["/pages/masters/acvouchers/creditnote/add-creditnote", { vt: 15, id: event.data.VCHRNO, mode: "view", returnUrl: this.router.url }])
      // } else {
      //   this.messageSubject.next("You are not authorized to view credit note.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
    }
  }

  onDeleteConfirm(): void { }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

}
