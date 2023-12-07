import { Component, Injector } from '@angular/core';
import { AuthService } from "../../../../common/services/permission/authService.service"; 
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';
import { BankMasterService } from './bank.service';

@Component({
  selector: 'bank-list',
  templateUrl: './bank-list.component.html',
  providers: [MasterRepo,BankMasterService],
  styleUrls: ["../../../modal-style.css"],
})
export class BankListComponent extends AppComponentBase{

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    // view: {
    //   viewButtonContent: 'View',
    //   saveButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    edit: {
      editButtonContent: '<button type="button" class="btn btn-info">Edit</button>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    pager:{
      display:true,
      perPage:10
    },
    columns: {
      ADDRESS: {
        title: 'Branch Name',
        type: 'string'
      },
      ACCODE: {
        title: 'Branch Code',
        type: 'string'
      },
      ACNAME: {
        title: 'Bank Name',
        type: 'string'
      }, 
      IFSC_CODE: {
        title: 'IFSC CODE',
        type: 'number'
      },
      ISACTIVE: {
        title: 'Status',
        type: 'number',
        valuePrepareFunction: (value) => { return value==1?'Active':'InActive'; },
        filter: {
          type: 'list',
            config: {
              selectText: 'Show all',
                list: [
                  { value: 1, title: 'Active' },
                  { value: 0, title: 'InActive' },
                ]
              }
            }
      }
      
    }
  };
  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(
    //private _authService: AuthService, 
    private router: Router, 
    public dialog: MdDialog,
    public injector : Injector
    ) {
      super(injector);
    try { 
      let apiUrl = `${this.apiUrl}/getAllBankMasterPagedList`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        }); 
     
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  
  addNewBank(): void {
    try {
     
        this.router.navigate(["./pages/account/AccountLedger/bank/add-bank", { mode: "add", returnUrl: this.router.url }])
 
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
    this.router.navigate(["./pages/account/AccountLedger/bank/add-bank", { ACID: event.data.ACID, mode: "edit", returnUrl: this.router.url }]);
      
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
     // this.router.navigate(["pages/masters/Branch", { name: event.data.BRANCHID, mode: "view", returnUrl: this.router.url }]);
      if (this._authService.checkMenuRight("bank", "view") == true) {
        this.router.navigate(["./pages/account/AccountLedger/bank", { mode: "view", returnUrl: this.router.url }])
      } else {
        this.messageSubject.next("You are not authorized to View new bank.");
        this.openAuthDialog();
      }
    
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
  
}