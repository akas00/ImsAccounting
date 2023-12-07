import { Component, Injector } from '@angular/core';
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import 'style-loader!../../../Purchases/components/purchaseinvoice/smartTables.scss';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';
import { AuthService } from '../../../../common/services/permission/authService.service';

@Component({
  selector: 'debit-note-list',
  templateUrl: './debit-note-list.component.html',
  // providers:[IncomeVoucherService]
  providers: [],
  styleUrls: ["../../../modal-style.css"],
})
export class DebitNoteListComponent extends AppComponentBase {
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
    pager: {
      display: true,
      perPage: 10
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
  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  PhiscalObj: any = <any>{};

  constructor(// private _authService: AuthService,
    public injector: Injector,
    private router: Router, public dialog: MdDialog,
    private authService: AuthService
    ) {
    super(injector);
    try {
      this.PhiscalObj = authService.getPhiscalInfo();
      var PID = this.PhiscalObj.PhiscalID;
      PID = PID.replace("/", "ZZ")
      let apiUrl = `${this.apiUrl}/getTrnMainPagedList/PI/${PID}`;
      this.source =  this.source = new ServerDataSource(this._http,
        {
          endPoint: apiUrl,
          dataKey : "data",
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        });

      // let data: Array<any> = [];
      // this.masterService.getTrnMainList("DN")
      //   .subscribe(res => {
      //     data.push(<any>res);
      //     this.source.load(data);
      //   }, error => {
      //     this.masterService.resolveError(error, "DebitNotes - getTrnMainList");
      //   });

    } catch (ex) {
    }
  }
  setMode() { }
  onAddClick() {
    try {
      this.router.navigate(["./pages/masters/acvouchers/debitnote/add-debitnote", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["./pages/masters/acvouchers/debitnote/add-debitnote", { ptypeID: event.data.PTYPEID, mode: "edit", returnUrl: this.router.url }]);
    } catch (ex) {
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["./pages/masters/acvouchers/debitnote/add-debitnote", { ptypeID: event.data.PTYPEID, mode: "view", returnUrl: this.router.url }]);
    } catch (ex) {
    }
  }

  onDeleteConfirm(): void { }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

}
