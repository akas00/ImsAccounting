import { Component, Injector } from '@angular/core';
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';
// import { SalesTerminal } from "./stock-issue.interface";

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';

import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';
@Component({
  selector: 'stock-issue-list',
  templateUrl: './stock-issue-list.template.html',
  providers: [],
  styleUrls: ["../../../Style.css", "../../../modal-style.css"],
})
export class StockIssueListComponent extends AppComponentBase{

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
    pager:{
      display:true,
      perPage:10
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

  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  PhiscalObj: any = <any>{};

  constructor(private masterService: MasterRepo,
     private authService: AuthService, 
    public injector : Injector,
     private _router: Router, public dialog: MdDialog) {
      super(injector);
    try {
      this.PhiscalObj = authService.getPhiscalInfo();
      var PID = this.PhiscalObj.PhiscalID;
      PID = PID.replace("/", "ZZ");
      let apiUrl = `${this.apiUrl}/getTrnMainPagedList/IS/${PID}`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { 
          endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        }); 

      // let data: Array<TrnMain> = [];
      // //console.log({ stockIssue: masterService })
      // //this.service.getJournalList()
      // this.masterService.getTrnMainList('IS')
      //   .subscribe(res => {
      //     data.push(<TrnMain>res);
      //   //  //console.log({ getTrnmain: res });
      //   }, error => {
      //     this.masterService.resolveError(error, "stock-issue-list - getTrnMainList");
      //   },
      //   () => {
      //     this.source.load(data);
      //     //console.log({ getTrnMainList: 'comlete', data: data })
      //   }

      //   );
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
      // if (this._authService.checkMenuRight("stock-issue", "add") == true) {
        this._router.navigate(["/pages/transaction/inventory/stock-issue/add-stock-issue", { vt: 5, mode: "add", returnUrl: this._router.url }])
      // } else {
      //   this.messageSubject.next("You are not authorized to add stock issue.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
      // if (this._authService.checkMenuRight("stock-issue", "edit") == true) {
        this._router.navigate(["/pages/transaction/inventory/stock-issue/add-stock-issue", { vt: 5, vchr: event.data.VCHRNO, returnUrl: this._router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit" }])
      // } else {
      //   this.messageSubject.next("You are not authorized to edit stock issue.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      // if (this._authService.checkMenuRight("stock-issue", "view") == true) {
        this._router.navigate(["/pages/transaction/inventory/stock-issue/add-stock-issue", { vt: 5, vchr: event.data.VCHRNO, returnUrl: this._router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view" }])
      // } else {
      //   this.messageSubject.next("You are not authorized to view stock issue.");
      //   this.openAuthDialog();
      // }
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